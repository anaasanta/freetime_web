# Informe tecnico resumido de FreeTime

Este documento explica, de forma sencilla, como esta montado el front-end de FreeTime, que patrones de diseno se usan y como se relacionan con principios de interaccion y heuristicas de Nielsen.

La idea es que se pueda entender sin tener que abrir todos los archivos del proyecto.

## 1. Estructura general del front-end

FreeTime esta hecho con Vue 3 y Vite. La aplicacion se organiza en pantallas, componentes reutilizables, datos y stores.

### Carpetas principales

- `src/views/`: contiene las pantallas completas de la app. Por ejemplo:
  - `LandingView.vue`: pagina inicial.
  - `LoginView.vue`: inicio de sesion.
  - `HomeView.vue`: pantalla principal del usuario.
  - `ActivityResultView.vue`: detalle de una actividad.
  - `ProfileView.vue`: perfil, calendario, actividades y estadisticas.
  - `TestView.vue`: test de recomendacion.

- `src/components/`: contiene piezas reutilizables que se usan dentro de las pantallas. Por ejemplo:
  - `AppNavbar.vue`: barra de navegacion.
  - `AppBrand.vue`: marca/logo de la app.
  - `AccessibilityPanel.vue`: panel de accesibilidad.
  - `ActivityScheduleModal.vue`: modal para programar actividades.
  - `BaseButton.vue`, `BaseField.vue`, `AppContainer.vue`, `AppPanel.vue`, `SectionHeader.vue`, `EmptyState.vue`, `FormMessage.vue` y `AppTooltip.vue`: componentes base para no repetir botones, campos, contenedores, paneles, cabeceras, estados vacios, mensajes y tooltips en cada pantalla.
  - componentes visuales como `GradientCard.vue`, `ClickSpark.vue` o `BorderGlow.vue`.

- `src/data/`: contiene datos y textos que alimentan la interfaz.
  - `activities.js`: lista base de actividades.
  - `mockUser.js`: usuario de prueba y sus actividades guardadas/completadas/programadas.
  - `uiText.js`, `homeCopyI18n.js`, `activitiesCopyI18n.js`, `testCopyI18n.js`: textos e idiomas.
  - `recommender.js`: logica para recomendar actividades.

- `src/stores/`: contiene estado compartido.
  - `appSession.js`: guarda usuario actual, actividades guardadas, comenzadas, completadas, programadas, recomendaciones y sesion.
  - `theme.js`, `i18n.js`, `accessibility.js`: tema, idioma y preferencias de accesibilidad.

- `src/router/`: conecta URLs con pantallas.
  - Por ejemplo, `/home` abre `HomeView.vue` y `/profile` abre `ProfileView.vue`.

- `src/styles/`: estilos globales.
  - `variables.css`: colores, radios, sombras y tokens visuales.
  - `responsive.css`: ajustes responsive.
  - `base.css`: estilos base compartidos.

## 2. Como se conecta todo

El flujo basico es:

1. Una pantalla de `views` muestra la interfaz.
2. Esa pantalla usa componentes de `components`.
3. La pantalla lee datos del store con `useAppSession()`.
4. El store usa datos iniciales de `src/data`, como `mockUser.js` y `activities.js`.
5. Cuando el usuario hace clic, la pantalla llama a una funcion del store.
6. El store actualiza los datos.
7. Las pantallas que leen ese store se actualizan solas.

Ejemplo:

Cuando el usuario pulsa `Comenzar actividad` en `ActivityResultView.vue`, se llama a `startActivity()` en `appSession.js`. Esa funcion marca la actividad como empezada/completada. Despues, `HomeView.vue` y `ProfileView.vue` leen el mismo store y muestran esa actividad en sus secciones correspondientes.

## 3. Bootstrap

En FreeTime usamos Bootstrap como base de interfaz, pero no como sustituto completo de nuestro diseno propio.

La dependencia aparece en `package.json` y se importa globalmente en `src/main.js`:

