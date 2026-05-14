export const landingCopy = {
  accessibility: {
    heroDescriptionLabel: 'Descripcio de FreeTime',
  },
  sections: {
    features: 'features',
    comments: 'comments',
    contact: 'contact',
  },
  nav: {
    brand: 'FreeTime',
    brandRoute: { name: 'landing' },
    ariaLabel: 'Navegacio principal',
    links: [
      { label: 'Com funciona', href: '#features' },
      { label: 'Comentaris', href: '#comments' },
      { label: 'Contactans', href: '#contact' },
    ],
    primaryAction: 'Registra`t',
    primaryRoute: { name: 'register' },
    secondaryAction: 'Iniciar sessio',
    secondaryRoute: { name: 'login' },
    tooltips: {
      login: 'Entrar al compte',
      register: 'Crear compte',
    },
  },
  hero: {
    titlePrefix: 'FreeTime per',
    titleFull: 'FreeTime',
    rotatingPrefix: 'per',
    rotatingWords: ['respirar', 'crear', 'desconnectar', 'gaudir', 'descobrir'],
    rotatingConfig: {
      interval: 2300,
      staggerDuration: 0.02,
      splitBy: 'characters',
      mainClassName: 'landing-rotating-shell',
      splitLevelClassName: 'landing-rotating-word-group',
      elementLevelClassName: 'landing-rotating-word',
    },
    description:
      'Quan tens temps lliure i zero idees, FreeTime et dona plans que sí venen de gust: hobbies curts, moments tranquils o activitats per activar-te segons com et sents avui.',
    descriptionNote:
      'Prova, guarda i descobreix què t’encaixa sense convertir el descans en una altra tasca.',
    primaryAction: 'Registra`t',
    primaryRoute: { name: 'register' },
    secondaryAction: 'Veure inici de sessio',
    secondaryRoute: { name: 'login' },
    stats: [
      { value: '5 min', label: 'per trobar una proposta' },
      { value: '100%', label: 'centrat en temps lliure realista' },
      { value: '1 lloc', label: 'per guardar, provar i programar' },
    ],
  },
  showcase: {
    panelLabel: 'Pensat per al dia a dia',
    title: 'Organitza el teu temps lliure amb senzillesa',
    description:
      'La landing obre la porta a una experiencia mes suau: recomanacions clares, seguiment lleuger i espai per tornar a tu.',
    cards: [
      {
        title: 'Activitats que encaixen amb el teu moment',
        text: 'Filtra per energia, temps i necessitat sense perdre`t en opcions.',
      },
      {
        title: 'Un ritual curt per recomenar',
        text: 'Guarda idees, prova activitats i converteix-les en habituds petites.',
      },
      {
        title: 'La teva seleccio, sempre al davant',
        text: 'Un resum net de preferits, propers passos i el que ja has descobert.',
      },
    ],
    footer: {
      title: 'Mou-te amb una landing que no fa soroll',
      text: 'Pensada per entrar, entendre i continuar sense carregar-te de decisions innecessaries.',
    },
  },
  preview: {
    ariaLabel: 'Vista previa de la app',
    imageAlt: 'Vista previa de FreeTime',
    eyebrow: 'Vista inicial',
    title: 'Vista prèvia de l’app',
    subtitle:
      'A la dreta hi va una vista compacta de l`app, perquè es vegi d`un cop d`ull com respira FreeTime.',
    searchLabel: 'Buscar hobbies per afegir...',
    testLabel: 'Test',
    summaryLabel: 'Següent activitat',
    summaryText: 'Encara no tens cap activitat programada',
    summaryButton: 'Veure',
    cards: [
      { title: 'Llegir 30 min', value: '30', tone: 'violet' },
      { title: 'Yoga i estiraments', value: '35', tone: 'rose' },
      { title: 'Crochet', value: '20', tone: 'sky' },
    ],
    recommendations: [
      { title: 'Dibuix relaxant', value: '20', tone: 'amber' },
      { title: 'Passeig curt', value: '15', tone: 'sky' },
      { title: 'Playlist + respiració', value: '10', tone: 'indigo' },
      { title: 'Journaling', value: '10', tone: 'pink' },
    ],
  },
  featuresHeader: {
    title: 'Com funciona?',
    //subtitle:
      //'FreeTime no és una app més de productivitat, sinó una eina per reconnectar amb el que realment et fa sentir bé, sense complicacions ni pressions.',
  },
  features: [
    {
      title: 'Recomanacions mes personalitzades',
      text: 'No comences des de zero: l`app et proposa hobbies que s`adapten al teu estat d`anim.',
    },
    {
      title: 'Anàlisi de feedback', //hablamos del test del feeback, test que haces después de probar una actividad, que te ayuda a entender mejor qué te funciona y qué no, para que las recomendaciones sean cada vez más acertadas.
      text: 'Aprén sobre què et funciona i què no amb un test de feedback senzill després de provar cada activitat.',
    },
    {
      title: 'Programacio lleugera',
      text: 'Si una activitat et convenç, la pots guardar o reservar per un altre dia.',
    },
  ],
  commentsHeader: {
    ariaLabel: 'Comentaris destacats',
    title: 'Comentaris dels nostres usuaris',
    previousLabel: 'Comentari anterior',
    nextLabel: 'Comentari següent',
    speedSeconds: 42,
  },
  comments: [
    {
      quote: 'No sembla una app exigent. En dues pantalles entenc què fer i què em convé.',
      author: 'Laura',
      role: 'Estudiant',
    },
    {
      quote: 'He descobert nous hobbies que no havia provat abans.',
      author: 'Marc',
      role: 'Economista',
    },
    {
      quote: 'M`agrada que no sembli una demo genèrica, sinó una eina pensada per l`usuari.',
      author: 'Núria',
      role: 'Dissenyadora',
    },
    {
      quote: 'La interfície m`ajuda a decidir ràpid sense sentir que estic fent deures.',
      author: 'Sergi',
      role: 'Professor',
    },
    {
      quote: 'Per fi una app que no m`omple d`opcions i em dona idees útils.',
      author: 'Marta',
      role: 'Infermera',
    },
    {
      quote: 'Puc guardar plans i tornar més tard sense perdre`m pel camí.',
      author: 'Pau',
      role: 'Desenvolupador',
    },

  ],
  testimonial: {
    quote:
      'M`agrada perque no sembla una app que em demani fer mes coses; sembla una app que em deixa respirar.',
    author: 'Laura',
    role: 'Estudiant ',
    label: 'Usuaria de FreeTime',
  },
  closing: {
    title: 'Contacta amb nosaltres',
  },
  contact: {
    //subtitle:
      //'Explica’ns què necessites i et respondrem amb una proposta clara per començar sense fricció.',
    form: {
      title: 'Parla amb l’equip',
      submitLabel: 'Enviar missatge',
      successMessage: 'Missatge enviat. Ens posarem en contacte ben aviat.',
      fields: {
        name: {
          id: 'contact-name',
          label: 'Nom',
          placeholder: 'Ex: Laura Serra',
        },
        email: {
          id: 'contact-email',
          label: 'Correu electronic',
          placeholder: 'Ex: laura@email.com',
        },
        message: {
          id: 'contact-message',
          label: 'Com et podem ajudar?',
          placeholder: 'Explica breument el teu cas o què vols millorar.',
        },
      },
    },
    validation: {
      required: 'Omple tots els camps abans d’enviar el formulari.',
    },
    info: {
      title: 'Canals de contacte',
      channels: [
        {
          label: 'Email',
          value: 'contactans@freetime.app',
        },
        {
          label: 'Telefon',
          value: '+34 641 23 45 67',
        },
        {
          label: 'Horari',
          value: 'Dilluns a divendres, 9:00 - 18:00',
        },
      ],
    },
  },
}

