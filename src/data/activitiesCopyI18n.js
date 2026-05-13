import { allActivities } from './activities'

const activityTranslations = {
  reading: {
    es: {
      title: 'Leer 30 min',
      shortDescription: 'Desconectarse de pantallas con una lectura corta.',
      description:
        'Leer antes de ir a dormir puede ayudarte a desconectar y reducir la estimulación de las pantallas. Aun así, requiere un poco de concentración y atención continuada.',
      materials: 'Libro',
      benefits: 'Puede ayudar a reducir el uso del móvil antes de dormir.',
      steps: [
        'Coge un libro que ya tengas empezado o un texto corto que te apetezca.',
        'Busca un espacio tranquilo y deja el móvil lejos durante un rato.',
        'Lee unos 20-30 minutos sin presión, solo para desconectar.',
      ],
    },
    en: {
      title: 'Read 30 min',
      shortDescription: 'Disconnect from screens with a short read.',
      description:
        'Reading before bed can help you disconnect and reduce screen stimulation. It still asks for a little focus and sustained attention.',
      materials: 'Book',
      benefits: 'It can help reduce phone use before going to sleep.',
      steps: [
        'Pick up a book you have already started or a short text you feel like reading.',
        'Find a quiet spot and keep your phone away for a while.',
        'Read for about 20-30 minutes without pressure, just to switch off.',
      ],
    },
  },
  drawing: {
    es: {
      title: 'Dibujo relajante',
      shortDescription: 'Actividad manual, tranquila y fácil de iniciar.',
      description:
        'Pintar formas repetitivas o dibujos sencillos puede ayudarte a desconectar sin exigir demasiada concentración. Es una actividad manual, tranquila y muy fácil de iniciar.',
      materials: 'Papel y colores',
      benefits: 'Pintar puede ayudar a reducir el estrés y favorecer la relajación.',
      steps: [
        'Coge una hoja y un par de colores o bolígrafos.',
        'Elige un ejemplo sencillo o deja que la web te muestre un patrón base.',
        'Pon un temporizador suave de 20-25 minutos y empieza sin intentar que quede perfecto.',
      ],
    },
    en: {
      title: 'Relaxing drawing',
      shortDescription: 'Hands-on activity, calm and easy to start.',
      description:
        'Coloring repetitive shapes or simple drawings can help you disconnect without demanding too much focus. It is calm, hands-on and very easy to start.',
      materials: 'Paper and colors',
      benefits: 'Coloring can help reduce stress and support relaxation.',
      steps: [
        'Grab a sheet of paper and a couple of colors or pens.',
        'Choose a simple example or let the app show you a base pattern.',
        'Set a gentle 20-25 minute timer and start without aiming for perfection.',
      ],
    },
  },
  yoga: {
    es: {
      title: 'Yoga y estiramientos',
      shortDescription: 'Mover el cuerpo sin exigirte demasiado.',
      description:
        'Sesión suave para activar el cuerpo y reducir tensión acumulada sin necesidad de material especial.',
      materials: 'Esterilla opcional',
      benefits: 'Puede mejorar la sensación corporal y reducir tensión.',
      steps: [
        'Prepara un espacio tranquilo.',
        'Haz estiramientos suaves de cuello, espalda y piernas.',
        'Termina con respiraciones lentas durante dos minutos.',
      ],
    },
    en: {
      title: 'Yoga and stretching',
      shortDescription: 'Move your body without pushing too hard.',
      description:
        'A gentle session to activate your body and release built-up tension without needing special equipment.',
      materials: 'Optional mat',
      benefits: 'It can improve body awareness and reduce tension.',
      steps: [
        'Prepare a quiet space.',
        'Do gentle stretches for your neck, back and legs.',
        'Finish with slow breathing for two minutes.',
      ],
    },
  },
  walk: {
    es: {
      title: 'Paseo corto',
      shortDescription: 'Salir un rato y cambiar de ambiente.',
      description: 'Un paseo corto ayuda a romper la inercia del móvil y cambiar el foco mental.',
      materials: 'Nada',
      benefits: 'Puede ayudarte a activarte suavemente sin mucha preparación.',
      steps: [
        'Ponte calzado cómodo.',
        'Sal sin un objetivo concreto.',
        'Intenta no mirar el móvil durante el paseo.',
      ],
    },
    en: {
      title: 'Short walk',
      shortDescription: 'Step outside and change your scenery.',
      description: 'A short walk helps break phone inertia and shift your mental focus.',
      materials: 'None',
      benefits: 'It can gently activate you without much preparation.',
      steps: ['Put on comfortable shoes.', 'Go outside without a specific goal.', 'Try not to check your phone during the walk.'],
    },
  },
  breathing: {
    es: {
      title: 'Playlist + respiración',
      shortDescription: 'Bajar revoluciones antes de dormir.',
      description: 'Una actividad corta para reducir la activación mental cuando tienes poca energía.',
      materials: 'Auriculares opcionales',
      benefits: 'Puede ayudarte a relajarte cuando tienes fatiga mental.',
      steps: [
        'Elige una playlist tranquila.',
        'Siéntate o túmbate cómodamente.',
        'Respira lentamente siguiendo el ritmo de la música.',
      ],
    },
    en: {
      title: 'Playlist + breathing',
      shortDescription: 'Wind down before sleep.',
      description: 'A short activity to reduce mental activation when your energy is low.',
      materials: 'Optional headphones',
      benefits: 'It can help you relax when you feel mentally tired.',
      steps: [
        'Choose a calm playlist.',
        'Sit or lie down comfortably.',
        'Breathe slowly following the rhythm of the music.',
      ],
    },
  },
  journaling: {
    es: {
      title: 'Journaling',
      shortDescription: 'Escribir sin presión para ordenar ideas.',
      description: 'Escribir unas líneas puede ayudarte a vaciar la mente y entender cómo te sientes.',
      materials: 'Papel o notas del móvil',
      benefits: 'Puede ayudar a ordenar pensamientos y reducir la sensación de saturación.',
      steps: [
        'Escribe tres cosas que tienes en la cabeza.',
        'Marca una cosa que puedes dejar para mañana.',
        'Termina con una frase amable hacia ti misma.',
      ],
    },
    en: {
      title: 'Journaling',
      shortDescription: 'Write freely to organize your thoughts.',
      description: 'Writing a few lines can help clear your mind and understand how you feel.',
      materials: 'Paper or phone notes',
      benefits: 'It can help organize thoughts and reduce the feeling of overload.',
      steps: [
        'Write down three things on your mind.',
        'Mark one thing you can leave for tomorrow.',
        'End with a kind sentence to yourself.',
      ],
    },
  },
  crochet: {
    es: {
      title: 'Crochet',
      shortDescription: 'Actividad manual repetitiva y relajante.',
      description:
        'Hacer crochet puede ser una actividad tranquila y repetitiva, adecuada para momentos de baja energía si ya tienes materiales básicos.',
      materials: 'Lana y aguja',
      benefits: 'Puede ayudar a mantener las manos ocupadas y reducir el consumo pasivo.',
      steps: [
        'Prepara lana y aguja.',
        'Elige un patrón muy sencillo.',
        'Haz una fila corta sin buscar un resultado perfecto.',
      ],
    },
    en: {
      title: 'Crochet',
      shortDescription: 'Hands-on repetitive and relaxing activity.',
      description:
        'Crochet can be a calm and repetitive activity, good for low-energy moments if you already have basic materials.',
      materials: 'Yarn and hook',
      benefits: 'It can keep your hands busy and reduce passive scrolling.',
      steps: ['Prepare yarn and a hook.', 'Choose a very simple pattern.', 'Make one short row without aiming for a perfect result.'],
    },
  },
  origami: {
    es: {
      title: 'Origami sencillo',
      shortDescription: 'Doblar papel con calma y atención.',
      description:
        'Hacer una figura de origami sencilla es una manera rápida de concentrarte en una tarea manual sin necesitar mucho material.',
      materials: 'Papel',
      benefits: 'Puede ayudar a entrenar la paciencia y reducir la dispersión mental.',
      steps: [
        'Coge una hoja cuadrada o recorta un papel normal.',
        'Busca una figura muy simple, como un barco o una grulla básica.',
        'Sigue los pliegues poco a poco y repite si algún paso no sale a la primera.',
      ],
    },
    en: {
      title: 'Simple origami',
      shortDescription: 'Fold paper with care and focus.',
      description:
        'Making a simple origami figure is a quick way to focus on a hands-on task without needing much material.',
      materials: 'Paper',
      benefits: 'It can train patience and reduce mental scatteredness.',
      steps: [
        'Take a square sheet or cut a regular piece of paper.',
        'Look for a very simple figure, like a boat or a basic crane.',
        'Follow the folds slowly and repeat a step if it does not work the first time.',
      ],
    },
  },
  'cooking-simple': {
    es: {
      title: 'Cocinar una receta fácil',
      shortDescription: 'Preparar algo bueno sin complicarte.',
      description:
        'Cocinar una receta corta puede ser una actividad creativa y práctica, ideal si quieres salir del piloto automático un rato.',
      materials: 'Ingredientes básicos',
      benefits: 'Puede dar sensación de autonomía y terminar con una recompensa tangible.',
      steps: [
        'Elige una receta con pocos ingredientes.',
        'Prepara todo lo que necesitas antes de empezar.',
        'Cocina sin prisa y guarda la receta si te ha funcionado.',
      ],
    },
    en: {
      title: 'Cook an easy recipe',
      shortDescription: 'Prepare something delicious without stress.',
      description:
        'Cooking a short recipe can be creative and practical, ideal if you want to step out of autopilot for a while.',
      materials: 'Basic ingredients',
      benefits: 'It can give a sense of autonomy and end with a tangible reward.',
      steps: [
        'Choose a recipe with few ingredients.',
        'Prepare everything you need before starting.',
        'Cook without rushing and save the recipe if it worked for you.',
      ],
    },
  },
  'dance-break': {
    es: {
      title: 'Bailar',
      shortDescription: 'Mover el cuerpo con música que te apetezca.',
      description:
        'Bailar unas cuantas canciones es una forma rápida de activarte y descargar tensión sin ningún objetivo técnico.',
      materials: 'Música',
      benefits: 'Puede subir la energía y mejorar el estado de ánimo en poco rato.',
      steps: [
        'Elige tres canciones que te hagan moverte.',
        'Aparta un poco de espacio alrededor.',
        'Baila sin mirarte ni juzgar cómo queda.',
      ],
    },
    en: {
      title: 'Dance break',
      shortDescription: 'Move to music you love.',
      description: 'Dancing to a few songs is a quick way to activate and release tension without any technical goal.',
      materials: 'Music',
      benefits: 'It can raise energy and improve your mood in a short time.',
      steps: [
        'Choose three songs that make you want to move.',
        'Clear a little space around you.',
        'Dance without watching or judging yourself.',
      ],
    },
  },
  'language-practice': {
    es: {
      title: 'Practicar un idioma',
      shortDescription: 'Hacer una práctica corta y realista.',
      description:
        'Una sesión breve de idioma puede ser estimulante sin convertirse en una obligación larga: vocabulario, escucha o una conversación corta.',
      materials: 'App, libreta o audio',
      benefits: 'Puede dar sensación de progreso sin requerir una sesión de estudio pesada.',
      steps: [
        'Elige una sola habilidad: escuchar, leer o vocabulario.',
        'Haz 15-20 minutos con un objetivo pequeño.',
        'Escribe tres palabras o frases que quieras recordar.',
      ],
    },
    en: {
      title: 'Language practice',
      shortDescription: 'Do a short, practical session.',
      description:
        'A brief language session can be stimulating without becoming a long obligation: vocabulary, listening or a short conversation.',
      materials: 'App, notebook or audio',
      benefits: 'It can create a sense of progress without requiring a heavy study session.',
      steps: [
        'Choose just one skill: listening, reading or vocabulary.',
        'Spend 15-20 minutes on a small goal.',
        'Write down three words or phrases you want to remember.',
      ],
    },
  },
  meditation: {
    es: {
      title: 'Meditación guiada',
      shortDescription: 'Pararte unos minutos y respirar con guía.',
      description: 'Una meditación guiada corta puede ayudarte a bajar el ritmo cuando notas saturación o tensión mental.',
      materials: 'Audio opcional',
      benefits: 'Puede facilitar una pausa mental sin tener que saber meditar por tu cuenta.',
      steps: [
        'Siéntate en una postura cómoda.',
        'Pon un audio corto o simplemente un temporizador.',
        'Vuelve a la respiración cada vez que te distraigas.',
      ],
    },
    en: {
      title: 'Guided meditation',
      shortDescription: 'Take a moment to breathe with guidance.',
      description: 'A short guided meditation can help you slow down when you feel overloaded or mentally tense.',
      materials: 'Optional audio',
      benefits: 'It can make a mental pause easier without needing to know how to meditate alone.',
      steps: [
        'Sit in a comfortable posture.',
        'Play a short audio or simply set a timer.',
        'Come back to your breath whenever you get distracted.',
      ],
    },
  },
  'playlist-curation': {
    es: {
      title: 'Crear una playlist',
      shortDescription: 'Elegir canciones para un estado de ánimo concreto.',
      description:
        'Hacer una playlist pequeña puede ser una actividad creativa y emocionalmente útil, sobre todo si quieres poner nombre a cómo te sientes.',
      materials: 'App de música',
      benefits: 'Puede ayudar a regular el estado de ánimo y dejarte un recurso para otros días.',
      steps: [
        'Elige un tema: calma, energía, estudiar o caminar.',
        'Añade entre 8 y 12 canciones.',
        'Ordena las canciones para crear un principio y un final agradables.',
      ],
    },
    en: {
      title: 'Playlist curation',
      shortDescription: 'Choose songs for a specific mood.',
      description:
        'Making a small playlist can be creative and emotionally useful, especially if you want to name how you feel.',
      materials: 'Music app',
      benefits: 'It can help regulate your mood and leave you a resource for another day.',
      steps: [
        'Choose a theme: calm, energy, studying or walking.',
        'Add between 8 and 12 songs.',
        'Order the songs to create a pleasant beginning and ending.',
      ],
    },
  },
  'creative-writing': {
    es: {
      title: 'Escritura creativa',
      shortDescription: 'Inventar una escena o microrelato corto.',
      description:
        'Escribir ficción corta puede activar la imaginación sin tener que compartir el resultado ni hacerlo perfecto.',
      materials: 'Papel u ordenador',
      benefits: 'Puede dar salida a ideas y emociones de una manera lúdica.',
      steps: [
        'Escribe una frase inicial cualquiera.',
        'Continúa durante 15 minutos sin editar.',
        'Subraya una frase que te guste y deja el resto tal como está.',
      ],
    },
    en: {
      title: 'Creative writing',
      shortDescription: 'Invent a short scene or micro-story.',
      description: 'Writing short fiction can activate your imagination without needing to share it or make it perfect.',
      materials: 'Paper or computer',
      benefits: 'It can give ideas and emotions a playful outlet.',
      steps: [
        'Write any opening sentence.',
        'Continue for 15 minutes without editing.',
        'Underline one sentence you like and leave the rest as it is.',
      ],
    },
  },
  'bike-ride': {
    es: {
      title: 'Paseo en bici',
      shortDescription: 'Hacer una ruta corta y asequible.',
      description:
        'Un paseo en bicicleta puede activar el cuerpo y dar sensación de aire fresco, siempre eligiendo una ruta segura y adecuada a tu nivel.',
      materials: 'Bicicleta y casco',
      benefits: 'Puede mejorar la energía y ayudar a descargar tensión física.',
      steps: [
        'Elige una ruta conocida y segura.',
        'Revisa frenos, ruedas y lleva agua.',
        'Haz una vuelta corta sin buscar rendimiento.',
      ],
    },
    en: {
      title: 'Bike ride',
      shortDescription: 'Take a short, manageable route.',
      description:
        'A bike ride can activate your body and bring a feeling of fresh air, as long as you choose a safe route that fits your level.',
      materials: 'Bike and helmet',
      benefits: 'It can improve energy and help release physical tension.',
      steps: [
        'Choose a familiar and safe route.',
        'Check brakes and wheels, and bring water.',
        'Take a short ride without chasing performance.',
      ],
    },
  },
  climbing: {
    es: {
      title: 'Escalada',
      shortDescription: 'Activar el cuerpo con un reto físico y mental.',
      description:
        'La escalada en rocódromo combina fuerza, coordinación y concentración. Es una buena opción si quieres una actividad intensa pero también muy enfocada.',
      materials: 'Ropa cómoda y pies de gato de alquiler',
      benefits: 'Puede aumentar energía, confianza corporal y capacidad de concentración.',
      steps: [
        'Busca un rocódromo cercano con zona para principiantes.',
        'Pide material de alquiler y una explicación básica de seguridad.',
        'Empieza por vías fáciles y haz pausas entre intentos.',
      ],
    },
    en: {
      title: 'Climbing',
      shortDescription: 'Activate your body with a physical and mental challenge.',
      description:
        'Indoor climbing combines strength, coordination and concentration. It is a good option if you want something intense but also very focused.',
      materials: 'Comfortable clothes and rental climbing shoes',
      benefits: 'It can increase energy, body confidence and focus.',
      steps: [
        'Find a nearby climbing gym with a beginner area.',
        'Ask for rental gear and a basic safety explanation.',
        'Start with easy routes and take breaks between attempts.',
      ],
    },
  },
  knitting: {
    es: {
      title: 'Tejer',
      shortDescription: 'Hacer puntos repetitivos con lana y agujas.',
      description:
        'Tejer es una actividad manual pausada que puede ayudarte a relajarte mientras avanzas en un proyecto pequeño y tangible.',
      materials: 'Lana y agujas',
      benefits: 'Puede mantener las manos ocupadas y reducir la necesidad de mirar pantallas.',
      steps: [
        'Elige un proyecto sencillo, como una muestra o una bufanda pequeña.',
        'Prepara lana, agujas y un tutorial básico si lo necesitas.',
        'Haz unas cuantas filas sin preocuparte por el resultado perfecto.',
      ],
    },
    en: {
      title: 'Knitting',
      shortDescription: 'Make repetitive stitches with yarn and needles.',
      description:
        'Knitting is a slow hands-on activity that can help you relax while you make progress on a small, tangible project.',
      materials: 'Yarn and needles',
      benefits: 'It can keep your hands busy and reduce the urge to look at screens.',
      steps: [
        'Choose a simple project, like a sample or a small scarf.',
        'Prepare yarn, needles and a basic tutorial if you need one.',
        'Make a few rows without worrying about a perfect result.',
      ],
    },
  },
  scrapbook: {
    es: {
      title: 'Scrapbook',
      shortDescription: 'Crear una página con fotos, papeles y recuerdos.',
      description:
        'Hacer scrapbook mezcla creatividad, memoria y composición visual. Es ideal si tienes fotos, entradas o papeles bonitos que quieres guardar de una manera personal.',
      materials: 'Fotos, cartulina, tijeras y pegamento',
      benefits: 'Puede ayudar a ordenar recuerdos y expresar creatividad sin prisa.',
      steps: [
        'Elige una foto o recuerdo como centro de la página.',
        'Combina papeles, colores y pequeños textos alrededor.',
        'Pégalo cuando te guste la composición general.',
      ],
    },
    en: {
      title: 'Scrapbooking',
      shortDescription: 'Create a page with photos, papers and memories.',
      description:
        'Scrapbooking mixes creativity, memory and visual composition. It is ideal if you have photos, tickets or nice papers you want to keep in a personal way.',
      materials: 'Photos, cardstock, scissors and glue',
      benefits: 'It can help organize memories and express creativity without rushing.',
      steps: [
        'Choose one photo or memory as the center of the page.',
        'Arrange papers, colors and small notes around it.',
        'Glue everything when you like the overall composition.',
      ],
    },
  },
  boxing: {
    es: {
      title: 'Boxeo',
      shortDescription: 'Descargar energía con golpes técnicos y controlados.',
      description:
        'Una sesión de boxeo puede ser muy útil para activarte, descargar tensión y entrenar coordinación, siempre con técnica y calentamiento.',
      materials: 'Guantes o clase dirigida',
      benefits: 'Puede ayudar a liberar tensión física y sentirte con más energía.',
      steps: [
        'Calienta hombros, muñecas y piernas antes de empezar.',
        'Practica combinaciones básicas con calma: jab, directo y esquiva.',
        'Termina con estiramientos suaves y respiración lenta.',
      ],
    },
    en: {
      title: 'Boxing',
      shortDescription: 'Release energy with controlled technical punches.',
      description:
        'A boxing session can be very useful to activate, release tension and train coordination, always with technique and warm-up.',
      materials: 'Gloves or guided class',
      benefits: 'It can help release physical tension and make you feel more energetic.',
      steps: [
        'Warm up shoulders, wrists and legs before starting.',
        'Practice basic combinations calmly: jab, cross and slip.',
        'Finish with gentle stretching and slow breathing.',
      ],
    },
  },
  pottery: {
    es: {
      title: 'Cerámica',
      shortDescription: 'Modelar barro con las manos y crear una pieza simple.',
      description:
        'La cerámica es una actividad muy sensorial y creativa. Modelar barro puede ayudar a bajar el ritmo y centrarte en una tarea manual.',
      materials: 'Barro o taller de cerámica',
      benefits: 'Puede relajar y dar una sensación clara de proceso creativo.',
      steps: [
        'Elige una pieza sencilla, como un bol pequeño o una bandeja.',
        'Modela la forma principal sin buscar simetría perfecta.',
        'Alisa bordes y déjala secar según el material o taller.',
      ],
    },
    en: {
      title: 'Pottery',
      shortDescription: 'Shape clay with your hands and make a simple piece.',
      description:
        'Pottery is a very sensory and creative activity. Shaping clay can help you slow down and focus on a hands-on task.',
      materials: 'Clay or pottery workshop',
      benefits: 'It can be relaxing and give a clear sense of creative process.',
      steps: [
        'Choose a simple piece, like a small bowl or tray.',
        'Shape the main form without aiming for perfect symmetry.',
        'Smooth the edges and let it dry according to the material or workshop.',
      ],
    },
  },
  gardening: {
    es: {
      title: 'Jardinería',
      shortDescription: 'Plantar, trasplantar o preparar una maceta.',
      description:
        'La jardinería es una manera tranquila de mover un poco el cuerpo y cuidar algo vivo, aunque solo tengas un balcón o una ventana.',
      materials: 'Tierra, maceta y planta o semillas',
      benefits: 'Puede aportar calma, contacto con materiales naturales y sensación de cuidado.',
      steps: [
        'Prepara la maceta, la tierra y la planta o semilla.',
        'Trasplanta o siembra con calma, ensuciándote las manos si te apetece.',
        'Riega un poco y deja la maceta en un lugar adecuado.',
      ],
    },
    en: {
      title: 'Gardening',
      shortDescription: 'Plant, repot or prepare a pot.',
      description:
        'Gardening is a calm way to move your body a little and care for something living, even if you only have a balcony or a window.',
      materials: 'Soil, pot and plant or seeds',
      benefits: 'It can bring calm, contact with natural materials and a feeling of care.',
      steps: [
        'Prepare the pot, soil and plant or seed.',
        'Repot or sow calmly, getting your hands dirty if you feel like it.',
        'Water a little and leave the pot in a suitable place.',
      ],
    },
  },
  swimming: {
    es: {
      title: 'Nadar',
      shortDescription: 'Hacer unos largos a ritmo cómodo.',
      description:
        'Nadar puede activar el cuerpo sin impacto fuerte en las articulaciones. Es una opción completa si tienes acceso a piscina.',
      materials: 'Bañador, toalla y gafas',
      benefits: 'Puede mejorar la energía y dejar una sensación corporal ligera.',
      steps: [
        'Calienta con unos largos muy suaves.',
        'Alterna ritmo cómodo con pausas cortas.',
        'Termina con una vuelta lenta para relajar el cuerpo.',
      ],
    },
    en: {
      title: 'Swimming',
      shortDescription: 'Swim a few lengths at a comfortable pace.',
      description:
        'Swimming can activate your body without strong impact on your joints. It is a complete option if you have access to a pool.',
      materials: 'Swimsuit, towel and goggles',
      benefits: 'It can improve energy and leave your body feeling lighter.',
      steps: [
        'Warm up with a few very gentle lengths.',
        'Alternate a comfortable pace with short breaks.',
        'Finish with a slow length to relax your body.',
      ],
    },
  },
}

function getActivityTranslation(activityId, language) {
  if (language !== 'es' && language !== 'en') return null
  return activityTranslations[activityId]?.[language] ?? null
}

export function getActivityTitle(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return ''

  return getActivityTranslation(activityId, language)?.title || activity.title
}

export function getActivityShortDescription(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return ''

  return getActivityTranslation(activityId, language)?.shortDescription || activity.shortDescription
}

export function getActivityByIdWithTranslations(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return null

  const translation = getActivityTranslation(activityId, language)
  if (!translation) return activity

  return {
    ...activity,
    ...translation,
  }
}

export const durationUnitI18n = {
  ca: 'min',
  es: 'min',
  en: 'min',
}