```js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

Nuestra decision fue usar Bootstrap para las bases comunes de la interfaz:

- botones (`btn`, `btn-primary`, `btn-outline-secondary`, etc.).
- campos de formulario (`form-control`).
- sliders (`form-range`).
- contenedores (`container-fluid`).
- tarjetas/paneles (`card`).
- barras de navegacion (`navbar`).
- modales y alertas (`modal`, `alert`) cuando encajan con el componente.

Sin embargo, no usamos Bootstrap como una plantilla visual cerrada. La app tiene una identidad muy personalizada: tonos suaves, fondos con blur, tarjetas de cristal, iconos de actividades, modo oscuro, alto contraste y microinteracciones. Por eso mantenemos CSS propio encima de Bootstrap.

Por ejemplo, un boton de FreeTime puede seguir usando Bootstrap:

```html
<button class="base-button btn btn-primary primary-button">Guardar</button>
```

Pero el color final no es el azul por defecto de Bootstrap. Lo adaptamos con variables de la app en `src/styles/base.css`:

```css
.primary-button {
  --bs-btn-bg: var(--primary);
  --bs-btn-border-color: var(--primary);
  --bs-btn-active-bg: var(--primary);
  --bs-btn-active-border-color: var(--primary);
  background: var(--primary);
  color: var(--primary-foreground);
}
```

Esto nos permite cumplir dos objetivos a la vez:

1. Usar Bootstrap de forma real y reconocible.
2. Mantener la interfaz visual de FreeTime coherente con la idea del producto.

### Cuando usamos Bootstrap

Usamos Bootstrap cuando nos aporta una base estandar y consistente:

- en botones, para partir de `btn` y sus estados.
- en formularios, para mejorar estructura y accesibilidad de inputs.
- en `form-range`, manteniendo el control como slider reconocido por Bootstrap.
- en contenedores y tarjetas, para reutilizar convenciones comunes.
- en modales o alertas cuando la estructura encaja.

### Cuando usamos CSS propio

Usamos CSS propio cuando Bootstrap no resuelve la experiencia especifica de FreeTime o cuando su estilo por defecto rompe la identidad visual.

Ejemplos:

- el test tiene sliders con gradientes personalizados, por eso usamos `form-range` pero anulamos la pista blanca de Bootstrap para que se vea nuestro gradiente.
- el feedback usa un componente propio (`FeedbackModal.vue`) porque se usa en varias pantallas y necesitabamos que fuera exactamente igual en todas.
- las tarjetas de actividades tienen iconos, tonos y disposiciones propias.
- el modo oscuro, alto contraste y movimiento reducido dependen de variables y stores propios.
- algunos layouts complejos, como el perfil o el dashboard de feedback, se hacen con CSS Grid porque necesitan una distribucion especifica.

En resumen: usamos Bootstrap para la base; usamos CSS propio para la identidad, la adaptacion responsive y las interacciones concretas de FreeTime.

## 3.1 Responsive: Bootstrap y CSS propio

La app tambien tiene `src/styles/responsive.css`. No lo eliminamos al usar Bootstrap porque cumple una funcion diferente.

Bootstrap sirve para muchos comportamientos responsive generales. Por ejemplo, podemos usar utilidades como `container-fluid`, `w-100` o clases de botones y formularios que ya se adaptan bien.

Pero nuestro `responsive.css` se usa para decisiones globales del proyecto:

```css
@media (max-width: 900px) {
  .app-page {
    padding: 18px;
  }

  .app-panel {
    padding: 24px;
  }
}

