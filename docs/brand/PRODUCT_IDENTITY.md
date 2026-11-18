# Eticore — identidad de producto

Este documento organiza la identidad de Eticore para diseño, contenido y producto a partir del [manual de identidad](references/243686_GilbertoMálagaFernández_ManualdeIdentidad.pdf), la [infografía de identidad](<references/Eticore - Infografía identidad.png>) y las especificaciones del equipo. Complementa los originales; no los reemplaza. Para logotipo, isotipo y CapiCore prevalecen los archivos maestros aprobados.

**Cómo leer esta guía:** las secciones de color, tipografía, logo, patrón y CapiCore expresan reglas de marca. Las secciones rotuladas como recomendación son criterios de aplicación al producto; orientan decisiones de UX y no agregan requisitos al manual.

## 1. Esencia de marca

Eticore une “ética” con “core”: el núcleo de la experiencia es la reflexión que orienta las decisiones. La plataforma ayuda a acercarse a dilemas, considerar consecuencias y construir un argumento propio.

**Promesa:** un sistema cercano y claro para aprender y tomar decisiones.

### Principios observables — recomendación de producto

| Principio | Cómo se refleja en el producto |
|---|---|
| Ética en el centro | Presenta el contexto y las perspectivas antes de pedir una decisión. Invita a considerar a otras personas afectadas. |
| Reflexión antes que respuesta | Propone preguntas abiertas, análisis de consecuencias y razones. No presupone que todo dilema tiene una única respuesta sencilla. |
| Cercanía serena | Usa lenguaje simple, respetuoso y cálido, sin infantilizar ni imponer. |
| Claridad para avanzar | Hace visible el objetivo de la pantalla, la acción principal y el siguiente paso. |
| Accesibilidad y dignidad | Facilita distintas formas y ritmos de interacción; no avergüenza, castiga ni presiona a quien aprende. |

## 2. Paleta cromática funcional — reglas de marca

Los colores son tokens con roles específicos. Los colores de pelaje, hocico y marrón oscuro pertenecen al arte aprobado de CapiCore y no se convierten en colores generales de interfaz.

| Nombre | Valor | Función | Límites de uso |
|---|---|---|---|
| Azul tinta | `#0F2D4A` | Texto principal, títulos, estructura, navegación y fondos oscuros. | Sobre azul tinta, el texto debe ser blanco/papel y pasar contraste. |
| Teal | `#14B8A6` | Acciones, avance, conexiones y selección. | En botones teal, usar texto azul tinta. No usar para texto pequeño sobre papel si falla contraste. |
| Papel | `#F8F7F4` | Fondo amplio de lectura y superficies claras. | No asumir que da el mismo contraste que blanco puro: comprobar cada pareja de color. |
| Ámbar | `#F4A261` | Énfasis breve y detalles cálidos. | No usar como color de párrafos, gran superficie de lectura o único indicador de estado. |
| Teal claro | `#70C8C2` | Plano de apoyo del símbolo y acento gráfico secundario. | No usar para texto pequeño con contraste insuficiente. |
| Patrón sobre azul tinta | `#294760` | Patrón gráfico de contraste moderado sobre azul tinta. | Mantenerlo detrás del contenido, nunca compitiendo con texto o controles. |
| Pelaje | `#D58D4B` | Arte aprobado de CapiCore. | No usar como color de UI. |
| Marrón oscuro | `#8B5135` | Arte aprobado de CapiCore. | No usar como color de texto o estado de interfaz. |
| Hocico | `#955D42` | Matiz interno del arte maestro del personaje. | No extraer como token general. |

### Contraste y estados

- Texto pequeño sobre fondos claros: azul tinta.
- Botón principal teal: texto azul tinta, foco visible y estados diferenciados.
- Ningún estado (error, éxito, progreso, selección) se comunica solo por color; añadir texto, forma, icono o semántica accesible.
- El ámbar es un acento gráfico, no reemplaza tokens semánticos de error/aviso que el producto defina.
- Verificar contraste WCAG AA para cada combinación real, incluidos hover, foco, deshabilitado y texto sobre imágenes.
- No asignar nuevos significados semánticos a la paleta sin revisar contraste y coherencia con estos roles.

## 3. Tipografía — reglas de marca

### Caprasimo Regular

