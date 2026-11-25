# Tutor.IA

Tutor de matemática para estudiantes de primeros ciclos que **no da la respuesta**: ubica el paso donde te equivocaste y te guía con preguntas hasta que lo resuelves tú.

Proyecto de Emprendimiento, Grupo 5.

## Qué incluye el MVP

- **Landing** (`index.html`): problema, solución, propuesta de valor y registro al piloto (meta: 100 estudiantes).
- **Tutor** (`tutor.html`): 4 temas (Límites, Derivadas, Números complejos y Determinantes), cada uno con 2 ejercicios de práctica y 1 ejercicio final con menos apoyo.
  1. El estudiante explica cómo empezaría y envía su resultado.
  2. Si comete un error típico, el tutor le dice en qué paso está el error.
  3. Si no, sube por una escalera de ayuda: pregunta guía, luego pista concreta y luego repaso del concepto. Nunca muestra la respuesta.
  4. Al terminar el ejercicio final, el tema se marca como dominado.

Funciona 100 % en el navegador, sin servidor ni API key. Las respuestas se comparan matemáticamente con [math.js](https://mathjs.org/): por ejemplo, `2x*sin(x) + x^2*cos(x)` y `x²cos(x) + 2xsen(x)` cuentan como la misma respuesta.

## Correr en local

```bash
python -m http.server 5173
```

Luego abre http://localhost:5173.

## Agregar ejercicios

Edita `js/ejercicios.js`. Cada ejercicio tiene `respuesta`, `errores` (los errores típicos, cada uno con su retroalimentación), `escalera` (las pistas) y `senales` (palabras clave en el planteamiento del estudiante).

## Pendiente (siguiente versión)

- Conectar un modelo de lenguaje a través de un servidor (por ejemplo, una función serverless) para diagnosticar errores no previstos. **Nunca** pongas la API key en este repositorio.
- Guardar los registros del piloto en un backend (Google Forms, Formspree o Supabase). Por ahora se guardan solo en el navegador.