@media (max-width: 520px) {
  .primary-button,
  .secondary-button,
  .danger-button {
    width: 100%;
  }
}
```

Es decir, usamos Bootstrap para comportamientos responsive estandar y `responsive.css` para reglas transversales propias de FreeTime.

Nuestra logica es:

- Si el ajuste es generico y Bootstrap lo cubre bien, usamos Bootstrap.
- Si el ajuste afecta a la personalidad visual de la app, usamos CSS propio.
- Si el ajuste debe aplicarse a toda la app, lo ponemos en `responsive.css` o `base.css`.
- Si el ajuste pertenece solo a una pantalla, lo dejamos en el `<style scoped>` de esa pantalla.

Esto evita que la app dependa solo de clases de Bootstrap y tambien evita duplicar reglas innecesarias.

## 3.2 Componentes reutilizables

Ademas de Bootstrap, usamos componentes Vue propios para no repetir estructura y para mantener consistencia.

Componentes base importantes:

- `BaseButton`: centraliza botones principales, secundarios, de peligro y de texto. Usa clases Bootstrap (`btn`, `btn-primary`, etc.) pero mantiene variantes visuales de FreeTime.
- `BaseField`: centraliza inputs con `form-control` y estilo propio.
- `AppContainer`: define el ancho de pagina y usa `container-fluid`.
- `AppPanel`: sirve para paneles/tarjetas grandes y se apoya en `card`.
- `SectionHeader`: unifica titulos de seccion, acciones y descripciones.
- `EmptyState`: estados vacios reutilizables.
- `FeedbackModal`: popup compartido de feedback, usado tanto en la descripcion de una actividad como en el perfil.
- `ActivityScheduleModal`: modal para programar o editar actividades.
- `AccessibilityPanel`: panel flotante de accesibilidad.

Esta decision es importante porque Bootstrap nos da clases, pero no nos da logica de aplicacion. Por ejemplo, `FeedbackModal.vue` no solo tiene estilos: tambien controla estrellas, corazones, nota opcional, validacion y emite un resultado. Si estuviera duplicado en varias pantallas, seria facil que una version se viera distinta de otra. Por eso lo convertimos en componente.

La idea general es: Bootstrap aporta una base comun, y nuestros componentes hacen que esa base sea reutilizable dentro del lenguaje visual de FreeTime.

## 4. Guia de estilo

Documentacion de decisiones de diseno visual aplicadas en FreeTime.

### Familias tipograficas

La app usa Montserrat como familia tipografica principal. Esta cargada desde Google Fonts en `index.html` y definida en `src/styles/variables.css`:

```css
--font-main: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Montserrat se utiliza en toda la interfaz porque tiene buena legibilidad, un aspecto moderno y encaja con una app visualmente amable. Las fuentes de sistema quedan como fallback por si Montserrat no carga.

### Combinaciones de colores

Los colores estan centralizados en `src/styles/variables.css`. La app usa una paleta clara, suave y calmada, coherente con una aplicacion de tiempo libre y bienestar.

Colores principales:

- Fondo principal: `#fbfdff`, usado como fondo general de la app.
- Texto principal: `#1e293b`, usado para titulos y texto importante.
- Texto secundario: `#64748b`, usado para descripciones y estados menos prioritarios.
- Color primario: `#1e293b`, usado en botones principales.
- Violeta: `#7054b1`, usado para acentos, estados activos y elementos destacados.
- Azul suave: `#5995b1`, usado en elementos informativos o graficos.
- Verde menta: `#6ee7b7`, usado para sensacion positiva o mejora.
- Rojo/error: `#e11d48`, usado para acciones peligrosas o mensajes de error.

Tambien existen variables para modo oscuro y alto contraste. Por ejemplo, en modo oscuro el fondo pasa a `#05070d` y el texto principal a `#eef4ff`.

### Reticula y tamanos

Usamos una combinacion de Bootstrap y CSS propio. Bootstrap aporta contenedores y clases base, como `container-fluid`, `card` o `navbar`, pero la composicion principal se hace con `grid`, `flex` y contenedores propios porque las pantallas tienen estructuras muy especificas.

Nuestra decision fue no depender de una reticula Bootstrap pura (`row`, `col-*`) para todo, porque algunas pantallas no son reticulas clasicas. Por ejemplo, el perfil combina calendario, listas, dashboard de feedback y modales; la pantalla de detalle divide imagen/contenido; y el test usa bloques verticales con sliders personalizados.

Elementos principales:

- `.page-container` junto con `container-fluid`: limita el ancho maximo de pagina y centra el contenido.
- `.app-page`: da margen interno general a cada pantalla.
- Layouts con `grid-template-columns`, por ejemplo:
  - Home usa filas horizontales para actividades guardadas y recomendadas.
  - Profile usa dos columnas principales en escritorio y una columna en pantallas pequenas.
  - Activity detail divide la pantalla entre visual de actividad y contenido.

