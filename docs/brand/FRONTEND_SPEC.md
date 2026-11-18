# Eticore — especificación frontend

Guía técnica para aplicar la identidad visual en React, TypeScript, Vite y Tailwind CSS v4. **Estado actual:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4 y `@tailwindcss/vite` están instalados; `src/index.css` contiene `@import "tailwindcss"`, `@theme` y las fuentes locales. `tsconfig.app.json` todavía no activa `strict`. Mantiene límites entre producto, diseño y código: una fuente de tokens, componentes accesibles y módulos por funcionalidad.

## 1. Fuentes de verdad

| Área | Fuente de verdad | Regla |
|---|---|---|
| Identidad y tono | [`PRODUCT_IDENTITY.md`](PRODUCT_IDENTITY.md), [manual original](references/243686_GilbertoMálagaFernández_ManualdeIdentidad.pdf) e [infografía](<references/Eticore - Infografía identidad.png>). | No redibujar ni reinterpretar logo o CapiCore. |
| Colores/tipografía | CSS global del proyecto y archivos aprobados. | Una definición central; evitar hex y fuentes repetidas en componentes. |
| Componentes | UI compartida del repositorio. | Las variantes deben expresar intención y estados reales. |
| Features | Módulo propietario. | No importar internals de otra feature. |
| APIs | Adaptadores de infraestructura. | Validar datos externos y mapearlos a tipos de dominio. |

Inspeccionar la estructura y los scripts existentes antes de establecer rutas o comandos. Si ya hay decisiones consistentes, seguirlas. No hacer una migración global solo para ajustarse a esta propuesta.

## 2. Tailwind CSS v4 y tokens

La configuración existente usa el plugin Vite oficial `@tailwindcss/vite`, `@import "tailwindcss"` y `@theme` en `src/index.css`. Poppins se sirve desde `resources/fonts/Poppins-{Regular,Medium,Bold}.woff2`, pesos 400/500/700. Figma identifica Caprasimo Regular en su estilo de display, pero no adjunta un binario de fuente; el archivo queda pendiente. No declarar una ruta de archivo inexistente ni tratar un subconjunto del PDF como la fuente completa.

```css
@import "tailwindcss";

@font-face {
  font-family: "Poppins";
  src: url("../resources/fonts/Poppins-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

/* Registrar igualmente Poppins-Medium.woff2 (500) y Poppins-Bold.woff2 (700). */

@theme {
  --color-ink: #0F2D4A;
  --color-teal: #14B8A6;
  --color-paper: #F8F7F4;
  --color-amber: #F4A261;
  --color-teal-light: #70C8C2;
  --color-pattern-on-ink: #294760;

  /* Reservados para el arte aprobado de CapiCore. */
  --color-fur: #D58D4B;
  --color-muzzle: #955D42;
  --color-brown-dark: #8B5135;

  --font-display: "Caprasimo", Georgia, serif;
  --font-sans: "Poppins", ui-sans-serif, system-ui, sans-serif;
}

:root {
  color: var(--color-ink);
  background: var(--color-paper);
  font-family: var(--font-sans);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

html { color-scheme: light; }
body { min-width: 320px; min-height: 100vh; margin: 0; }
:focus-visible { outline: 3px solid var(--color-teal); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

No declarar fuentes que no están presentes. Confirmar los pesos incluidos en cada archivo antes de registrar `font-weight`; los archivos variables y estáticos no son intercambiables. Revisar licencia antes de incorporar archivos de tipografía. No fijar `color-scheme: dark` sin definir y probar un tema oscuro completo: el manual solo especifica la versión invertida del logo sobre azul tinta, no una paleta funcional de modo oscuro.

### Tokens semánticos

- `ink`: contenido, navegación, títulos y estructura.
- `teal`: acción, selección y avance; texto de botón en `ink`.
- `paper`: fondo de lectura/superficies amplias.
- `amber`: énfasis breve.
- `teal-light`: apoyo de marca y detalles gráficos.
- `pattern-on-ink`: patrón a contraste moderado sobre `ink`.
- `fur`, `muzzle`, `brown-dark`: uso exclusivo del arte aprobado de CapiCore.

No hardcodear esos valores en componentes. No inventar tokens success/error/warning mezclando los colores de marca; definir una paleta semántica adicional solo después de evaluar contraste, modo de uso y consistencia.

## 3. Escala tipográfica web sugerida

La escala siguiente convierte los rangos editoriales de marca a unidades CSS iniciales. Debe comprobarse con copy real, viewport, zoom y fuentes finales.

| Token | Tamaño CSS sugerido | Uso | Fuente |
|---|---|---|---|
| Display | `clamp(2.5rem, 6vw, 4.25rem)` | Bienvenida/hero, máximo uno dominante por vista. | Caprasimo 400 |
| H1 | `clamp(2rem, 4vw, 3rem)` | Título principal. | Caprasimo 400 |
| H2 | `1.75rem–2.25rem` | Curso, unidad o sección. | Caprasimo 400 |
| H3 | `1.35rem–1.65rem` | Actividad o bloque breve. | Caprasimo 400 o Poppins 600 si el título es largo |
| Body large | `1.0625rem–1.125rem` | Introducción y contexto de dilema. | Poppins 400 |
| Body | `1rem` | Lectura, feedback y controles. | Poppins 400 |
| Label | `0.875rem` | Campos y ayudas. | Poppins 500/600 |
| Caption | `0.75rem–0.8125rem` | Metadatos secundarios, nunca instrucciones críticas. | Poppins 400/500 |

Usar jerarquía semántica real (`h1`–`h6`) y no saltarse niveles por motivos de estilo. Evitar párrafos largos en mayúscula o tracking excesivo. No resolver texto que no cabe reduciendo su tamaño primero: revisar contenido, ancho, wrapping y layout.

## 4. Arquitectura de aplicación

Para un proyecto nuevo, se recomienda organización feature-first con límites hexagonales proporcionales. En el proyecto existente, adoptar gradualmente según necesidad.

```text
src/
  app/                 # router, providers, layout raíz
  features/
    catalog/
      domain/          # reglas y tipos puros
      application/     # casos de uso y puertos
      data/            # API, storage y mapeos
      ui/              # rutas, componentes y hooks React
    learning/
    reflection/
  shared/
    ui/                # Button, Field, Progress, Dialog
    lib/               # clientes/utilidades de infraestructura
    assets/            # logos, mascota y recursos aprobados
  styles/
    app.css            # Tailwind v4, @theme y base