export const authCopy = {
  login: {
    title: 'Benvinguda a FreeTime',
    fields: {
      username: {
        id: 'login-username',
        label: 'Usuari',
        placeholder: 'Ex: laura',
        autocomplete: 'username',
      },
      password: {
        id: 'login-password',
        label: 'Contrasenya',
        placeholder: 'Ex: 12345',
        autocomplete: 'current-password',
      },
    },
    submitLabel: 'Entrar',
    sampleUsersLabel: 'Usuaris de prova:',
    links: {
      forgotPassword: 'He oblidat la contrasenya',
      register: 'No tens compte? Registra’t',
    },
    testAccess: {
      buttonLabel: 'Rellenar con usuario de prueba',
      helperLabel: 'Acceso rápido de prueba',
      pairSeparator: ' / ',
      listSeparator: ' · ',
    },
    passwordToggle: {
      showLabel: 'Mostrar contraseña',
      hideLabel: 'Ocultar contraseña',
    },
    defaultCredentials: {
      username: '',
      password: '',
    },
  },
  forgotPassword: {
    title: 'Recuperar la contrasenya',
    description:
      'Pantalla per recuperar la contrasenya.',
    note:
      'No forma part del prototip',
    backLabel: 'Tornar a l’inici de sessió',
  },
  register: {
    title: 'Crear un compte',
    description:
      'Pantalla per registrar un nou usuari.',
    note:
      'No forma part del prototip',
    backLabel: 'Tornar a l’inici de sessió',
  },
  settings: {
    title: 'Configuracio',
    description:
      'Aquesta pantalla encara no esta implementada dins del prototip, pero aqui aniria la configuracio del compte i de les preferencies.',
    note:
      'Mes endavant hi podras editar notificacions, preferencies d`activitats, accessibilitat i dades personals.',
    backLabel: 'Tornar al perfil',
    backHomeLabel: 'Tornar a Home',
  },
  aiConsult: {
    title: 'Consulta FreeTimeIA',
    description:
      'Aquesta pantalla encara no esta implementada dins del prototip.',
    note:
      'Aqui aniria una conversa amb la IA per resoldre dubtes sobre activitats, materials o adaptacions.',
    backLabel: 'Tornar a Home',
  },
}