Tamanos y radios:

- Radio de tarjetas: `--radius-card: 32px`.
- Radio de controles: `--radius-control: 18px`.
- Botones principales: altura minima de `48px`.
- Iconos de actividad: normalmente entre `58px` y `78px`, segun la pantalla.
- Avatares de perfil: alrededor de `122px` en el perfil y `38px` en botones pequenos.

Las imagenes de actividades y avatares se adaptan con `object-fit: cover` y tamanos fijos o responsivos segun el componente.

### Iconografia

La iconografia usa la libreria `lucide-vue-next`.

Se eligio porque ofrece iconos lineales, limpios y faciles de reconocer. Esto encaja con el estilo visual de la app: claro, suave y minimalista.

Ejemplos de iconos usados:

- `UserRound`: perfil.
- `LogOut`: cerrar sesion.
- `Settings`: ajustes.
- `CalendarDays`: calendario.
- `Search`: busqueda.
- `BookOpen`, `Dumbbell`, `Headphones`, `Palette`, `Footprints`: categorias o tipos de actividades.

El estilo general de iconos es lineal, sin rellenos pesados, para mantener una interfaz ligera y coherente.

## 5. Patrones de diseno usados

Los patrones se han seleccionado a partir del material del Tema 3, donde se explica que un patron de diseno es una solucion recurrente y probada a un problema comun de interfaz.

### 5.1 Input Controls

Se usan controles de entrada para que el usuario pueda introducir o ajustar informacion.

Ejemplos en FreeTime:

- sliders del test en `TestView.vue`.
- buscador de hobbies en `HomeView.vue`.
- campos de hora en `ActivityScheduleModal.vue`.

Sirven para que la interaccion sea directa y facil de entender.

### 5.2 Forms and Wizards

El test funciona como un pequeno wizard: el usuario responde preguntas paso a paso y al final recibe una recomendacion.

Esto reduce carga mental porque no se muestran todas las decisiones de golpe.

### 5.3 Tooltips, Dialogs e Instructional Overlay

La app usa tooltips, modales y mensajes contextuales.

Ejemplos:

- tooltips en botones del Home.
- modal para programar actividades.
- confirmaciones al borrar actividades guardadas.
- panel de accesibilidad como capa flotante.

Esto ayuda a explicar acciones sin llenar la pantalla de texto.

### 5.4 Icons and Indicators

Se usan iconos de `lucide-vue-next` para representar acciones y tipos de actividad.

Ejemplos:

- iconos de perfil, logout, ajustes y calendario.
- iconos para actividades como yoga, paseo, lectura o musica.
- badges como `Nuevo` para actividades aun no probadas.

Esto mejora el reconocimiento visual y evita depender solo de texto.

### 5.5 Menu Design y Site Navigation

La navegacion se organiza con navbar, botones de acceso y rutas claras.

Ejemplos:

- logo/marca para volver al inicio.
- boton de perfil.
- boton de ajustes.
- rutas como `/home`, `/profile`, `/test`, `/activity/:id`.

Esto da orientacion al usuario y evita que se pierda.

### 5.6 In-Page Navigation

Dentro de una misma pantalla se organizan secciones diferenciadas.

Ejemplos:

- en Home: actividades guardadas, actividades empezadas, recomendadas y siguiente actividad.
- en Profile: calendario, actividades programadas, actividades empezadas, mis actividades y estadisticas.

Esto permite escanear la informacion por bloques.

### 5.7 Search

El Home incluye busqueda de hobbies.

El usuario puede encontrar actividades sin recorrer toda la lista. Esto reduce tiempo y esfuerzo.

### 5.8 Errors

Hay mensajes de error o estados vacios, pero se redactan de forma tranquila y orientada a la recuperacion para no aumentar la ansiedad del usuario.

Ejemplos:

- login con campos vacios, usuario ausente, contrasena ausente o credenciales que no coinciden.
- actividad no encontrada.
- listas vacias cuando no hay actividades guardadas, empezadas o programadas.

