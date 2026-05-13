export function getTestCopy(language) {
  if (language === 'es') {
    return {
      intro: {
        title: '¿Cómo te sientes ahora mismo?',
        description: 'Responde unas preguntas rápidas y te proponemos una actividad que encaje con tu momento.',
      },
      closeLabel: 'Cerrar test',
      finishButton: 'Terminar test',
      energy: {
        title: 'Nivel de energía',
        moods: [
          { value: 'angry', label: 'Muy cansado/a' },
          { value: 'sad', label: 'Bajito/a' },
          { value: 'flat', label: 'Normal' },
          { value: 'smile', label: 'Bien' },
          { value: 'laugh', label: 'A tope' },
        ],
      },
      needs: {
        title: '¿Qué necesitas hoy?',
        options: [
          { id: 'desconnectar', icon: 'Moon', label: 'Desconectar', description: 'Bajar revoluciones' },
          { id: 'creativitat', icon: 'Palette', label: 'Algo creativo', description: 'Sin mucho esfuerzo' },
          { id: 'activar', icon: 'Dumbbell', label: 'Activarme', description: 'Mover un poco el cuerpo' },
        ],
      },
      time: {
        title: 'Tiempo disponible',
        hint: 'Tiempo que tienes ahora',
        units: { minute: 'min', hour: 'h' },
      },
      budget: {
        title: 'Presupuesto aproximado',
        levels: ['Gratis', 'Gasto bajo', 'Gasto medio', 'Algo flexible', 'Más flexible'],
        scale: {
          low: '$',
          high: '$$$',
        },
      },
      company: {
        title: '¿Cómo te apetece hacerlo?',
        options: [
          { id: 'solo', icon: 'Frown', label: 'Solo/a', description: 'A mi ritmo' },
          { id: 'mix', icon: 'Annoyed', label: 'Me da igual', description: 'Según encaje mejor' },
          { id: 'with', icon: 'Laugh', label: 'Con alguien', description: 'Más social' },
        ],
      },
      resultHint: {
        title: 'Tu propuesta está lista',
        subtitle: 'Si no te convence, podemos recalcular otra con el motivo que indiques.',
      },
      rejection: {
        title: '¿Por qué no te interesa?',
        subtitle: 'Elige el motivo para afinar la siguiente propuesta.',
        closeLabel: 'Cerrar ventana',
        confirm: 'Recalcular',
        skipQuestion: 'Saltar pregunta',
        options: [
          { id: 'effort', label: 'Demasiado esfuerzo' },
          { id: 'time', label: 'No encaja con mi tiempo' },
          { id: 'budget', label: 'Demasiado caro' },
        ],
      },
      tooltips: {
        close: 'Salir del test',
        finish: 'Al terminar, te enseñaremos una propuesta recomendada',
        resultReject: 'Pedir otra recomendación',
      },
    }
  }

  if (language === 'en') {
    return {
      intro: {
        title: 'How do you feel right now?',
        description: 'Answer a few quick questions and we will suggest an activity that fits your moment.',
      },
      closeLabel: 'Close test',
      finishButton: 'Finish test',
      energy: {
        title: 'Energy level',
        moods: [
          { value: 'angry', label: 'Exhausted' },
          { value: 'sad', label: 'Low' },
          { value: 'flat', label: 'Neutral' },
          { value: 'smile', label: 'Good' },
          { value: 'laugh', label: 'Pumped' },
        ],
      },
      needs: {
        title: 'What do you need today?',
        options: [
          { id: 'desconnectar', icon: 'Moon', label: 'Unplug', description: 'Slow down a bit' },
          { id: 'creativitat', icon: 'Palette', label: 'Something creative', description: 'Without much effort' },
          { id: 'activar', icon: 'Dumbbell', label: 'Get active', description: 'Move your body a little' },
        ],
      },
      time: {
        title: 'Available time',
        hint: 'Time you have right now',
        units: { minute: 'min', hour: 'h' },
      },
      budget: {
        title: 'Approximate budget',
        levels: ['Free', 'Low spend', 'Medium spend', 'Some flexibility', 'More flexible'],
        scale: {
          low: '$',
          high: '$$$',
        },
      },
      company: {
        title: 'How would you like to do it?',
        options: [
          { id: 'solo', icon: 'Frown', label: 'Solo', description: 'At my own pace' },
          { id: 'mix', icon: 'Annoyed', label: 'Either way', description: 'Whatever fits best' },
          { id: 'with', icon: 'Laugh', label: 'With someone', description: 'More social' },
        ],
      },
      resultHint: {
        title: 'Your suggestion is ready',
        subtitle: 'If it does not fit, we can recalculate another one with a reason.',
      },
      rejection: {
        title: 'Why are you not interested?',
        subtitle: 'Pick a reason to fine-tune the next suggestion.',
        closeLabel: 'Close dialog',
        confirm: 'Recalculate',
        skipQuestion: 'Skip question',
        options: [
          { id: 'effort', label: 'Too much effort' },
          { id: 'time', label: 'Not enough time' },
          { id: 'budget', label: 'Too expensive' },
        ],
      },
      tooltips: {
        close: 'Leave the test',
        finish: 'When you finish, we will show a recommended activity',
        resultReject: 'Ask for another recommendation',
      },
    }
  }

  return {
    intro: {
      title: 'Com et sents ara mateix?',
      description: 'Respon unes preguntes ràpides i et proposarem una activitat que encaixi amb el teu moment.',
    },
    closeLabel: 'Tancar test',
    finishButton: 'Acabar test',
    energy: {
      title: 'Nivell d\'energia',
      moods: [
        { value: 'angry', label: 'Molt cansat/da' },
        { value: 'sad', label: 'Baixet/ta' },
        { value: 'flat', label: 'Normal' },
        { value: 'smile', label: 'Bé' },
        { value: 'laugh', label: 'A tope' },
      ],
    },
    needs: {
      title: 'Què necessites avui?',
      options: [
        { id: 'desconnectar', icon: 'Moon', label: 'Desconnectar', description: 'Baixar revolucions' },
        { id: 'creativitat', icon: 'Palette', label: 'Fer alguna cosa creativa', description: 'Sense gaire esforç' },
        { id: 'activar', icon: 'Dumbbell', label: 'Activar-me', description: 'Moure una mica el cos' },
      ],
    },
    time: {
      title: 'Temps disponible',
      hint: 'Temps que tens ara',
      units: { minute: 'min', hour: 'h' },
    },
    budget: {
      title: 'Pressupost aproximat',
      levels: ['Gratis', 'Despesa baixa', 'Despesa mitjana', 'Una mica flexible', 'Més flexible'],
      scale: {
        low: '$',
        high: '$$$',
      },
    },
    company: {
      title: 'Com et ve de gust fer-ho?',
      options: [
        { id: 'solo', icon: 'Frown', label: 'Sol/a', description: 'Al meu ritme' },
        { id: 'mix', icon: 'Annoyed', label: 'Em fa igual', description: 'Segons encaixi millor' },
        { id: 'with', icon: 'Laugh', label: 'Amb algú', description: 'Més social' },
      ],
    },
    resultHint: {
      title: 'La proposta està a punt',
      subtitle: 'Si no t’encaixa, la podem recalcular amb el motiu que indiquis.',
    },
    rejection: {
      title: 'Per què no t’interessa?',
      subtitle: 'Escull el motiu per afinar la següent proposta.',
      closeLabel: 'Tancar finestra',
      confirm: 'Recalcular',
      skipQuestion: 'Saltar pregunta',
      options: [
        { id: 'effort', label: 'Massa esforç' },
        { id: 'time', label: 'No em quadra amb el temps' },
        { id: 'budget', label: 'Massa car' },
      ],
    },
    tooltips: {
      close: 'Sortir del test',
      finish: 'En acabar, et mostrarem una activitat recomanada',
      resultReject: 'Demana una altra recomanació',
    },
  }
}