```

### Reglas de dependencia

- El dominio no importa React, JSX, DOM, `fetch`, storage ni librerías de UI.
- `application` coordina casos de uso y depende de interfaces, no de implementaciones HTTP concretas.
- `data` valida/mapear DTOs y adapta clientes de infraestructura a contratos de aplicación/dominio.
- `ui` representa estados y adapta eventos; no contiene reglas de dominio complejas.
- `app` compone router, providers y dependencias de alto nivel.
- Features no importan archivos internos de otras features. Exponer una API deliberada cuando haya consumo compartido.
- No crear capa o abstracción sin necesidad de sustitución, testabilidad, política de dominio o ciclo de vida distinto.
- Colocar el estado en el ámbito mínimo: local por defecto, compartido entre hermanos en ancestro/hook de feature, navegable/compartible en URL, remoto en caché de servidor, global solo si hay uso transversal real.

## 5. Rutas iniciales sugeridas

Estas rutas sirven para discutir producto, no son un alcance funcional confirmado.

| Ruta | Propósito |
|---|---|
| `/` | Presentar Eticore y orientar el inicio. |
| `/aprender` | Cursos disponibles y cursos para retomar. |
| `/cursos/:courseId` | Objetivo, estructura, duración y progreso del curso. |
| `/aprender/:courseId/:lessonId` | Lección, caso, reflexión, actividad y siguiente paso. |
| `/progreso` | Recorrido, prácticas completadas y próximos pasos. |
| `/perfil` | Cuenta, accesibilidad y preferencias. |

Validar roles (alumno, docente, administración), autenticación y necesidades de autoría antes de crear pantallas administrativas. El manual visual ofrece mockups conceptuales, no define permisos ni lógica de backend.

## 6. Flujo de una lección reflexiva

1. **Preparar:** mostrar título, objetivo, duración aproximada y opción de retomar.
2. **Contextualizar:** presentar un caso comprensible y neutral con información suficiente; agregar fuente/contexto si corresponde.
3. **Observar:** organizar el contenido en bloques manejables con navegación y lectura accesibles.
4. **Reflexionar:** formular una pregunta pertinente al objetivo (intención, consecuencia, consentimiento, justicia o impacto), no una pregunta genérica repetida.
5. **Argumentar:** permitir expresar razones y ofrecer criterios/andamiaje sin forzar una postura prefijada.
6. **Recibir feedback:** señalar un aspecto concreto presente en la respuesta y plantear una pregunta útil de profundización.
7. **Revisar:** permitir editar o comparar el argumento si ese comportamiento sirve al objetivo pedagógico.
8. **Cerrar:** resumir qué se practicó, guardar progreso y ofrecer el siguiente paso.

Guardar estados con claridad. “Sin respuesta registrada” es distinto de “respuesta incorrecta”; una falla técnica tampoco debe presentarse como error ético del estudiante.

## 7. Contratos de UI

### Botones y enlaces

- Variantes sugeridas: `primary`, `secondary`, `tertiary`, `danger`, cada una con intención concreta.
- Primario de marca: teal con texto azul tinta; validar texto, borde y foco en estados reales.
- Objetivo táctil recomendado: mínimo práctico de 44×44 CSS px, con espaciado suficiente. No presentar esta recomendación como el único requisito WCAG.
- Estados explícitos: default, hover, focus-visible, active, disabled y loading. Mantener dimensiones estables cuando carga.
- Usar `button` para acción y enlace/`Link` para navegación. Etiquetas nombran el resultado: “Guardar respuesta”, no “Enviar” aislado.
- Los iconos decorativos se ocultan a tecnologías de asistencia; los iconos funcionales deben tener nombre accesible.

### Tarjetas y superficies

- Una tarjeta requiere propósito reconocible (curso, actividad, progreso, resumen). No convertir cada párrafo en tarjeta.
- Papel funciona para lectura/superficie amplia; separar superficies con bordes discretos cuando ayude a entender agrupación.
- Sombra solo para elevación funcional; no aplicar una sombra idéntica a todos los elementos.
- Patrón de marca en azul tinta puede ser fondo de apoyo, nunca textura de alta frecuencia bajo contenido.

### Campos y formularios

- Label persistente asociada con `htmlFor`; placeholder es ejemplo, no etiqueta.
- Errores específicos asociados con `aria-describedby`; conservar valores ingresados si una petición falla.
- Usar controles HTML nativos siempre que resuelvan el caso. En opciones agrupadas, `fieldset`/`legend` o patrón semántico equivalente.
- No usar color como única señal; el mensaje explica el problema y el paso de recuperación.

### Navegación y progreso

- Mostrar ubicación actual con texto y estado semántico, usando `aria-current` donde aplique.
- La barra de progreso expone nombre, valor actual, mínimo y máximo a tecnologías de asistencia.
- Mostrar cuánto se completó y qué sigue; no convertir una medida de avance en un juicio de moralidad personal.

## 8. Responsividad y accesibilidad

- Diseñar desde 320 px CSS de ancho; probar móvil, tablet y escritorio con copy representativo.
- Permitir zoom 200% y reflow sin ocultar información ni acciones. Scroll horizontal solo cuando sea intrínseco al contenido.
- Usar HTML semántico, landmarks, orden lógico de encabezados, etiquetas y nombres accesibles.
- Todo flujo se completa por teclado; el foco es siempre visible, no queda tapado y regresa al disparador tras cerrar diálogos.
- Respetar `prefers-reduced-motion`; ninguna información depende de animación.
- Revisar contraste en texto, iconos informativos, límites de campos, foco, hover y estados disabled.
- Probar mensajes de estado con lector de pantalla cuando corresponda; anunciar cambios dinámicos sin interrumpir en exceso.
- La comprobación automática ayuda a detectar errores, pero no certifica WCAG por sí sola; combinar con revisión manual.

## 9. Tipos, datos y errores

- Activar `strict` de TypeScript como mejora pendiente en `tsconfig.app.json`. Evitar `any`. Para datos desconocidos, empezar con `unknown` y estrechar/validar.
- Tratar red, query params, localStorage y variables de entorno como entrada no confiable. Validar en el límite antes de propagar al dominio.
- Mantener tipos de transporte separados de dominio si forma o ciclo de vida difieren; no convertir una respuesta en segura mediante `as`.
- Modelar estados mutuamente excluyentes con uniones discriminadas, no con múltiples booleanos que permiten estados imposibles.
- Representar carga, vacío, error, éxito y falta de permisos cuando aplique.
- Los errores explican qué ocurrió y cómo recuperarse; stack trace y detalles internos quedan en logs.
- No ocultar errores con `catch` vacío, valores por defecto engañosos o estados de éxito falsos.
- Informar si progreso fue guardado localmente o en servidor; conservar datos ante fallos transitorios cuando sea posible.

## 10. Pruebas y Definition of Done

Al cambiar UI, lógica o flujos, adaptar estas comprobaciones al set de herramientas real del repositorio:

- Tests de dominio/casos de uso para reglas y transiciones.
- Pruebas de componente para variantes, estados, validación y teclado cuando aporten confianza.
- E2E con Playwright para rutas principales: comenzar curso, retomar, contestar, recibir feedback y continuar.
- Inspección de la UI renderizada en viewport móvil y escritorio; revisar consola, fallos de red, overflow y truncamiento.
- Auditoría automática de accesibilidad como complemento a teclado y revisión manual.

Checklist de salida:

- [ ] Tokens, fuentes, logo y CapiCore coinciden con activos aprobados.
- [ ] No se añadieron hex arbitrarios o fuentes inventadas en componentes.
- [ ] Propósito, jerarquía y acción principal son claros.
- [ ] Estados interactivos existen y se distinguen sin depender solo del color.
- [ ] Teclado, foco, etiquetas y texto ampliado se revisaron en el flujo modificado.
- [ ] Viewport móvil y escritorio se revisaron con contenido realista.
- [ ] Typecheck, lint, tests y build pertinentes se ejecutaron y su resultado está reportado.
- [ ] No se reconstruyó el logo ni se alteró la mascota.
- [ ] Actividades fomentan reflexión conforme al objetivo y no califican de forma simplista la moralidad de una postura.

## 11. Pendientes de producto/activos

- Incorporar originales vectoriales del logo: horizontal, invertido, una tinta, compacto e isotipo.
- Incorporar ilustraciones aprobadas de CapiCore frontal y tres cuartos, además de avatar.
- Confirmar archivos y licencia de Caprasimo y Poppins, pesos y estrategia de carga.
- Definir estados semánticos de producto y verificar contraste de todos los estados.
- Definir si habrá tema oscuro completo; el manual solo define logo invertido sobre azul tinta.
- Confirmar perfiles/roles, flujo de autoría, persistencia y recuperación de respuestas reflexivas.