Esto ayuda a entender que pasa, diagnosticar el tipo de problema y saber como continuar sin tono brusco.

### 5.9 Privacy and Ethics

La app no usa patrones oscuros: no obliga al usuario a aceptar acciones raras, no esconde opciones importantes y permite salir/cancelar.

Tambien hay controles de accesibilidad, idioma, contraste y movimiento reducido, lo que ayuda a una experiencia mas respetuosa.

### 5.10 Otros patrones generales de UI Patterns aplicados

Ademas de los patrones anteriores, tambien podemos relacionar FreeTime con otros patrones generales de UI Patterns. No los anadimos como elementos artificiales, sino porque ya aparecen de forma natural en la app.

#### Getting input

- **Calendar Picker / Event Calendar**: el perfil incluye un calendario para escoger dias y programar actividades. Esto resuelve el problema de seleccionar una fecha de forma visual, sin obligar al usuario a escribirla manualmente.
- **Good Defaults**: al programar una actividad se propone una hora inicial y una notificacion por defecto. Esto reduce esfuerzo y hace que el usuario pueda confirmar rapido si no necesita personalizar.
- **Input Feedback**: los formularios reaccionan visualmente al foco, a los estados activos y a los errores. Por ejemplo, el login muestra un mensaje si las credenciales no son correctas.
- **Settings**: el panel de accesibilidad y el cambio de tema/idioma funcionan como ajustes de experiencia, no como contenido principal. Esto permite personalizar sin interrumpir el flujo.

#### Navigation

- **Home Link**: el logo y la marca ayudan a volver a zonas principales de la app.
- **Modal**: usamos modales para tareas concretas que no necesitan una pantalla nueva, como programar una actividad o completar feedback.
- **Notifications**: la programacion de actividades incluye una preferencia de notificacion, con opciones como 30 minutos antes, 1 hora antes o no recibir aviso.
- **Cards**: las actividades se presentan como tarjetas o filas visuales con icono, titulo, descripcion y acciones. Esto facilita comparar opciones rapidamente.
- **Favorites**: guardar actividades en "Mis actividades" funciona como patron de favoritos, ya que permite crear una lista personal de hobbies.
- **Progressive Disclosure**: no mostramos toda la informacion al mismo tiempo. En Home se ven listas resumidas; al entrar en una actividad aparece el detalle; y el feedback se abre solo cuando el usuario termina una actividad.

#### Dealing with data

- **Dashboard**: el perfil incluye un dashboard de feedback donde se visualiza la evolucion de energia antes y despues de realizar actividades.
- **Search Filters / Search**: el buscador de actividades permite encontrar hobbies sin revisar manualmente toda la lista.
- **Table/List Filtering**: en el perfil, las actividades del dashboard se filtran al seleccionar un hobby concreto. Asi la grafica no mezcla informacion que no corresponde.

#### Onboarding

- **Blank Slate**: cuando una lista esta vacia, se muestra un estado vacio en vez de dejar un hueco sin explicar. Esto orienta al usuario sobre que ocurre.
- **Inline Hints**: textos breves como descripciones de actividades, placeholders y subtitulos del test ayudan a entender que se espera sin abrir una ayuda externa.
- **Walkthrough / Wizard**: el test guia al usuario mediante preguntas para recomendar actividades. Es un onboarding funcional porque ensena la logica de la app mientras el usuario la usa.

#### Social

- **Testimonials**: en la landing aparecen comentarios de usuarios. No son una red social completa, pero funcionan como prueba social suave para explicar el valor de la app.
- **Reaction / Rate Content**: el feedback con estrellas y corazones permite reaccionar a una actividad completada. Esto convierte la experiencia en datos utiles para futuras recomendaciones.

### 5.11 Patrones persuasivos aplicados de forma etica

Tambien usamos algunos patrones persuasivos, pero con cuidado. En FreeTime no los usamos para presionar al usuario, sino para ayudarle a decidir con menos esfuerzo y a entender que actividades le funcionan mejor.

#### Cognition

