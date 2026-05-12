export function getScheduleConfirmCopy(language) {
  if (language === 'es') {
    return {
      chip: 'Programación',
      title: 'Confirma tu actividad',
      labels: {
        activity: 'Actividad',
        day: 'Día',
        time: 'Hora',
        reminder: 'Recordatorio',
      },
      summaryTitle: 'Resumen',
      confirm: 'Confirmar',
      empty: 'No hay ninguna actividad pendiente de confirmar',
    }
  }

  if (language === 'en') {
    return {
      chip: 'Schedule',
      title: 'Confirm your activity',
      labels: {
        activity: 'Activity',
        day: 'Day',
        time: 'Time',
        reminder: 'Reminder',
      },
      summaryTitle: 'Summary',
      confirm: 'Confirm',
      empty: 'There is no activity pending confirmation',
    }
  }

  return {
    chip: 'Programacio',
    title: 'Confirma la teva activitat',
    labels: {
      activity: 'Activitat',
      day: 'Dia',
      time: 'Hora',
      reminder: 'Recordatori',
    },
    summaryTitle: 'Resum',
    confirm: 'Confirmar',
    empty: 'No hi ha cap activitat pendent de confirmar',
  }
}

export function getScheduleDayCopy(language) {
  if (language === 'es') {
    return {
      chip: 'Programar',
      title: 'Elige un día del calendario',
      hint: 'Escoge una actividad, un día y una hora para dejarla preparada.',
      sections: {
        saved: 'De tu lista',
        recommended: 'Recomendaciones',
      },
      labels: {
        date: 'Día',
        time: 'Hora',
        reminder: 'Recordatorio',
      },
      buttons: {
        schedule: 'Programar',
        back: 'Volver',
      },
      empty: 'Aún no tienes actividades guardadas.',
      noActivity: 'No hay ninguna actividad seleccionada',
      reminderDefault: '30 min antes',
    }
  }

  if (language === 'en') {
    return {
      chip: 'Schedule',
      title: 'Choose a day on the calendar',
      hint: 'Pick an activity, a day and a time to keep it ready.',
      sections: {
        saved: 'From your list',
        recommended: 'Recommendations',
      },
      labels: {
        date: 'Day',
        time: 'Time',
        reminder: 'Reminder',
      },
      buttons: {
        schedule: 'Schedule',
        back: 'Back',
      },
      empty: 'You do not have any saved activities yet.',
      noActivity: 'No activity selected',
      reminderDefault: '30 min before',
    }
  }

  return {
    chip: 'Programar',
    title: 'Tria un dia del calendari',
    hint: 'Escull una activitat, un dia i una hora per deixar-la preparada.',
    sections: {
      saved: 'De la teva llista',
      recommended: 'Recomanacions',
    },
    labels: {
      date: 'Dia',
      time: 'Hora',
      reminder: 'Recordatori',
    },
    buttons: {
      schedule: 'Programar',
      back: 'Tornar',
    },
    empty: 'Encara no tens activitats guardades.',
    noActivity: 'No hi ha cap activitat seleccionada',
    reminderDefault: '30 min abans',
  }
}
