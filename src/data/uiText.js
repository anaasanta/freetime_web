export const landingCopy = {
  nav: {
    brand: 'FreeTime',
    links: [
      { label: 'Com funciona', href: '#features' },
      { label: 'Comentaris', href: '#comments' },
      { label: 'Contactans', href: '#contact' },
    ],
    primaryAction: 'Començar',
    primaryRoute: { name: 'register' },
    secondaryAction: 'Inici de sessio',
    secondaryRoute: { name: 'login' },
    tooltips: {
      login: 'Entrar amb un compte existent.',
      register: 'Crear un compte nou.',
    },
  },
  hero: {
    titlePrefix: 'FreeTime per',
    titleFull: 'FreeTime',
    rotatingPrefix: 'per',
    rotatingWords: ['respirar', 'crear', 'desconnectar', 'gaudir', 'descobrir'],
    //description:
      //'Una manera serena de descobrir activitats, seguir com et sents i reservar-te espai per al que et fa be.',
    primaryAction: 'Començar',
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
    title: 'Comentaris dels nostres usuaris.',
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
  savedActivitiesEmpty:
    'Encara no tens activitats guardades. Pots afegir-ne des de recomanacions o fent el test.',
  recommendedTitle: 'Recomanades',
  recommendedBadge: 'Per a tu',
  nextActivityLabel: 'Següent activitat',
  noNextActivity: 'Encara no tens cap activitat programada',
  plannedSeparator: '·',
  viewButton: 'Veure',
  alreadySaved: 'Ja afegit',
  tooltips: {
    addSaved: 'Afegir a les meves activitats',
    profile: 'Veure el teu perfil i les activitats guardades',
    logout: 'Tancar sessió',
    settings: 'Configuració',
  },
  aria: {
    addActivity: 'Afegir activitat',
    previousSaved: 'Veure activitats anteriors',
    nextSaved: 'Veure més activitats',
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