- **Recognition over Recall**: el usuario no tiene que recordar que actividades guardo o completo; la app se lo muestra en listas, calendario y dashboard.
- **Choice Closure**: al completar una actividad aparece un feedback modal. Esto da cierre a la accion y ayuda a convertir la experiencia en una decision registrada.
- **Limited Choice**: las recomendaciones y las listas muestran un numero limitado de opciones. Esto evita saturar al usuario con demasiados hobbies a la vez.

#### Game mechanics

- **Self-Monitoring**: el dashboard de feedback permite observar la evolucion personal despues de probar actividades.
- **Goal-Gradient Effect**: el test y el flujo de completar actividad dan sensacion de avance porque el usuario responde, obtiene una recomendacion y puede cerrar el ciclo con feedback.
- **Delighters**: microinteracciones como hover, cambios de color, iconos y pequenos efectos visuales hacen que la experiencia sea mas agradable sin bloquear la funcionalidad.

#### Perception and memory

- **Chunking**: la informacion se agrupa en bloques: calendario, actividades, recomendaciones, feedback y perfil. Esto hace que la pantalla sea mas facil de escanear.
- **Picture Superiority Effect**: usamos imagenes e iconos para que las actividades sean reconocibles visualmente.
- **Isolation Effect**: los botones principales, estados activos y colores de acento destacan frente al resto de contenido.
- **Sequencing**: algunos flujos siguen un orden claro: primero test, despues recomendacion, despues detalle, despues guardar/empezar/programar.

#### Feedback

- **Feedback Loops**: el usuario prueba una actividad, da feedback y luego puede ver esa informacion en el dashboard. Es un ciclo de aprendizaje dentro de la app.
- **Tailoring**: las recomendaciones se adaptan a respuestas del test y al historial de actividades, aunque en el prototipo parte de los datos sean simulados.
- **Trigger**: botones como "Empezar", "Programar" o "Acabar" actuan como disparadores claros para continuar el flujo.

#### Social

- **Social Proof**: los comentarios de la landing ayudan a mostrar que otras personas han encontrado valor en la app.
- **Autonomy**: aunque la app recomienda, el usuario mantiene el control: puede guardar, borrar, programar, cancelar, cambiar idioma, cambiar tema y ajustar accesibilidad.

En conjunto, estos patrones apoyan la idea central de FreeTime: acompanamos al usuario para descubrir actividades utiles, pero sin quitarle control ni convertir la experiencia en una obligacion.

## 6. Principios de diseno aplicados

Estos principios salen del Tema 3, especialmente de los principios de diseno de interaccion y visual.

### 6.1 Visibilidad

Las funciones principales estan visibles:

- test en Home.
- buscador arriba.
- actividades guardadas y empezadas.
- botones de perfil, ajustes y logout.
- calendario visible en Profile.

Esto permite que el usuario sepa que puede hacer.

### 6.2 Feedback

La app da respuesta a las acciones del usuario.

Ejemplos:

- una actividad aparece en la lista al guardarla.
- una actividad pasa a comenzada al pulsar comenzar.
- badges como `Nuevo`.
- estados hover en botones.
- graficas de feedback en el perfil.

Esto responde a la pregunta: "que acaba de pasar?"

### 6.3 Affordances

Los elementos parecen interactivos cuando lo son.

Ejemplos:

- botones con iconos.
- tarjetas clicables.
- controles de calendario.
- botones con hover.

El usuario puede intuir donde clicar.

### 6.4 Restricciones

La interfaz limita algunas acciones para evitar errores.

Ejemplos:

- modales para confirmar o editar actividades.
- rutas protegidas si no hay usuario logueado.
- formularios y controles con opciones concretas.

Esto ayuda a prevenir errores.

### 6.5 Mapping

Los controles tienen relacion clara con su efecto.

Ejemplos:

- icono de calendario para programar.
- icono de papelera para eliminar.
- boton de perfil abre perfil.
- boton de test abre el test.

La accion coincide con lo que el usuario espera.

### 6.6 Consistencia

Se repiten estilos, nombres y estructuras:

