// Banco de ejercicios de Tutor.IA (MVP sin API).
// Cada tema tiene 2 ejercicios de práctica y 1 ejercicio final con menos apoyo.
//
// tipo:      "numero" | "funcion" (variable x) | "complejo"
// respuesta: expresión que el corrector compara (nunca se le muestra al estudiante)
// errores:   respuestas incorrectas típicas -> retroalimentación sobre el paso exacto
// escalera:  [pregunta guía, pista concreta, repaso del concepto previo]
// senales:   palabras en el intento que indican buen camino o un error de método

const TEMAS = [
  {
    id: "limites",
    curso: "Cálculo 1",
    nombre: "Límites",
    icono: "→",
    ejercicios: [
      {
        enunciado: "Calcula \\( \\displaystyle \\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} \\)",
        tipo: "numero",
        respuesta: "4",
        errores: [
          { valor: "@indeterminado", msg: "Reemplazar x = 2 te da 0/0. Eso no es el resultado: es la señal de que tienes que transformar la expresión antes de evaluar. ¿Qué podrías hacer con el numerador?" },
          { valor: "0", msg: "Parece que evaluaste solo el numerador (4 − 4 = 0). Pero el denominador también se hace 0. ¿Qué pasa con el factor (x − 2)?" },
          { valor: "@noexiste", msg: "El límite sí existe aunque la función no esté definida en x = 2. Lo que importa es a qué valor se acerca cuando x está muy cerca de 2." },
          { valor: "2", msg: "Casi: después de simplificar te queda una expresión en x. ¿Reemplazaste x = 2 en toda la expresión simplificada?" }
        ],
        escalera: [
          "¿Qué obtienes si reemplazas x = 2 directamente? ¿Qué te dice ese resultado?",
          "x² − 4 es una diferencia de cuadrados: a² − b² = (a − b)(a + b). Escríbelo así y mira qué factor se repite arriba y abajo.",
          "Repaso: cuando un límite da 0/0, se cancela el factor común. Se puede porque x se acerca a 2 pero nunca vale 2, así que (x − 2) ≠ 0."
        ],
        senales: [
          { patron: /factori|diferencia de cuadrados|\(x\s*[-−]\s*2\)\s*\(x\s*\+\s*2\)|\(x\s*\+\s*2\)\s*\(x\s*[-−]\s*2\)/i, msg: "Buen inicio: factorizar es justo el camino." },
          { patron: /l.?h[oô]pital/i, msg: "L'Hôpital funciona aquí, pero en primeros ciclos se espera que lo resuelvas factorizando. Intenta también ese camino." }
        ]
      },
      {
        enunciado: "Calcula \\( \\displaystyle \\lim_{x \\to \\infty} \\frac{3x^2 + 1}{x^2 - 5x} \\)",
        tipo: "numero",
        respuesta: "3",
        errores: [
          { valor: "@infinito", msg: "Arriba y abajo crecen a la vez. Comparar solo el numerador no basta: ¿qué término manda en cada uno cuando x es enorme?" },
          { valor: "@indeterminado", msg: "∞/∞ es una forma indeterminada, no el resultado. ¿Qué pasa si divides todo entre la mayor potencia de x?" },
          { valor: "0", msg: "El resultado sería 0 si el grado del denominador fuera mayor. Fíjate: ¿qué grado tiene el numerador y qué grado el denominador?" },
          { valor: "-1/5", msg: "Parece que tomaste el término independiente del numerador y el coeficiente de x del denominador. Cuando x → ∞, ¿qué términos dominan?" }
        ],
        escalera: [
          "Cuando x es muy grande (por ejemplo, un millón), ¿qué término pesa más en el numerador y cuál en el denominador?",
          "Divide cada término entre x². Los términos como 1/x² o 5/x, ¿a qué valor se acercan cuando x → ∞?",
          "Repaso: en un cociente de polinomios del mismo grado, el límite al infinito es el cociente de los coeficientes principales."
        ],
        senales: [
          { patron: /divid|x\^?2|x²|grado|coeficiente/i, msg: "Bien: comparar las potencias más altas es la clave." }
        ]
      },
      {
        final: true,
        enunciado: "Calcula \\( \\displaystyle \\lim_{x \\to 1} \\frac{x^2 + x - 2}{x - 1} \\)",
        tipo: "numero",
        respuesta: "3",
        errores: [
          { valor: "@indeterminado", msg: "Otra vez sale 0/0: ya sabes qué significa. ¿Qué factor común puedes buscar?" },
          { valor: "0", msg: "Revisa: el denominador también se anula en x = 1." },
          { valor: "2", msg: "Revisa la factorización: busca dos números que multiplicados den −2 y sumados den 1." }
        ],
        escalera: [
          "Factoriza x² + x − 2 como (x − 1)(x + ?). ¿Qué número va en el signo de interrogación?"
        ],
        senales: [
          { patron: /factori|\(x\s*[-−]\s*1\)/i, msg: "Vas bien con la factorización." }
        ]
      }
    ]
  },
  {
    id: "derivadas",
    curso: "Cálculo 1",
    nombre: "Derivadas",
    icono: "f′",
    ejercicios: [
      {
        enunciado: "Deriva \\( f(x) = 3x^4 - 5x^2 + 7 \\)",
        tipo: "funcion",
        respuesta: "12x^3 - 10x",
        errores: [
          { valor: "12x^3 - 10x + 7", msg: "Los dos primeros términos están bien. Revisa el último paso: ¿cuánto vale la derivada de una constante como 7?" },
          { valor: "3x^3 - 5x", msg: "Bajaste bien el exponente en 1, pero en la regla de la potencia el exponente también multiplica al coeficiente. ¿Qué pasa con el 4 de x⁴?" },
          { valor: "12x^4 - 10x^2", msg: "Multiplicaste por el exponente, pero falta un paso: después el exponente baja en 1." }
        ],
        escalera: [
          "Deriva término por término. ¿Qué regla se aplica a xⁿ?",
          "Regla de la potencia: d/dx (a·xⁿ) = a·n·xⁿ⁻¹. Aplícala a 3x⁴ y luego a −5x².",
          "Repaso: la derivada mide la tasa de cambio. Una constante no cambia, así que su derivada es 0."
        ],
        senales: [
          { patron: /potencia|n\s*\*?\s*x|baj/i, msg: "Bien: es un ejercicio de regla de la potencia." }
        ]
      },
      {
        enunciado: "Deriva \\( f(x) = x^2 \\sin(x) \\)",
        tipo: "funcion",
        respuesta: "2x*sin(x) + x^2*cos(x)",
        errores: [
          { valor: "2x*cos(x)", msg: "Derivaste cada factor y multiplicaste los resultados. La derivada de un producto no funciona así. ¿Recuerdas la regla del producto?" },
          { valor: "2x*sin(x) - x^2*cos(x)", msg: "La estructura está bien. Revisa el signo: ¿cuál es la derivada de sen(x)?" },
          { valor: "2x*sin(x)", msg: "Te falta una parte: derivaste x² pero no derivaste sen(x)." },
          { valor: "x^2*cos(x)", msg: "Te falta una parte: derivaste sen(x) pero no derivaste x²." }
        ],
        escalera: [
          "f(x) es el producto de dos funciones. ¿Cuáles son u(x) y v(x)?",
          "Regla del producto: (u·v)′ = u′·v + u·v′. Con u = x² y v = sen(x), ¿cuánto valen u′ y v′?",
          "Repaso: (sen x)′ = cos x y (cos x)′ = −sen x. Escribe también: sen x se ingresa como sin(x)."
        ],
        senales: [
          { patron: /producto|u\s*['′]?\s*v|u'v/i, msg: "Bien: identificaste un producto." }
        ]
      },
      {
        final: true,
        enunciado: "Deriva \\( f(x) = (2x + 1)^3 \\)",
        tipo: "funcion",
        respuesta: "6(2x+1)^2",
        errores: [
          { valor: "3(2x+1)^2", msg: "Aplicaste la potencia, pero falta multiplicar por la derivada de lo de adentro (regla de la cadena)." },
          { valor: "3(2x+1)^3", msg: "En la regla de la potencia el exponente baja en 1." }
        ],
        escalera: [
          "Hay una función dentro de otra. ¿Cuál es la de afuera y cuál la de adentro? No olvides la derivada de la de adentro."
        ],
        senales: [
          { patron: /cadena|adentro|interna/i, msg: "Bien: es un ejercicio de regla de la cadena." },
          { patron: /expand|desarroll|binomio/i, msg: "Expandir funciona, pero es más largo. ¿Conoces una regla más directa?" }
        ]
      }
    ]
  },
  {
    id: "complejos",
    curso: "Álgebra",
    nombre: "Números complejos",
    icono: "i",
    ejercicios: [
      {
        enunciado: "Calcula \\( (3 + 2i)(1 - 4i) \\). Escribe el resultado en la forma a + bi.",
        tipo: "complejo",
        respuesta: "11 - 10i",
        errores: [
          { valor: "3 - 8i", msg: "Multiplicaste solo real con real e imaginario con imaginario. Hay que distribuir los cuatro productos, como en (a + b)(c + d)." },
          { valor: "-5 - 10i", msg: "Distribuiste bien, pero revisa el término 2i · (−4i) = −8i². ¿Cuánto vale i²?" },
          { valor: "3 - 10i", msg: "Te falta el término −8i². Al convertirlo con i² = −1 se vuelve un número real que cambia la parte real." },
          { valor: "11 + 10i", msg: "La parte real está bien. Revisa los signos de los términos con i: −12i + 2i." }
        ],
        escalera: [
          "¿Cuántos productos salen al multiplicar dos binomios? Escríbelos todos.",
          "3·1 + 3·(−4i) + 2i·1 + 2i·(−4i). Ahora reemplaza i² por su valor.",
          "Repaso: i = √−1, así que i² = −1. Cualquier i² se convierte en un número real."
        ],
        senales: [
          { patron: /distribu|i\s*\^?\s*2|i²|-1/i, msg: "Bien: recordar que i² = −1 es clave aquí." }
        ]
      },
      {
        enunciado: "Calcula \\( \\dfrac{5 + i}{1 - i} \\). Escribe el resultado en la forma a + bi.",
        tipo: "complejo",
        respuesta: "2 + 3i",
        errores: [
          { valor: "4 + 6i", msg: "El numerador está bien, pero no dividiste entre el nuevo denominador. ¿Cuánto vale (1 − i)(1 + i)?" },
          { valor: "3 + 3i", msg: "Revisa i² en el numerador: (5 + i)(1 + i) incluye un i², que vale −1." },
          { valor: "4", msg: "No se puede dividir parte por parte (5/1 e i/−i). Hay que eliminar la i del denominador." },
          { valor: "2 - 3i", msg: "Casi. Revisa el signo de la parte imaginaria: 5i + i." }
        ],
        escalera: [
          "No se puede dejar i en el denominador. ¿Por qué número podrías multiplicar arriba y abajo para que desaparezca?",
          "Multiplica numerador y denominador por el conjugado (1 + i). Recuerda que (a − bi)(a + bi) = a² + b².",
          "Repaso: el conjugado de a + bi es a − bi. Un número multiplicado por su conjugado siempre da un real."
        ],
        senales: [
          { patron: /conjugad/i, msg: "Bien: el conjugado es justo la herramienta." }
        ]
      },
      {
        final: true,
        enunciado: "Calcula \\( (1 + 2i)(3 - i) \\). Escribe el resultado en la forma a + bi.",
        tipo: "complejo",
        respuesta: "5 + 5i",
        errores: [
          { valor: "1 + 5i", msg: "Revisa el término 2i · (−i). ¿Cuánto vale i²?" },
          { valor: "3 - 2i", msg: "Hay que distribuir los cuatro productos, no solo real con real e imaginario con imaginario." }
        ],
        escalera: [
          "Distribuye los cuatro productos y recuerda que i² = −1."
        ],
        senales: []
      }
    ]
  },
  {
    id: "matrices",
    curso: "Álgebra lineal",
    nombre: "Determinantes",
    icono: "|A|",
    ejercicios: [
      {
        enunciado: "Calcula el determinante de \\( A = \\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix} \\)",
        tipo: "numero",
        respuesta: "5",
        errores: [
          { valor: "11", msg: "Sumaste los productos de las diagonales. En el determinante 2×2 los productos se restan." },
          { valor: "-5", msg: "El orden importa: primero va la diagonal principal (de arriba a la izquierda hacia abajo a la derecha) y luego se resta la otra." },
          { valor: "10", msg: "Parece que sumaste todos los elementos. El determinante se calcula con productos cruzados." }
        ],
        escalera: [
          "¿Qué dos elementos forman la diagonal principal y cuáles la secundaria?",
          "Para una matriz 2×2 con filas (a b) y (c d): det = a·d − b·c.",
          "Repaso: el determinante indica si la matriz es invertible (det ≠ 0) y cuánto escala áreas."
        ],
        senales: [
          { patron: /diagonal|ad\s*[-−]\s*bc|a\s*\*?\s*d/i, msg: "Bien: es la regla de las diagonales." }
        ]
      },
      {
        enunciado: "Calcula el determinante de \\( B = \\begin{pmatrix} 1 & 2 & 0 \\\\ 3 & 1 & 2 \\\\ 0 & 1 & 1 \\end{pmatrix} \\)",
        tipo: "numero",
        respuesta: "-7",
        errores: [
          { valor: "5", msg: "Los menores están bien, pero revisa los signos de los cofactores: van alternados (+ − +). El término del 2 lleva signo menos." },
          { valor: "7", msg: "Estás cerca. Revisa el primer menor: (1·1 − 2·1). ¿Da positivo o negativo?" },
          { valor: "-1", msg: "Solo calculaste el primer término. Te falta el cofactor del 2 en la primera fila." }
        ],
        escalera: [
          "¿Qué fila o columna te conviene usar para desarrollar? Pista: la que tenga ceros.",
          "Desarrolla por la primera fila: det = 1·(1·1 − 2·1) − 2·(3·1 − 2·0) + 0·(...). Fíjate en el signo del segundo término.",
          "Repaso: el cofactor de la posición (i, j) lleva signo (−1)^(i+j), lo que da el patrón + − + en la primera fila."
        ],
        senales: [
          { patron: /cofactor|menor|sarrus|laplace/i, msg: "Bien: ese método sirve." }
        ]
      },
      {
        final: true,
        enunciado: "Calcula el determinante de \\( C = \\begin{pmatrix} 5 & -2 \\\\ 3 & 1 \\end{pmatrix} \\)",
        tipo: "numero",
        respuesta: "11",
        errores: [
          { valor: "-1", msg: "Cuidado con el signo: b·c = (−2)(3) = −6, y restar −6 equivale a sumar 6." },
          { valor: "7", msg: "Revisa: el determinante se calcula con productos cruzados, no con sumas." }
        ],
        escalera: [
          "Usa a·d − b·c y cuida los signos negativos."
        ],
        senales: []
      }
    ]
  }
];
