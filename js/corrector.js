// Corrector de respuestas: compara la respuesta del estudiante con la esperada
// sin mostrarla nunca. Usa math.js (global `math`) para evaluar expresiones.

const Corrector = (() => {
  const ESPECIALES = [
    { token: "@indeterminado", re: /indetermin|^0\s*\/\s*0$|(∞|inf|infinito)\s*\/\s*(∞|inf|infinito)/ },
    { token: "@noexiste", re: /no\s*existe|^ne$|^dne$/ },
    { token: "@menosinfinito", re: /^-\s*(∞|inf|infinito|infinity)$/ },
    { token: "@infinito", re: /^\+?\s*(∞|inf|infinito|infinity)$/ }
  ];

  const FUNCIONES = "sin|cos|tan|log|sqrt|exp|sec|csc|cot";

  function normalizar(texto) {
    let s = String(texto || "").trim().toLowerCase();
    // Quita "f'(x) =", "y' =", etc.
    if (s.includes("=")) s = s.slice(s.lastIndexOf("=") + 1).trim();
    s = s
      .replace(/−|–/g, "-")
      .replace(/[·×]/g, "*")
      .replace(/÷/g, "/")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4")
      .replace(/π/g, "pi")
      .replace(/(\d),(\d)/g, "$1.$2")
      .replace(/sen\s*\(/g, "sin(")
      .replace(/\bln\b/g, "log")
      .replace(/√\s*\(/g, "sqrt(");
    // Multiplicación implícita antes de funciones: "2xsin(x)" -> "2x*sin(x)"
    s = s.replace(new RegExp(`([0-9a-z)])\\s*(${FUNCIONES})\\s*\\(`, "g"), "$1*$2(");
    return s;
  }

  function especial(s) {
    if (s.startsWith("@")) return s;
    for (const e of ESPECIALES) if (e.re.test(s)) return e.token;
    return null;
  }

  function evaluar(s, tipo, scope) {
    const v = math.evaluate(s, scope || {});
    if (tipo === "complejo") {
      const c = math.complex(v);
      return { re: c.re, im: c.im };
    }
    if (typeof v === "number") return v;
    if (v && typeof v.re === "number" && Math.abs(v.im) < 1e-9) return v.re;
    if (v && typeof v.toNumber === "function") return v.toNumber();
    throw new Error("no numérico");
  }

  const cerca = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));

  const PUNTOS = [-2.3, -1.1, -0.4, 0.35, 0.9, 1.7, 2.6, 3.2];

  // Devuelve true si a y b (ya normalizadas) son equivalentes para el tipo dado.
  function equivalentes(a, b, tipo) {
    const ea = especial(a), eb = especial(b);
    if (ea || eb) return ea === eb;
    if (tipo === "funcion") {
      return PUNTOS.every((x) => cerca(evaluar(a, "numero", { x }), evaluar(b, "numero", { x })));
    }
    if (tipo === "complejo") {
      const va = evaluar(a, "complejo"), vb = evaluar(b, "complejo");
      return cerca(va.re, vb.re) && cerca(va.im, vb.im);
    }
    return cerca(evaluar(a, "numero"), evaluar(b, "numero"));
  }

  // Verifica que la expresión se pueda leer; lanza un error con mensaje amigable si no.
  function validar(s, tipo) {
    if (especial(s)) return;
    const nodo = math.parse(s);
    const permitidas = tipo === "funcion" ? ["x", "pi", "e"] : tipo === "complejo" ? ["i", "pi", "e"] : ["pi", "e"];
    const fn = new Set(FUNCIONES.split("|"));
    nodo.traverse((n, path, padre) => {
      if (n.isSymbolNode) {
        const esFuncion = padre && padre.isFunctionNode && path === "fn";
        if (esFuncion ? !fn.has(n.name) : !permitidas.includes(n.name)) {
          throw new Error(`No reconozco «${n.name}». Usa * entre factores, por ejemplo 2x*sin(x).`);
        }
      }
    });
    if (tipo === "funcion") evaluar(s, "numero", { x: 0.7 });
    else evaluar(s, tipo);
  }

  /**
   * Revisa la respuesta del estudiante.
   * @returns {{estado: "correcto"|"error_conocido"|"incorrecto"|"ilegible", msg?: string}}
   */
  function revisar(ejercicio, respuesta) {
    const s = normalizar(respuesta);
    try {
      validar(s, ejercicio.tipo);
    } catch (e) {
      return { estado: "ilegible", msg: e.message && e.message.startsWith("No reconozco") ? e.message : null };
    }
    try {
      if (equivalentes(s, normalizar(ejercicio.respuesta), ejercicio.tipo)) return { estado: "correcto" };
    } catch (e) {
      return { estado: "ilegible", msg: null };
    }
    for (const err of ejercicio.errores || []) {
      try {
        if (equivalentes(s, normalizar(err.valor), ejercicio.tipo)) return { estado: "error_conocido", msg: err.msg };
      } catch (e) { /* ignorar errores no comparables */ }
    }
    return { estado: "incorrecto" };
  }

  function aTex(respuesta) {
    const s = normalizar(respuesta);
    const e = especial(s);
    if (e === "@infinito") return "\\infty";
    if (e === "@menosinfinito") return "-\\infty";
    if (e === "@indeterminado") return "\\text{indeterminado}";
    if (e === "@noexiste") return "\\text{no existe}";
    return math.parse(s).toTex({ implicit: "hide" });
  }

  return { revisar, normalizar, aTex };
})();

if (typeof module !== "undefined") module.exports = Corrector;