export const homeCopy = {
  searchPlaceholder: 'Buscar hobbies per afegir...',
  testLabel: 'Test',
  testTooltip:
    'Respon unes preguntes i t’ensenyarem activitats recomanades segons el teu estat d’ànim, energia i temps disponible.',
  savedActivitiesTitle: 'Les teves activitats',
  startedActivitiesTitle: 'Activitats començades',
  savedActivitiesEmpty:
    'Encara no tens activitats guardades. Pots afegir-ne des de recomanacions o fent el test.',
  startedActivitiesEmpty:
    'Encara no has començat cap activitat. Prem "Començar activitat" quan vulguis provar-ne una.',
  recommendedTitle: 'Recomanades',
  activityAtlas: {
    kicker: 'Explora per energia',
    title: 'Explora mes activitats',
    subtitle:
      'Com mes amunt, mes energia demana. Com mes a la dreta, mes temps necessita.',
    legend: {
      saved: 'Les meves activitats',
      recommended: 'Recomanades',
    },
    axis: {
      highEnergy: 'Mes energia',
      lowEnergy: 'Menys energia',
      lessTime: 'Menys temps',
      moreTime: 'Mes temps',
    },
  },
  nextActivityLabel: 'Següent activitat',
  noNextActivity: 'Encara no tens cap activitat programada',
  plannedSeparator: '·',
  viewButton: 'Veure',
  alreadySaved: 'Ja afegit',
  newBadge: 'Nou',
  tooltips: {
    addSaved: 'Afegir a les meves activitats',
    deleteTooltip: 'Eliminar de les meves activitats',
    profile: 'Veure el teu perfil i les activitats guardades',
    logout: 'Tancar sessió',
    settings: 'Configuració',
  },
  advancedSearch: {
    tooltip: 'Cerca i filtra',
  },
  deleteActivity: 'Eliminar de les meves activitats',
  deleteConfirm: {
    title: 'Eliminar activitat',
    message: "Estàs segur/a que vols eliminar aquesta activitat de les teves guardades?",
    confirm: 'Eliminar',
    cancel: 'Cancel·lar',
  },
  aria: {
    addActivity: 'Afegir activitat',
    previousSaved: 'Veure activitats anteriors',
    nextSaved: 'Veure més activitats',
  },
}

