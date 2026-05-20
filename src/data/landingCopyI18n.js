import { landingCopy } from './uiText'

export function getLandingCopy(language) {
  if (language === 'es') {
    return {
      ...landingCopy,
      nav: {
        ...landingCopy.nav,
        ariaLabel: 'Navegación principal',
        links: [
          { label: 'Cómo funciona', href: '#features' },
          { label: 'Comentarios', href: '#comments' },
          { label: 'Contacta', href: '#contact' },
        ],
        discoverAction: 'Descubre actividades',
        discoverRoute: { name: 'home' },
        primaryAction: 'Regístrate',
        secondaryAction: 'Iniciar sesión',
        tooltips: {
          discover: 'Realiza el test o descubre nuestro catálogo de actividades',
          login: 'Entrar en la cuenta',
          register: 'Crear cuenta',
        },
      },
      hero: {
        ...landingCopy.hero,
        titlePrefix: 'FreeTime para',
        rotatingPrefix: 'para',
        rotatingWords: ['respirar', 'crear', 'desconectar', 'disfrutar', 'descubrir'],
        description:
          'Cuando tienes tiempo libre y cero ideas, FreeTime te propone planes que sí apetecen: hobbies cortos, momentos tranquilos o actividades para activarte según cómo te sientas hoy.',
        descriptionNote:
          'Prueba, guarda y descubre qué encaja contigo sin convertir el descanso en otra tarea.',
        discoverCard: '¡Descubre tu actividad!',
        flipHint: '¡Gírame!',
        primaryAction: 'Regístrate',
        secondaryAction: 'Ver inicio de sesión',
        stats: [
          { value: '5 min', label: 'para encontrar una propuesta' },
          { value: '100%', label: 'centrado en tiempo libre realista' },
          { value: '1 lugar', label: 'para guardar, probar y programar' },
        ],
      },
      featuresHeader: {
        ...landingCopy.featuresHeader,
        title: '¿Cómo funciona?',
      },
      features: [
        {
          title: 'Recomendaciones más personalizadas',
          text: 'No empiezas desde cero: la app te propone hobbies que se adaptan a tu estado de ánimo.',
        },
        {
          title: 'Análisis de feedback',
          text: 'Aprende qué te funciona y qué no con un test sencillo después de probar cada actividad.',
        },
        {
          title: 'Programación ligera',
          text: 'Si una actividad te convence, la puedes guardar o reservar para otro día.',
        },
      ],
      commentsHeader: {
        ...landingCopy.commentsHeader,
        title: 'Comentarios de nuestros usuarios',
        previousLabel: 'Comentario anterior',
        nextLabel: 'Comentario siguiente',
      },
      comments: [
        {
          quote: 'No parece una app exigente. En dos pantallas entiendo qué hacer y qué me conviene.',
          author: 'Laura',
          role: 'Estudiante',
        },
        {
          quote: 'He descubierto nuevos hobbies que no había probado antes.',
          author: 'Marc',
          role: 'Economista',
        },
        {
          quote: 'Me gusta que no parezca una demo genérica, sino una herramienta pensada para la persona.',
          author: 'Núria',
          role: 'Diseñadora',
        },
        {
          quote: 'La interfaz me ayuda a decidir rápido sin sentir que estoy haciendo tarea.',
          author: 'Sergio',
          role: 'Profesor',
        },
        {
          quote: 'Por fin una app que no me satura con opciones y me da ideas útiles.',
          author: 'Marta',
          role: 'Enfermera',
        },
        {
          quote: 'Puedo guardar planes y volver luego sin perderme por el camino.',
          author: 'Pablo',
          role: 'Desarrollador',
        },
      ],
      closing: {
        ...landingCopy.closing,
        title: 'Contacta con nosotros',
      },
      contact: {
        ...landingCopy.contact,
        form: {
          ...landingCopy.contact.form,
          title: 'Habla con el equipo',
          submitLabel: 'Enviar mensaje',
          fields: {
            name: { ...landingCopy.contact.form.fields.name, label: 'Nombre', placeholder: 'Ej: Juan García' },
            email: {
              ...landingCopy.contact.form.fields.email,
              label: 'Correo electrónico',
              placeholder: 'Ej: juan@gmail.com',
            },
            message: {
              ...landingCopy.contact.form.fields.message,
              label: '¿Cómo podemos ayudarte?',
              placeholder: 'Explica brevemente tu caso o lo que quieres mejorar.',
            },
          },
        },
        validation: {
          required: 'Completa todos los campos antes de enviar el formulario.',
        },
        info: {
          ...landingCopy.contact.info,
          title: 'Canales de contacto',
          channels: [
            { label: 'Email', value: 'contactans@freetime.app' },
            { label: 'Teléfono', value: '+34 641 23 45 67' },
            { label: 'Horario', value: 'Lunes a viernes, 9:00 - 18:00' },
          ],
        },
      },
      preview: {
        ...landingCopy.preview,
        title: 'Vista previa de la app',
        subtitle:
          'A la derecha hay una vista compacta de la app, para que se vea de un vistazo cómo respira FreeTime.',
        searchLabel: 'Buscar hobbies para añadir...',
        testLabel: 'Test',
        summaryLabel: 'Siguiente actividad',
        summaryText: 'Aún no tienes ninguna actividad programada',
        summaryButton: 'Ver',
      },
    }
  }

  if (language === 'en') {
    return {
      ...landingCopy,
      nav: {
        ...landingCopy.nav,
        ariaLabel: 'Main navigation',
        links: [
          { label: 'How it works', href: '#features' },
          { label: 'Reviews', href: '#comments' },
          { label: 'Contact', href: '#contact' },
        ],
        discoverAction: 'Discover activities',
        discoverRoute: { name: 'home' },
        primaryAction: 'Sign up',
        secondaryAction: 'Log in',
        tooltips: {
          discover: 'Take the test or discover our activity catalog',
          login: 'Log into your account',
          register: 'Create an account',
        },
      },
      hero: {
        ...landingCopy.hero,
        titlePrefix: 'FreeTime for',
        rotatingPrefix: 'to',
        rotatingWords: ['breathe', 'create', 'disconnect', 'enjoy', 'discover'],
        description:
          'When you have free time and zero ideas, FreeTime suggests plans that actually feel good: short hobbies, calm moments, or activities that fit how you feel today.',
        descriptionNote:
          'Try, save, and discover what fits you without turning rest into another task.',
        discoverCard: 'Discover your activity!',
        flipHint: 'Flip me!',
        primaryAction: 'Sign up',
        secondaryAction: 'View login',
        stats: [
          { value: '5 min', label: 'to find a suggestion' },
          { value: '100%', label: 'focused on realistic free time' },
          { value: '1 place', label: 'to save, try, and schedule' },
        ],
      },
      featuresHeader: {
        ...landingCopy.featuresHeader,
        title: 'How it works',
      },
      features: [
        {
          title: 'More personal recommendations',
          text: 'You do not start from zero: the app suggests hobbies that fit your mood.',
        },
        {
          title: 'Feedback analysis',
          text: 'Learn what works and what does not with a simple test after each activity.',
        },
        {
          title: 'Light scheduling',
          text: 'If an activity feels right, you can save it or keep it for another day.',
        },
      ],
      commentsHeader: {
        ...landingCopy.commentsHeader,
        title: 'What our users say',
        previousLabel: 'Previous comment',
        nextLabel: 'Next comment',
      },
      comments: [
        {
          quote: 'It does not feel like a demanding app. In two screens I understand what to do and what suits me.',
          author: 'Laura',
          role: 'Student',
        },
        {
          quote: 'I have discovered new hobbies I had not tried before.',
          author: 'Marc',
          role: 'Economist',
        },
        {
          quote: 'I like that it does not feel like a generic demo, but a tool designed for the user.',
          author: 'Núria',
          role: 'Designer',
        },
        {
          quote: 'The interface helps me decide quickly without feeling like I am doing homework.',
          author: 'Sergio',
          role: 'Teacher',
        },
        {
          quote: 'At last, an app that does not overwhelm me with options and gives me useful ideas.',
          author: 'Marta',
          role: 'Nurse',
        },
        {
          quote: 'I can save plans and come back later without losing my place.',
          author: 'Pablo',
          role: 'Developer',
        },
      ],
      closing: {
        ...landingCopy.closing,
        title: 'Get in touch',
      },
      contact: {
        ...landingCopy.contact,
        form: {
          ...landingCopy.contact.form,
          title: 'Talk to the team',
          submitLabel: 'Send message',
          fields: {
            name: { ...landingCopy.contact.form.fields.name, label: 'Name', placeholder: 'Ex: Juan García' },
            email: {
              ...landingCopy.contact.form.fields.email,
              label: 'Email',
              placeholder: 'Ex: juan@gmail.com',
            },
            message: {
              ...landingCopy.contact.form.fields.message,
              label: 'How can we help you?',
              placeholder: 'Briefly explain your case or what you want to improve.',
            },
          },
        },
        validation: {
          required: 'Fill in all fields before sending the form.',
        },
        info: {
          ...landingCopy.contact.info,
          title: 'Contact channels',
          channels: [
            { label: 'Email', value: 'contactans@freetime.app' },
            { label: 'Phone', value: '+34 641 23 45 67' },
            { label: 'Hours', value: 'Monday to Friday, 9:00 - 18:00' },
          ],
        },
      },
      preview: {
        ...landingCopy.preview,
        title: 'App preview',
        subtitle:
          'On the right there is a compact preview of the app, so you can see at a glance how FreeTime feels.',
        searchLabel: 'Search hobbies to add...',
        testLabel: 'Test',
        summaryLabel: 'Next activity',
        summaryText: 'You do not have any scheduled activity yet',
        summaryButton: 'View',
      },
    }
  }

  return landingCopy
}
