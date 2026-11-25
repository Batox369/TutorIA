// Lógica del tutor: flujo intento -> pista -> práctica, con progreso en localStorage.

const CLAVE_PROGRESO = "tutoria_progreso";
const NIVELES = ["Pregunta guía", "Pista concreta", "Repaso del concepto"];
const FORMATO = {
  numero: "Ejemplos: 4, -7, 1/2. También puedes escribir «indeterminado», «no existe» o ∞.",
  funcion: "Ejemplos: 12x^3 - 10x, 2x*sin(x) + x^2*cos(x). Usa sin, cos y ^ para potencias.",
  complejo: "Ejemplos: 2 + 3i, -5 - 10i."
};

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let progreso = JSON.parse(localStorage.getItem(CLAVE_PROGRESO) || "{}");
let tema = TEMAS[0];
let ej = null;            // ejercicio actual
let nivel = 0;            // siguiente peldaño de la escalera de pistas
let yaExplico = false;    // el estudiante ya envió su planteamiento
let resuelto = false;

function prog(id) {
  return (progreso[id] ||= { idx: 0, completado: false, intentos: 0, pistas: 0 });
}
function guardar() { localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso)); }

// ---------- Lista de temas ----------
function pintarTemas() {
  $("lista-temas").innerHTML = TEMAS.map((t) => {
    const p = prog(t.id);
    const estado = p.completado ? `<span class="estado hecho">✓ Dominado</span>` : `<span class="estado">${p.idx}/${t.ejercicios.length}</span>`;
    return `<button class="tema-btn ${t.id === tema.id ? "activo" : ""}" data-id="${t.id}">
      <span class="ico">${t.icono}</span>
      <span class="info"><b>${t.nombre}</b><small>${t.curso}</small></span>${estado}
    </button>`;
  }).join("");
  document.querySelectorAll(".tema-btn").forEach((b) =>
    b.addEventListener("click", () => abrirTema(TEMAS.find((t) => t.id === b.dataset.id)))
  );
}

function abrirTema(t) {
  tema = t;
  history.replaceState(null, "", "#" + t.id);
  pintarTemas();
  const p = prog(t.id);
  if (p.completado) pintarCompleto();
  else abrirEjercicio(p.idx);
}

// ---------- Ejercicio ----------
function abrirEjercicio(idx) {
  ej = tema.ejercicios[idx];
  nivel = 0;
  yaExplico = false;
  resuelto = false;

  const pasos = tema.ejercicios.map((e, i) => {
    const cls = i < idx ? "done" : i === idx ? "on" : "";
    return `<span class="paso-tag ${cls}">${e.final ? "Ejercicio final" : "Práctica " + (i + 1)}</span>`;
  }).join("");

  $("panel").innerHTML = `
    <div class="pasos">${pasos}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <b>${tema.curso} · ${tema.nombre}</b>
      ${ej.final ? `<span class="badge-final">Menos apoyo: solo ${ej.escalera.length} pista</span>` : ""}
    </div>
    <div class="enunciado" id="enunciado">${ej.enunciado}</div>

    <div class="campo">
      <label for="proceso">1. ¿Cómo lo empezarías? Explica tu primer paso</label>
      <textarea id="proceso" rows="3" placeholder="Ej.: Primero reemplazo x = 2 y veo qué sale…"></textarea>
    </div>
    <div class="campo">
      <label for="respuesta">2. Tu resultado (cuando lo tengas)</label>
      <input id="respuesta" autocomplete="off" spellcheck="false" placeholder="Escribe tu resultado">
      <div class="ayuda">${FORMATO[ej.tipo]}</div>
      <div class="preview vacio" id="preview">Vista previa de tu respuesta</div>
    </div>
    <div class="acciones">
      <button class="btn btn-primary" id="btn-enviar">Enviar intento</button>
      <button class="btn btn-ghost" id="btn-pista"></button>
      <button class="btn btn-primary" id="btn-siguiente" hidden></button>
    </div>`;

  renderMathInElement($("enunciado"), { delimiters: [{ left: "\\(", right: "\\)", display: false }] });
  $("respuesta").addEventListener("input", pintarPreview);
  $("respuesta").addEventListener("keydown", (e) => { if (e.key === "Enter") enviar(); });
  $("btn-enviar").addEventListener("click", enviar);
  $("btn-pista").addEventListener("click", () => darPista(true));
  $("btn-siguiente").addEventListener("click", siguiente);
  actualizarBotonPista();

  $("mensajes").innerHTML = "";
  decir(ej.final
    ? "Último paso: un ejercicio parecido, pero con menos apoyo. Así comprobamos que ya lo dominas. ¡Tú puedes!"
    : "Lee el ejercicio y cuéntame cómo lo empezarías. No necesitas tener el resultado para enviarme tu intento.");
  pintarStats();
}

function pintarPreview() {
  const v = $("respuesta").value.trim();
  const el = $("preview");
  if (!v) { el.className = "preview vacio"; el.textContent = "Vista previa de tu respuesta"; return; }
  try {
    katex.render(Corrector.aTex(v), el, { throwOnError: true });
    el.className = "preview";
  } catch {
    el.className = "preview vacio";
    el.textContent = "…sigue escribiendo";
  }
}

function actualizarBotonPista() {
  const b = $("btn-pista");
  const quedan = ej.escalera.length - nivel;
  b.disabled = quedan <= 0 || resuelto;
  b.textContent = quedan > 0 ? `Pedir pista (${quedan})` : "Sin más pistas";
}

