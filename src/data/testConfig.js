
export const testConfig = {
  // Cabecera
  chipLabel: 'FreeTime',

  // Intro
  intro: {
    title: 'Com et sents ara mateix?',
    description: 'Respon unes preguntes ràpides i et proposarem una activitat que encaixi amb el teu moment.',
  },

  // Pregunta 1 — Nivell d'energia
  energy: {
    title: "Nivell d'energia",
    subtitle: 'Baixa → Alta',
    emojis: ['Frown', 'Annoyed', 'Laugh'],
    //emojis: ['🫠', '😌', '✨'],
    labelMin: 'Molt poca energia',
    labelMax: 'Molta energia',
    min: 0,
    max: 100,
    defaultValue: 25,
  },

  // Pregunta 2 — Què necessites avui?
  needs: {
    title: 'Què necessites avui?',
    options: [
      {
        id: 'desconnectar',
        icon: 'Moon',
        label: 'Desconnectar',
        description: 'Baixar revolucions',
      },
      {
        id: 'creativitat',
        icon: 'Palette',
        label: 'Fer alguna cosa creativa',
        description: 'Sense gaire esforç',
      },
      {
        id: 'activar',
        icon: 'Dumbbell',
        label: 'Activar-me',
        description: 'Moure una mica el cos',
      },
    ],
  },

  // Pregunta 3 — Temps disponible
  time: {
    title: 'Temps disponible',
    min: 10,      // minuts
    max: 120,     // minuts
    defaultValue: 45,
    labels: ['10 min', '1 h', '2 h'],
    formatLabel: (minutes) => {
      if (minutes < 60) return `${minutes} min`
      if (minutes === 60) return '1 h'
      return `${Math.floor(minutes / 60)}h ${minutes % 60 > 0 ? (minutes % 60) + 'min' : ''}`
    },
  },

  // Botón final
  finishButton: 'Acabar test',
}