export const profileCopy = {
  ageUnit: 'anys',
  separator: '·',
  avatarAlt: 'Foto de perfil',
  fallbackTag: 'Nou perfil',
  plannedActivitiesTitle: 'Activitats programades',
  startedActivitiesTitle: 'Activitats començades',
  savedActivitiesTitle: 'Les meves activitats',
  statsTitle: 'Seguiment d’energia',
  counters: {
    activities: 'activitats',
    started: 'començades',
    saved: 'guardades',
    latestActivities: 'Últimes activitats',
  },
  empty: {
    planned: 'Encara no tens activitats programades.',
    started: 'Encara no has començat cap activitat.',
    saved: 'Encara no tens activitats guardades.',
  },
  nav: {
    home: 'Tornar a Home',
    settings: 'Ajustos',
    logout: 'Sortir',
  },
  calendar: {
    title: 'Calendari del temps lliure',
    addActivity: '+ Afegir activitat',
    addActivityShort: 'Afegir activitat',
    addActivityAria: 'Afegir activitat al dia',
    today: 'Avui',
    completedPrefix: 'Fet',
    plannedPrefix: 'Programat',
    dayAria: 'Dia',
    back: 'Enrere',
    editActivityAria: 'Editar activitat',
    noActivitiesForDay: 'No hi ha activitats programades per a aquest dia',
    weekdays: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
    months: [
      'Gener',
      'Febrer',
      'Març',
      'Abril',
      'Maig',
      'Juny',
      'Juliol',
      'Agost',
      'Setembre',
      'Octubre',
      'Novembre',
      'Desembre',
    ],
  },
  planned: {
    fallbackTitle: 'Activitat programada',
    fallbackDescription: 'Activitat guardada al calendari.',
    fallbackTime: '21:00',
    fallbackReminder: '30 min abans',
    modalTitle: 'Afegir activitat',
    modalEditTitle: 'Editar activitat',
    search: 'Cercar activitats',
    time: 'Hora',
    duration: 'Durada',
    minutes: 'minuts',
    add: 'Afegir',
    save: 'Guardar',
    delete: 'Eliminar',
    cancel: 'Cancel·lar',
    noActivities: 'No hi ha activitats disponibles',
  },
  stats: {
    labelPrefix: 'S',
    fallback: [
      { label: 'S1', before: 28, after: 56, title: 'Yoga i estiraments' },
      { label: 'S2', before: 35, after: 52, title: 'Passeig curt' },
      { label: 'S3', before: 22, after: 44, title: 'Playlist + respiració' },
      { label: 'S4', before: 40, after: 70, title: 'Yoga i estiraments' },
    ],
    dashboardTitle: 'Panell de feedback',
    dashboardHint: 'Selecciona una activitat per veure com canvia el feedback entre sessions.',
    chartHint: 'Evolucio de les ultimes sessions: energia, ment i cos.',
    selectorLabel: 'Activitat',
    overviewTitle: 'Resum de la selecció',
    historyTitle: 'Historial de sessions',
    trendTitle: 'Evolució',
    emptyTitle: 'No hi ha feedback encara',
    emptyText: 'Quan Laura completi activitats, aquí apareixeran les seves valoracions i canvis d\'estat.',
    table: {
      date: 'Data',
      energy: 'Energia',
      mind: 'Ment',
      body: 'Cos',
      rating: 'Valoració',
      note: 'Nota',
    },
    metrics: {
      before: 'Abans',
      after: 'Després',
      delta: 'Millora',
      energyBefore: 'Energia abans',
      energyAfter: 'Energia després',
      body: 'Cos',
      mood: 'Estat',
      liked: 'Li va agradar',
      sessions: 'sessions',
    },
    cards: {
      averageBoost: 'Pujada mitjana',
      favorite: 'Millor efecte',
      latest: 'Mes recent',
      liked: 'Sessions que han agradat',
      energyPoints: 'punts energia',
    },
    tooltips: {
      selector: 'Canvia l\'activitat mostrada',
      overview: 'Mitjanes calculades només amb les sessions visibles',
      history: 'Cada fila representa el feedback d\'una sessió real',
    },
    insightLabel: 'Insight',
    insightText:
      'Les activitats registrades mostren la diferència entre l’energia abans i després de fer cada activitat.',
  },
}

export const activityCopy = {
  durationUnit: 'minuts',
  closeLabel: 'Tancar descripcio',
  aiConsult: {
    question: 'Tens mes dubtes? Consulta FreeTimeIA',
    button: 'Consultar',
  },
}

export const scheduleCopy = {
  chip: 'Programar',
  title: 'Tria un dia del calendari',
  hint: 'Per al prototip funcional, pots programar Yoga el dimarts o Dibuix relaxant el divendres.',
  sections: {
    saved: 'De la teva llista',
    recommended: 'Recomanacions',
  },
  buttons: {
    schedule: 'Programar',
  },
  empty: 'Encara no tens activitats guardades.',
  monthLabel: 'Març',
  weekdays: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
}

export const activityResultCopy = {
  labels: {
    duration: 'Temps',
    difficulty: 'Dificultat',
    materials: 'Materials',
    price: 'Preu',
    energy: 'Energia',
  },
  sections: {
    description: 'Descripció',
    benefit: 'Benefici destacat',
  },
  buttons: {
    start: 'Començar activitat',
    feedback: 'Feedback',
    backHome: 'Tornar a Home',
    notFound: 'No s’ha trobat aquesta activitat',
  },
}

export const appMessages = {
  auth: {
    invalidCredentials: 'Usuari o contrasenya incorrectes.',
  },
}

export const themeCopy = {
  toggle: {
    light: 'Canviar a mode clar',
    dark: 'Canviar a mode fosc',
  },
}