Voz expresiva de la firma. El manual la asigna al logotipo y a títulos breves. En producto úsala para la marca, el hero y encabezados cortos con jerarquía alta. No usarla en párrafos, datos densos, controles pequeños o etiquetas extensas.

### Poppins Regular, Medium y Bold

Voz funcional para párrafos, botones, etiquetas, navegación, formularios y datos. Conservar los acentos, ñ y signos de apertura españoles. Asegurar interlineado legible y longitud de línea cómoda.

El manual muestra rangos editoriales de 24–42 pt para títulos Caprasimo, 13.5–18 pt para lectura Poppins y 10.5–12 pt para datos de apoyo. En interfaz web hay que traducirlos a una escala CSS responsiva y verificarla en dispositivo; no reducir texto crítico para hacer caber contenido.

**Estado de archivos:** Poppins Regular, Medium y Bold están integradas como fuentes locales WOFF2 en `resources/fonts/` y se sirven con `font-display: swap`. Figma confirma Caprasimo Regular en el estilo de display, pero el archivo `.woff2`/`.ttf` no está adjunto al documento; el binario completo queda pendiente de recibir o descargar desde su distribución oficial. No sustituirlo por una fuente distinta ni usar el subconjunto del PDF como si fuera el archivo completo.

## 4. Logotipo y símbolo — reglas de marca

- La firma horizontal a color es principal si hay espacio suficiente.
- Usar la versión invertida sobre azul tinta para fondos oscuros. La versión a una tinta se limita a aplicaciones que la requieran.
- La firma compacta se usa en composiciones verticales/cuadradas; el isotipo solo cuando el contexto ya identifica a Eticore.
- Mantener la proporción fija, el orden de planos, el espacio entre símbolo y palabra, y una zona de protección mínima de `1 U`.
- El manual recomienda 200 px de ancho mínimo para la firma horizontal y 32 px de alto para el isotipo en pantalla como punto de partida. Revisar legibilidad real, especialmente huecos del isotipo.
- Sobre fotografía o fondos complejos, poner el logo sobre una superficie que asegure lectura.
- No estirar, comprimir, separar planos, sustituir colores, añadir contornos, sombras, texturas o degradados.
- No reconstruir el wordmark escribiendo “Eticore” con la fuente de marca. Usar el asset original aprobado.

## 5. Patrón gráfico y composición — reglas de marca

El patrón se construye con arcos, diagonales y curvas abiertas. Acompaña la suavidad tipográfica y el movimiento editorial; no reproduce el isotipo.

- Sobre azul tinta, emplear `#294760` con contraste moderado.
- Usar como marco, textura secundaria o transición de zonas; no en cada componente por defecto.
- Mantenerlo lejos de texto de lectura larga y zonas de interacción densa.
- Favorecer espacio, jerarquía, agrupación y una acción primaria clara. La decoración nunca compensa una estructura confusa.
- No convertir arcos/diagonales en motivos repetitivos de botones, campos o elementos que sugieran affordances falsas.

## 6. CapiCore — reglas de marca

El nombre se escribe **CapiCore**, junto y con ambas C en mayúscula. Es una capibara sin género definido, didáctica, cercana, tranquila y serena.

- Vista frontal: bienvenida y presentación.
- Vista de tres cuartos: acompaña una lección o pregunta; ubicar el contenido hacia el lado al que mira.
- Avatar: conservar cara completa, orejas y hocico, con aire alrededor.
- Puede abrir una pregunta, aclarar un concepto o acompañar feedback. No usarlo como decoración ubicua.
- Mantener el arte aprobado, proporciones, pelaje, hocico, bufanda, insignia y chevrones. No crear estilos o expresiones improvisados.
- CapiCore acompaña sin imponer: nunca debe ridiculizar, avergonzar o infantilizar a quien aprende.

## 7. Voz y contenido — recomendación de producto

Usar frases claras, humanas y orientadas a la acción. Una instrucción debe explicar qué hacer; un botón, qué ocurrirá; un error, qué falló y cómo recuperarse.

