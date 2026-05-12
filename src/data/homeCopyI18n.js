import { homeCopy, profileCopy } from './uiText'

export function getHomeCopy(language) {
  if (language === 'es') {
    return {
      searchPlaceholder: 'Buscar hobbies para añadir...',
      testLabel: 'Test',
      testTooltip: 'Responde unas preguntas y te mostraremos actividades recomendadas según tu estado de ánimo, energía y tiempo disponible.',
      savedActivitiesTitle: 'Mis actividades',
      startedActivitiesTitle: 'Actividades iniciadas',
      savedActivitiesEmpty: 'Aún no tienes actividades guardadas. Puedes añadir desde recomendaciones o haciendo el test.',
      startedActivitiesEmpty: 'Aún no has iniciado ninguna actividad. Presiona "Iniciar actividad" cuando quieras probar una.',
      recommendedTitle: 'Recomendadas',
      nextActivityLabel: 'Próxima actividad',
      noNextActivity: 'Aún no tienes ninguna actividad programada',
      plannedSeparator: '·',
      viewButton: 'Ver',
      alreadySaved: 'Ya añadido',
      newBadge: 'Nuevo',
      tooltips: {
        addSaved: 'Añadir a mis actividades',
        deleteTooltip: 'Eliminar de mis actividades',
        profile: 'Ver tu perfil y actividades guardadas',
        logout: 'Cerrar sesión',
        settings: 'Configuración',
      },
      advancedSearch: {
        tooltip: 'Búsqueda y filtrado',
      },
      deleteActivity: 'Eliminar de mis actividades',
      deleteConfirm: {
        title: 'Eliminar actividad',
        message: '¿Estás seguro/a que quieres eliminar esta actividad de tus guardadas?',
        confirm: 'Eliminar',
        cancel: 'Cancelar',
      },
      advancedSearch: {
        tooltip: 'Búsqueda y filtrado',
      },
      aria: {
        addActivity: 'Añadir actividad',
        previousSaved: 'Ver actividades anteriores',
        nextSaved: 'Ver más actividades',
      },
    }
  }

  if (language === 'en') {
    return {
      searchPlaceholder: 'Search hobbies to add...',
      testLabel: 'Test',
      testTooltip: 'Answer a few questions and we\'ll show you recommended activities based on your mood, energy, and available time.',
      savedActivitiesTitle: 'My activities',
      startedActivitiesTitle: 'Started activities',
      savedActivitiesEmpty: 'You haven\'t saved any activities yet. You can add from recommendations or by taking the test.',
      startedActivitiesEmpty: 'You haven\'t started any activity yet. Press "Start activity" when you want to try one.',
      recommendedTitle: 'Recommended',
      nextActivityLabel: 'Next activity',
      noNextActivity: 'You don\'t have any scheduled activities yet',
      plannedSeparator: '·',
      viewButton: 'View',
      alreadySaved: 'Already added',
      newBadge: 'New',
      tooltips: {
        addSaved: 'Add to my activities',
        deleteTooltip: 'Remove from my activities',
        profile: 'View your profile and saved activities',
        logout: 'Log out',
        settings: 'Settings',
      },
      advancedSearch: {
        tooltip: 'Search and filter',
      },
      deleteActivity: 'Remove from my activities',
      deleteConfirm: {
        title: 'Remove activity',
        message: 'Are you sure you want to remove this activity from your saved list?',
        confirm: 'Remove',
        cancel: 'Cancel',
      },
      advancedSearch: {
        tooltip: 'Search and filter',
      },
      aria: {
        addActivity: 'Add activity',
        previousSaved: 'View previous activities',
        nextSaved: 'View more activities',
      },
    }
  }

  return {
    searchPlaceholder: homeCopy.searchPlaceholder,
    testLabel: homeCopy.testLabel,
    testTooltip: homeCopy.testTooltip,
    savedActivitiesTitle: homeCopy.savedActivitiesTitle,
    startedActivitiesTitle: homeCopy.startedActivitiesTitle,
    savedActivitiesEmpty: homeCopy.savedActivitiesEmpty,
    startedActivitiesEmpty: homeCopy.startedActivitiesEmpty,
    recommendedTitle: homeCopy.recommendedTitle,
    recommendedBadge: homeCopy.recommendedBadge,
    nextActivityLabel: homeCopy.nextActivityLabel,
    noNextActivity: homeCopy.noNextActivity,
    plannedSeparator: homeCopy.plannedSeparator,
    viewButton: homeCopy.viewButton,
    alreadySaved: homeCopy.alreadySaved,
    newBadge: homeCopy.newBadge,
    tooltips: homeCopy.tooltips,
    aria: homeCopy.aria,
   advancedSearch: homeCopy.advancedSearch,
   deleteActivity: homeCopy.deleteActivity,
  deleteConfirm: homeCopy.deleteConfirm,
 }
}