// ---------- Chat ----------
function decir(html, clase = "", quien = "Tutor.IA") {
  const div = document.createElement("div");
  div.className = `bubble tutor ${clase}`;
  div.innerHTML = `<span class="quien">${quien}</span>${html}`;
  $("mensajes").appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
}
function dijoAlumno(html) {
  const div = document.createElement("div");
  div.className = "bubble alumno";
  div.innerHTML = `<span class="quien">Tú</span>${html}`;
  $("mensajes").appendChild(div);
}

function darPista(pedida) {
  if (nivel >= ej.escalera.length) return false;
  decir(esc(ej.escalera[nivel]), "nivel", `${NIVELES[ej.final ? 1 : nivel]}`);
  nivel++;
  if (pedida) { prog(tema.id).pistas++; guardar(); }
  actualizarBotonPista();
  pintarStats();
  return true;
}

function pintarStats() {
  const p = prog(tema.id);
  $("st-intentos").textContent = p.intentos;
  $("st-pistas").textContent = p.pistas;
}

// ---------- Envío del intento ----------
function enviar() {
  if (resuelto) return;
  const proceso = $("proceso").value.trim();
  const resp = $("respuesta").value.trim();

  if (!yaExplico && proceso.length < 10) {
    decir("Antes de revisar tu resultado, cuéntame en el paso 1 cómo lo empezaste. Me ayuda a encontrar dónde te trabaste.", "warn");
    $("proceso").focus();
    return;
  }

  // Mensaje del alumno
  let html = "";
  if (proceso && proceso !== dijoAlumno.ultimo) html += esc(proceso);
  if (resp) {
    let tex = "";
    try { tex = katex.renderToString(Corrector.aTex(resp)); } catch { tex = esc(resp); }
    html += `${html ? "<br>" : ""}<b>Resultado:</b> ${tex}`;
  }
  if (!html) return;
  dijoAlumno(html);
  dijoAlumno.ultimo = proceso;

  // Señales en el planteamiento (solo la primera vez que aparece)
  if (proceso && !yaExplico) {
    const s = ej.senales.find((x) => x.patron.test(proceso));
    if (s) decir(esc(s.msg));
  }
  yaExplico = true;

  if (!resp) {
    decir("Bien, ya tengo tu planteamiento. Sigue con ese paso y cuando tengas un resultado, escríbelo en el paso 2.");
    if (nivel === 0) darPista(false);
    return;
  }

  const p = prog(tema.id);
  p.intentos++;
  guardar();
  pintarStats();

  const r = Corrector.revisar(ej, resp);
  if (r.estado === "correcto") return acierto();
  if (r.estado === "ilegible") {
    decir(esc(r.msg || "No pude leer tu respuesta. Revisa el formato: " + FORMATO[ej.tipo]), "warn");
    return;
  }
  if (r.estado === "error_conocido") {
    decir(`<b>Encontré dónde está el error.</b> ${esc(r.msg)}`, "warn");
    return;
  }
  // Incorrecto sin diagnóstico: subir un peldaño en la escalera
  decir("Todavía no es correcto. Revisa tu proceso paso a paso.", "warn");
  if (!darPista(false)) {
    decir("Ya tienes todas las pistas. Vuelve a leerlas con calma: la respuesta sale de ahí. No te la voy a dar, pero sé que puedes llegar.");
  }
}

function acierto() {
  resuelto = true;
  const p = prog(tema.id);
  decir(`<b>¡Correcto! Lo resolviste tú.</b> ${nivel === 0 ? "Y sin pistas. 💪" : `Usaste ${nivel} pista${nivel > 1 ? "s" : ""}.`}`, "ok");
  actualizarBotonPista();
  $("btn-enviar").disabled = true;
  const b = $("btn-siguiente");
  b.hidden = false;
  b.textContent = ej.final ? "Ver mi resultado →" : "Siguiente ejercicio →";
  if (!ej.final) p.idx++;
  guardar();
  pintarTemas();
}

function siguiente() {
  const p = prog(tema.id);
  if (ej.final) {
    p.completado = true;
    p.idx = tema.ejercicios.length;
    guardar();
    pintarTemas();
    pintarCompleto();
  } else {
    abrirEjercicio(p.idx);
  }
}

function pintarCompleto() {
  const p = prog(tema.id);
  const siguienteTema = TEMAS.find((t) => !prog(t.id).completado);
  $("panel").innerHTML = `
    <div class="completo">
      <div class="big">🎯</div>
      <h2>Dominas ${tema.nombre}</h2>
      <p style="color:var(--muted)">Resolviste los ${tema.ejercicios.length} ejercicios, incluido el final con menos apoyo.<br>
      Intentos: <b>${p.intentos}</b> · Pistas pedidas: <b>${p.pistas}</b></p>
      <div class="acciones" style="justify-content:center">
        ${siguienteTema ? `<button class="btn btn-primary" id="btn-otro">Siguiente tema: ${siguienteTema.nombre}</button>` : ""}
        <button class="btn btn-ghost" id="btn-repetir">Repetir este tema</button>
      </div>
    </div>`;
  $("mensajes").innerHTML = "";
  decir("Ahora sabes tu nivel real en este tema, sin haber copiado ninguna respuesta. ¡Así se llega al examen!", "ok");
  pintarStats();
  if (siguienteTema) $("btn-otro").addEventListener("click", () => abrirTema(siguienteTema));
  $("btn-repetir").addEventListener("click", () => {
    progreso[tema.id] = { idx: 0, completado: false, intentos: 0, pistas: 0 };
    guardar();
    abrirTema(tema);
  });
}

$("btn-reset").addEventListener("click", () => {
  if (!confirm("¿Borrar tu progreso en todos los temas?")) return;
  progreso = {};
  guardar();
  abrirTema(TEMAS[0]);
});

// Inicio
abrirTema(TEMAS.find((t) => t.id === location.hash.slice(1)) || TEMAS[0]);