| Caso | Criterio | Ejemplo |
|---|---|---|
| Instrucción | Verbo concreto y una acción a la vez. | “Analiza el caso”. |
| Feedback | Identificar un criterio observado y sugerir profundización. | “Tu argumento considera la intención. Ahora revisa cómo podría afectar a otras personas.” |
| Error | Explicar el hecho y la recuperación sin culpar. | “No se guardó tu respuesta. Intenta guardarla de nuevo.” |
| Vacío | Explicar qué falta y cómo comenzar. | “Aún no tienes cursos. Explora el catálogo para elegir uno.” |
| Acción | Nombrar el resultado, no usar “Enviar” o “Aceptar” sin contexto. | “Guardar respuesta”, “Ver retroalimentación”, “Continuar el aprendizaje”. |

En dilemas abiertos, evitar lenguaje moralizante o absolutos simplistas. Distinguir hechos y consecuencias, valores implicados y la postura que construye quien aprende. No etiquetar como “incorrecta” una respuesta reflexiva solo porque difiere de una postura asumida por el producto.

## 8. Movimiento y motivación — recomendación de producto

- La animación debe hacer comprensible una transición, respuesta guardada o progreso, no decorar cada sección.
- Respetar `prefers-reduced-motion` y mantener todos los flujos utilizables sin movimiento.
- Ofrecer estados diferenciados: hover, foco, activo, deshabilitado, carga y confirmación.
- Reconocer avance y esfuerzo de forma proporcionada. Evitar pérdida punitiva de progreso, vergüenza pública, urgencia artificial o competencia que contradiga el aprendizaje reflexivo.

## 9. Aplicación por superficie — recomendación de producto

| Superficie | Criterio de identidad y experiencia |
|---|---|
| Dashboard | Priorizar retomar el curso, el avance y la próxima actividad. Una acción siguiente clara. |
| Catálogo | Permitir comparar tema, duración, nivel y objetivo; diferenciar cursos activos y completados. |
| Página del curso | Explicar objetivo, estructura y cómo continuar. |
| Lección | Poner caso y contenido en primer plano; dividir lectura y reflexión en pasos manejables. |
| Dilema | Dar contexto suficiente y neutral; explorar consecuencias y perspectivas sin prefijar respuesta. |
| Actividad | Pregunta clara, controles accesibles, confirmación y guardado comprensible. |
| Feedback | Explicar el criterio observado, proponer una pregunta de profundización y permitir revisar el argumento. |
| Progreso | Mostrar recorrido, habilidades exploradas y próximos pasos con lenguaje orientador, no evaluativo. |

## 10. Revisión de una pantalla — lista de control de producto

Antes de aprobar una vista, verificar:

1. ¿La pantalla apoya reflexión, consecuencias y toma de decisiones de acuerdo con su tarea?
2. ¿El azul tinta sostiene lectura/estructura y el teal indica interacción/avance?
3. ¿Ámbar y teal claro siguen siendo acentos cuando no son legibles como texto?
4. ¿Caprasimo aparece solo en títulos breves y Poppins resuelve la lectura funcional?
5. ¿Logo y CapiCore conservan los originales, la proporción y la zona de protección?
6. ¿La acción principal es clara y los controles tienen etiqueta, foco y uso por teclado?
7. ¿Carga, vacío, error y éxito dan respuesta visible y útil cuando aplican?
8. ¿La pantalla conserva contenido y acciones a 320 px, con zoom y texto ampliado?
9. ¿La decoración acompaña sin competir con el dilema, la pregunta o la tarea?
10. ¿Se probaron contraste y estados reales, no solo el color base?

## Fuente y precedencia

Basado en el Manual de Identidad Visual de Eticore, edición 2026, la infografía de identidad y las especificaciones proporcionadas por el equipo. Este texto organiza la aplicación digital y añade recomendaciones de producto. Si una recomendación contradice un original de marca, preservar el original y escalar la discrepancia para validación.

### Activos integrados y pendientes

- Integrados desde Figma en `resources/brand/`: firma horizontal invertida, CapiCore frontal, tres cuartos y avatar, y dos motivos vectoriales del patrón. El archivo Figma no contiene en esta página una firma horizontal a color ni una tinta.
- Integrados: Poppins Regular, Medium y Bold en WOFF2 con su licencia SIL OFL 1.1.
- Pendiente: binario completo de Caprasimo Regular. Figma guarda el nombre y estilo tipográfico en sus capas de texto, no el archivo de la fuente.
