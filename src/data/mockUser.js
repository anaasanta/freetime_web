export const mockUsers = [
  {
    id: 'laura',
    username: 'laura',
    password: '12345',

    name: 'Laura Martínez',
    age: 24,
    handle: '@lauram',
    avatar: 'laura.png',
    tags: ['Poca energia al vespre', 'Creatiu', 'Baix pressupost'],

    savedActivityIds: ['yoga', 'walk', 'breathing'],

    completedActivities: [
      {
        id: 'completed-1',
        activityId: 'yoga',
        date: '2026-04-04',
        energyBefore: 28,
        energyAfter: 56,
        note: 'Em va ajudar a començar el dia amb més calma.',
      },
      {
        id: 'completed-2',
        activityId: 'walk',
        date: '2026-04-08',
        energyBefore: 35,
        energyAfter: 52,
        note: 'Passeig curt després de classe.',
      },
      {
        id: 'completed-3',
        activityId: 'breathing',
        date: '2026-04-12',
        energyBefore: 22,
        energyAfter: 44,
        note: 'Molt útil abans de dormir.',
      },
      {
        id: 'completed-4',
        activityId: 'yoga',
        date: '2026-04-18',
        energyBefore: 40,
        energyAfter: 70,
        note: 'Sessió suau de tarda.',
      },
    ],

    plannedActivities: [
      {
        id: 'planned-1',
        activityId: 'reading',
        date: '2026-04-21',
        time: '21:00',
        reminder: '30 min abans',
      },
      {
        id: 'planned-2',
        activityId: 'drawing',
        date: '2026-04-26',
        time: '22:00',
        reminder: '30 min abans',
      },
    ],
  },

  {
    id: 'nou',
    username: 'nou',
    password: '12345',

    name: 'Usuari nou',
    age: 22,
    handle: '@nou',
    avatar: null,
    tags: ['Nou perfil'],

    savedActivityIds: [],
    completedActivities: [],
    plannedActivities: [],
  },
]