export function getActivityResultCopy(language) {
  if (language === 'es') {
    return {
      sourceLabels: {
        test: 'Primera propuesta',
        'test-adjusted': 'Nueva propuesta',
        normal: 'Hobby',
      },
      labels: {
        duration: 'Tiempo',
        difficulty: 'Dificultad',
        materials: 'Materiales',
        price: 'Precio',
        energy: 'Energía',
      },
      sections: {
        description: 'Descripción',
        howToStart: 'Cómo empezar',
        benefit: 'Beneficio destacado',
      },
      buttons: {
        start: 'Empezar actividad',
        finish: 'Acabar actividad',
        addToList: 'Añadir a mi lista',
        removeFromList: 'Eliminar de mi lista',
        reject: 'No me interesa',
        feedback: 'Feedback',
        backToHome: 'Volver a Home',
        notFound: 'No se ha encontrado esta actividad',
      },
      rejectModal: {
        title: '¿Por qué no te interesa?',
        subtitle: 'Elige un motivo para recalcular otra propuesta.',
        confirm: 'Recalcular',
        skipQuestion: 'Saltar pregunta',
        closeLabel: 'Cerrar ventana',
        options: {
          effort: 'Demasiado esfuerzo',
          time: 'No tengo suficiente tiempo',
          budget: 'Demasiado caro',
        },
      },
      finishModal: {
        title: 'Actividad completada',
        subtitle: 'Cuéntanos qué te ha parecido para mejorar tus recomendaciones.',
        ratingLabel: '¿Cómo valoras la actividad?',
        ratingAria: 'Valoración de la actividad',
        moodLabel: '¿Cuánto ha mejorado tu estado de ánimo?',
        moodAria: 'Mejora del estado de ánimo',
        noteLabel: 'Notas (opcional)',
        notePlaceholder: '¿Cómo te has sentido durante la actividad?',
        closeLabel: 'Cerrar ventana',
        cancel: 'Cancelar',
        confirm: 'Guardar',
        starSingular: 'estrella',
        starPlural: 'estrellas',
      },
    }
  }

  if (language === 'en') {
    return {
      sourceLabels: {
        test: 'First suggestion',
        'test-adjusted': 'New suggestion',
        normal: 'Hobby',
      },
      labels: {
        duration: 'Time',
        difficulty: 'Difficulty',
        materials: 'Materials',
        price: 'Price',
        energy: 'Energy',
      },
      sections: {
        description: 'Description',
        howToStart: 'How to start',
        benefit: 'Main benefit',
      },
      buttons: {
        start: 'Start activity',
        finish: 'Finish activity',
        addToList: 'Add to my list',
        removeFromList: 'Remove from my list',
        reject: 'Not interested',
        feedback: 'Feedback',
        backToHome: 'Back to Home',
        notFound: 'This activity was not found',
      },
      rejectModal: {
        title: 'Why are you not interested?',
        subtitle: 'Choose a reason to recalculate another suggestion.',
        confirm: 'Recalculate',
        skipQuestion: 'Skip question',
        closeLabel: 'Close dialog',
        options: {
          effort: 'Too much effort',
          time: 'Not enough time',
          budget: 'Too expensive',
        },
      },
      finishModal: {
        title: 'Activity completed',
        subtitle: 'Tell us how it went so we can improve your recommendations.',
        ratingLabel: 'How would you rate the activity?',
        ratingAria: 'Activity rating',
        moodLabel: 'How much did your mood improve?',
        moodAria: 'Mood improvement',
        noteLabel: 'Notes (optional)',
        notePlaceholder: 'How did you feel during the activity?',
        closeLabel: 'Close dialog',
        cancel: 'Cancel',
        confirm: 'Save',
        starSingular: 'star',
        starPlural: 'stars',
      },
    }
  }

  return {
    sourceLabels: {
      test: 'Primera proposta',
      'test-adjusted': 'Nova proposta',
      normal: 'Hobby',
    },
    labels: {
      duration: 'Temps',
      difficulty: 'Dificultat',
      materials: 'Materials',
      price: 'Preu',
      energy: 'Energia',
    },
    sections: {
      description: 'Descripció',
      howToStart: 'Com començar',
      benefit: 'Benefici destacat',
    },
    buttons: {
      start: 'Començar activitat',
      finish: 'Acabar activitat',
      addToList: 'Afegir a la meva llista',
      removeFromList: 'Eliminar de la meva llista',
      reject: 'No m\'interessa',
      feedback: 'Feedback',
      backToHome: 'Tornar a Home',
      notFound: 'No s\'ha trobat aquesta activitat',
    },
    rejectModal: {
      title: 'Per què no t\'interessa?',
      subtitle: 'Escull un motiu per recalcular una altra proposta.',
      confirm: 'Recalcular',
      skipQuestion: 'Saltar pregunta',
      closeLabel: 'Tancar finestra',
      options: {
        effort: 'Massa esforç',
        time: 'No tinc prou temps',
        budget: 'Massa car',
      },
    },
    finishModal: {
      title: 'Activitat completada',
      subtitle: 'Explica’ns què t’ha semblat per millorar les teves recomanacions.',
      ratingLabel: 'Com valores l’activitat?',
      ratingAria: 'Valoració de l’activitat',
      moodLabel: 'Quant ha millorat el teu estat d’ànim?',
      moodAria: 'Millora de l’estat d’ànim',
      noteLabel: 'Notes (opcional)',
      notePlaceholder: 'Com t’has sentit durant l’activitat?',
      closeLabel: 'Tancar finestra',
      cancel: 'Cancel·lar',
      confirm: 'Desar',
      starSingular: 'estrella',
      starPlural: 'estrelles',
    },
  }
}

export function getActivityCopy(language) {
  if (language === 'es') {
    return {
      durationUnit: 'minutos',
      closeLabel: 'Cerrar descripción',
      aiConsult: {
        question: '¿Tienes más dudas? Consulta FreeTimeIA',
        button: 'Consultar',
      },
    }
  }

  if (language === 'en') {
    return {
      durationUnit: 'minutes',
      closeLabel: 'Close description',
      aiConsult: {
        question: 'Need more help? Ask FreeTimeAI',
        button: 'Ask',
      },
    }
  }

  return {
    durationUnit: 'minuts',
    closeLabel: 'Tancar descripcio',
    aiConsult: {
      question: 'Tens mes dubtes? Consulta FreeTimeIA',
      button: 'Consultar',
    },
  }
}