- tarjetas de actividades con formato parecido.
- botones principales con clase `primary-button`.
- colores desde `variables.css`.
- navegacion consistente entre pantallas.
- componentes base como `BaseButton`, `BaseField`, `AppPanel`, `AppContainer`, `SectionHeader`, `EmptyState`, `FormMessage` y `AppTooltip`.

Esto hace que la app sea mas facil de aprender.

### 6.7 Simplicidad

La informacion se separa en bloques y no se muestra todo a la vez.

Ejemplos:

- Home resume lo mas importante.
- Profile agrupa calendario, listas y estadisticas.
- Test guia al usuario por pasos.

Esto reduce carga cognitiva.

## 7. Principios visuales aplicados

### 7.1 Jerarquia visual

Los titulos, tarjetas, botones y secciones tienen tamanos y pesos distintos para guiar la mirada.

Ejemplo: en Profile, el usuario ve primero el perfil/calendario y despues las listas y graficas.

### 7.2 Espacio en blanco

La app usa separacion entre secciones y tarjetas para que no parezca todo mezclado.

Esto mejora legibilidad y orden.

### 7.3 Color

Los colores se usan para diferenciar tono, estado y jerarquia.

Ejemplos:

- colores suaves para actividades.
- colores de feedback en graficas.
- contraste alto en modo accesible.

### 7.4 Tipografia

La tipografia se usa con tamanos y pesos distintos para distinguir titulos, texto secundario y botones.

### 7.5 Movimiento

Hay microinteracciones y animaciones suaves.

Ejemplos:

- hover en botones y tarjetas.
- `ClickSpark`.
- controles para reducir movimiento desde accesibilidad.

Esto aporta feedback visual, pero se puede reducir para usuarios sensibles.

## 8. Heuristicas de Nielsen aplicadas

### H1. Visibilidad del estado del sistema

La app muestra cambios de estado: actividades guardadas, empezadas, programadas y completadas.

### H2. Relacion entre sistema y mundo real

Se usan conceptos conocidos: calendario, perfil, actividades, energia, mente, test, guardar, empezar.

### H3. Control y libertad del usuario

El usuario puede navegar entre pantallas, cerrar detalles, borrar actividades guardadas y cancelar acciones en modales.

### H4. Consistencia y estandares

Los botones, tarjetas, iconos y secciones mantienen una estructura visual coherente.

### H5. Prevencion de errores

Las acciones importantes se organizan en botones claros y modales. Las rutas protegidas evitan acceder a pantallas internas sin sesion.

### H6. Reconocimiento antes que recuerdo

La app usa iconos, etiquetas, listas visibles y datos guardados para que el usuario no tenga que recordar todo.

### H7. Flexibilidad y eficiencia de uso

El buscador permite encontrar actividades rapido. Las listas del Home y Profile permiten volver a actividades sin repetir el test.

### H8. Diseno estetico y minimalista

La informacion se agrupa por bloques y se evitan textos largos dentro de la interfaz.

### H9. Ayudar a reconocer, diagnosticar y recuperarse de errores

Hay mensajes especificos para el login: campos vacios, usuario ausente, contrasena ausente y credenciales que no coinciden. El texto evita sonar alarmista y propone revisar la informacion con calma. Tambien hay mensajes para actividad no encontrada y estados vacios.

### H10. Ayuda y documentacion

La app incluye ayudas contextuales como tooltips, textos de botones claros y una pantalla de consulta FreeTimeIA como espacio previsto para ayuda.

## 9. Resumen final

FreeTime se apoya en Vue, stores compartidos, datos centralizados, Bootstrap y CSS propio. Usamos Bootstrap para bases comunes de interfaz y CSS propio para adaptar la experiencia al lenguaje visual de la app.

Los patrones principales son busqueda, formularios/wizard, iconos, modales, navegacion, tarjetas, filtros/listas y estados de error. Los principios mas importantes aplicados son visibilidad, feedback, consistencia, simplicidad, jerarquia visual y reconocimiento antes que memoria.

En corto: la app intenta que el usuario pueda encontrar, guardar, empezar, programar y revisar actividades sin perderse.
