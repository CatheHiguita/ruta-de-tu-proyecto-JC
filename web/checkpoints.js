// Checkpoint definitions for the "Ruta de tu Proyecto" learning path.
//
// This is CONTENT, not data: it lives in the repo and ships with the app rather
// than sitting in Postgres. The database only ever stores a checkpoint's id
// against a student, so editing wording here never requires a migration.
//
// Shared by index.html (the student path) and admin.html (the cohort dashboard)
// so both always agree on the same list.

export const CHECKPOINTS = [
  {
    id:"git",
    title:"GitHub: tu proyecto está subido",
    why:"Sin repositorio, tu progreso no queda guardado en ningún lado y no puedes mostrar tu avance real. Es la base para todo lo que sigue.",
    question:"¿Ya subiste tu proyecto a GitHub?",
    steps:[
      "Instala Git en tu computador (si usas un equipo del salón, pregunta si ya está instalado).",
      "Crea una cuenta en GitHub.com si aún no tienes una.",
      "Crea un repositorio nuevo con el nombre de tu proyecto.",
      "En tu carpeta de proyecto, corre: git init",
      "Corre: git add . y luego git commit -m \"primer commit\"",
      "Conecta tu repo con: git remote add origin [link-de-tu-repo]",
      "Sube tus archivos con: git push -u origin main"
    ],
    resource:"Learn Git Branching — practica los comandos sin miedo a romper nada",
    mentor:{name:"Kevin Galarza", date:"20/08/2026", time:"6:30 pm", topic:"Git y GitHub (instalación, comandos básicos, subir proyecto)"}
  },
  {
    id:"html",
    title:"HTML: estructura semántica lista",
    why:"Una estructura clara es lo que le permite a cualquiera (incluido tú en un mes) entender de qué trata cada parte de tu proyecto con solo mirar el código.",
    question:"¿Tu proyecto ya tiene una estructura HTML semántica (header, main, section, footer)?",
    steps:[
      "Revisa que tu página use etiquetas con significado: <header>, <nav>, <main>, <section>, <footer> — no solo <div> para todo.",
      "Cada sección de tu idea de negocio debe tener su propia etiqueta <section>.",
      "Usa <h1> una sola vez por página, y <h2>/<h3> para los subtítulos en orden.",
      "Verifica que las imágenes tengan atributo alt describiendo qué muestran."
    ],
    resource:"MDN — Elementos semánticos de HTML5",
    mentor:null,
    supportLink:{label:"MDN — Elementos semánticos de HTML5", note:"Repasa ahí los ejemplos de header/main/section/footer y compáralos con tu propio código."}
  },
  {
    id:"box",
    title:"CSS: box model aplicado",
    why:"El box model es la razón por la que las cosas se ven 'pegadas' o descuadradas. Entenderlo bien te ahorra horas de andar moviendo píxeles a ciegas.",
    question:"¿Ya aplicaste padding, margin y border de forma consciente en tu proyecto?",
    steps:[
      "Identifica 3 elementos de tu página que se vean 'pegados' o descuadrados.",
      "Agrega box-sizing: border-box; a tu hoja de estilos (idealmente a todo con *).",
      "Ajusta el padding interno de tarjetas o botones para que el contenido respire.",
      "Usa margin para separar bloques entre sí, no para separar contenido interno."
    ],
    resource:"CSS Tricks — The Box Model",
    mentor:{name:"Johan Ramirez", date:"20/08/2026", time:"6:30 pm", topic:"CSS: Box model / padding / margin / border"}
  },
  {
    id:"responsive",
    title:"CSS: diseño responsivo (media queries)",
    why:"La mayoría de tus usuarios reales van a abrir tu proyecto desde el celular. Si no es responsivo, pierdes a la mayoría de tu público desde el primer segundo.",
    question:"¿Tu proyecto se ve bien tanto en celular como en computador?",
    steps:[
      "Abre tu proyecto y reduce la ventana del navegador (o revísalo desde tu celular).",
      "Identifica qué se rompe: texto muy grande, imágenes que se salen, columnas apretadas.",
      "Agrega un media query, por ejemplo: @media (max-width: 600px) { ... }",
      "Dentro de ese bloque, ajusta tamaños de fuente, anchos y organización en columna."
    ],
    resource:"freeCodeCamp Español — Diseño responsivo",
    mentor:{name:"Johan Ramirez", date:"27/08/2026", time:"6:30 pm", topic:"CSS: Media Queries / diseño responsivo"}
  },
  {
    id:"flexbox",
    title:"CSS: Flexbox para tu layout",
    why:"Flexbox es lo que usa la mayoría de sitios reales para organizar menús, tarjetas y formularios sin trucos raros. Dominarlo te ahorra mucho CSS innecesario.",
    question:"¿Usaste Flexbox para organizar alguna sección de tu proyecto (menú, tarjetas, formulario)?",
    steps:[
      "Elige una sección con varios elementos en fila o columna (ej. tarjetas de producto, menú de navegación).",
      "Al contenedor padre agrégale: display: flex;",
      "Prueba justify-content y align-items para acomodar los elementos.",
      "Si necesitas que pasen a otra línea en pantallas pequeñas, agrega flex-wrap: wrap;"
    ],
    resource:"Flexbox Froggy — practica jugando",
    mentor:{name:"Johan Ramirez", date:"03/09/2026", time:"6:30 pm", topic:"CSS: Flexbox"}
  },
  {
    id:"js",
    title:"JavaScript: funciones y tu mini-librería",
    why:"Hasta ahora tu proyecto se veía bien pero no 'hacía' nada por sí solo. Las funciones son las que convierten tu página de una vitrina a una herramienta que calcula, valida y responde.",
    question:"¿Ya escribiste al menos una función propia en tu calculos.js y la usas en tu proyecto?",
    steps:[
      "Abre tu archivo calculos.js y revisa qué función ya tienes (ej. calcular precio, descuento, ganancia).",
      "Si no tienes ninguna, escribe una función simple: function calcularTotal(precio, cantidad) { return precio * cantidad; }",
      "Conecta esa función a un botón o input de tu proyecto para que se use de verdad.",
      "Prueba con console.log() que el resultado sea el esperado antes de conectarlo a la interfaz."
    ],
    resource:"javascript.info — Funciones",
    mentor:{name:"Manuel Carpio", date:"21/09/2026", time:"6:00 pm", topic:"JavaScript: Funciones y mini-librería de cálculo"}
  },
  {
    id:"deploy",
    title:"Despliegue: tu proyecto está en línea",
    why:"Un proyecto que solo funciona en tu computador no lo puede ver nadie más. Publicarlo es lo que lo convierte en algo real que puedes compartir con tu familia, amigos o clientes.",
    question:"¿Tu proyecto ya tiene un link donde cualquiera lo pueda ver, sin instalar nada?",
    steps:[
      "Verifica que tu repositorio en GitHub esté actualizado con tu última versión.",
      "Activa GitHub Pages en la configuración del repositorio (Settings → Pages).",
      "Selecciona la rama main como fuente y espera unos minutos a que se publique.",
      "Prueba el link generado desde otro dispositivo o navegador para confirmar que funciona."
    ],
    resource:"GitHub Docs — GitHub Pages",
    mentor:null,
    supportLink:{label:"GitHub Docs — GitHub Pages", note:"Sigue la guía oficial paso a paso; si tu repo ya está actualizado, publicar toma menos de 5 minutos."},
    avanzadoOnly:true
  }
];