export function getProfileCopy(language) {
  if (language === 'es') {
    return {
      ...profileCopy,
      ageUnit: 'años',
      avatarAlt: 'Foto de perfil',
      fallbackTag: 'Perfil nuevo',
      savedActivitiesTitle: 'Mis actividades',
      plannedActivitiesTitle: 'Actividades programadas',
      startedActivitiesTitle: 'Actividades iniciadas',
      statsTitle: 'Seguimiento de energía',
      counters: {
        activities: 'actividades',
        started: 'iniciadas',
        saved: 'guardadas',
        latestActivities: 'Últimas actividades',
      },
      empty: {
        planned: 'Aún no tienes actividades programadas.',
        started: 'Aún no has iniciado ninguna actividad.',
        saved: 'Aún no tienes actividades guardadas.',
      },
      nav: {
        home: 'Volver a Home',
        settings: 'Configuración',
        logout: 'Salir',
      },
      calendar: {
        ...profileCopy.calendar,
        title: 'Calendario de tiempo libre',
        addActivity: '+ Añadir actividad',
        addActivityShort: 'Añadir actividad',
        addActivityAria: 'Añadir actividad al día',
        today: 'Hoy',
        completedPrefix: 'Hecho',
        plannedPrefix: 'Programado',
        dayAria: 'Día',
        back: 'Atrás',
        editActivityAria: 'Editar actividad',
        noActivitiesForDay: 'No hay actividades programadas para este día',
        weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
      },
      planned: {
        ...profileCopy.planned,
        fallbackTitle: 'Actividad programada',
        fallbackDescription: 'Actividad guardada en el calendario.',
        fallbackReminder: '30 min antes',
        modalTitle: 'Añadir actividad',
        modalEditTitle: 'Editar actividad',
        search: 'Buscar actividades',
        time: 'Hora',
        duration: 'Duración',
        minutes: 'minutos',
        add: 'Añadir',
        save: 'Guardar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        noActivities: 'No hay actividades disponibles',
      },
      stats: {
        labelPrefix: 'S',
        fallback: [
          { label: 'S1', before: 28, after: 56, title: 'Yoga y estiramientos' },
          { label: 'S2', before: 35, after: 52, title: 'Paseo corto' },
          { label: 'S3', before: 22, after: 44, title: 'Playlist + respiración' },
          { label: 'S4', before: 40, after: 70, title: 'Yoga y estiramientos' },
        ],
        insightLabel: 'Insight',
        insightText:
          'Las actividades registradas muestran la diferencia entre la energía antes y después de hacer cada actividad.',
      },
    }
  }

  if (language === 'en') {
    return {
      ...profileCopy,
      ageUnit: 'years',
      avatarAlt: 'Profile picture',
      fallbackTag: 'New profile',
      savedActivitiesTitle: 'My activities',
      plannedActivitiesTitle: 'Planned activities',
      startedActivitiesTitle: 'Started activities',
      statsTitle: 'Energy tracking',
      counters: {
        activities: 'activities',
        started: 'started',
        saved: 'saved',
        latestActivities: 'Latest activities',
      },
      empty: {
        planned: 'You don\'t have any planned activities yet.',
        started: 'You haven\'t started any activity yet.',
        saved: 'You don\'t have any saved activities yet.',
      },
      nav: {
        home: 'Back to Home',
        settings: 'Settings',
        logout: 'Log out',
      },
      calendar: {
        ...profileCopy.calendar,
        title: 'Free time calendar',
        addActivity: '+ Add activity',
        addActivityShort: 'Add activity',
        addActivityAria: 'Add activity to day',
        today: 'Today',
        completedPrefix: 'Done',
        plannedPrefix: 'Planned',
        dayAria: 'Day',
        back: 'Back',
        editActivityAria: 'Edit activity',
        noActivitiesForDay: 'No activities planned for this day',
        weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
      },
      planned: {
        ...profileCopy.planned,
        fallbackTitle: 'Planned activity',
        fallbackDescription: 'Activity saved in the calendar.',
        fallbackReminder: '30 min before',
        modalTitle: 'Add activity',
        modalEditTitle: 'Edit activity',
        search: 'Search activities',
        time: 'Time',
        duration: 'Duration',
        minutes: 'minutes',
        add: 'Add',
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
        noActivities: 'No activities available',
      },
      stats: {
        labelPrefix: 'S',
        fallback: [
          { label: 'S1', before: 28, after: 56, title: 'Yoga and stretching' },
          { label: 'S2', before: 35, after: 52, title: 'Short walk' },
          { label: 'S3', before: 22, after: 44, title: 'Playlist + breathing' },
          { label: 'S4', before: 40, after: 70, title: 'Yoga and stretching' },
        ],
        insightLabel: 'Insight',
        insightText:
          'Registered activities show the difference between your energy before and after each activity.',
      },
    }
  }

  return profileCopy
}
