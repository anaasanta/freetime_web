import { authCopy } from './uiText'

export function getAuthCopy(language) {
  if (language === 'es') {
    return {
      login: {
        ...authCopy.login,
        title: 'Bienvenida a FreeTime',
        fields: {
          username: {
            ...authCopy.login.fields.username,
            label: 'Usuario',
            placeholder: 'Ej: laura',
          },
          password: {
            ...authCopy.login.fields.password,
            label: 'Contraseña',
            placeholder: 'Ej: 12345',
          },
        },
        submitLabel: 'Entrar',
        sampleUsersLabel: 'Usuarios de prueba:',
        links: {
          forgotPassword: 'He olvidado la contraseña',
          register: 'No tienes cuenta? Regístrate',
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
      },
      forgotPassword: {
        ...authCopy.forgotPassword,
        title: 'Recuperar la contraseña',
        description: 'Pantalla para recuperar la contraseña.',
        note: 'No forma parte del prototipo',
        backLabel: 'Volver al inicio de sesión',
      },
      register: {
        ...authCopy.register,
        title: 'Crear cuenta',
        description: 'Pantalla para crear una cuenta.',
        note: 'No forma parte del prototipo',
        backLabel: 'Volver al inicio de sesión',
      },
      settings: {
        ...authCopy.settings,
        title: 'Ajustes',
        description: '',
        note: '',
        backLabel: 'Volver',
        backHomeLabel: 'Volver',
        backTooltip: 'Volver atrás',
      },
      aiConsult: {
        ...authCopy.aiConsult,
        title: 'Consulta rápida con IA',
        description: 'Pantalla para probar una consulta rápida.',
        note: 'No forma parte del prototipo',
        backLabel: 'Volver al inicio',
        backActivityLabel: 'Volver a la actividad',
      },
    }
  }

  if (language === 'en') {
    return {
      login: {
        ...authCopy.login,
        title: 'Welcome to FreeTime',
        fields: {
          username: {
            ...authCopy.login.fields.username,
            label: 'Username',
            placeholder: 'Ex: laura',
          },
          password: {
            ...authCopy.login.fields.password,
            label: 'Password',
            placeholder: 'Ex: 12345',
          },
        },
        submitLabel: 'Log in',
        sampleUsersLabel: 'Sample users:',
        links: {
          forgotPassword: 'I forgot my password',
          register: "Don't have an account? Sign up",
        },
        testAccess: {
          buttonLabel: 'Fill with sample user',
          helperLabel: 'Quick test access',
          pairSeparator: ' / ',
          listSeparator: ' · ',
        },
        passwordToggle: {
          showLabel: 'Show password',
          hideLabel: 'Hide password',
        },
      },
      forgotPassword: {
        ...authCopy.forgotPassword,
        title: 'Recover your password',
        description: 'Screen to recover your password.',
        note: 'Not part of the prototype',
        backLabel: 'Back to sign in',
      },
      register: {
        ...authCopy.register,
        title: 'Create account',
        description: 'Screen to create an account.',
        note: 'Not part of the prototype',
        backLabel: 'Back to sign in',
      },
      settings: {
        ...authCopy.settings,
        title: 'Settings',
        description: '',
        note: '',
        backLabel: 'Back',
        backHomeLabel: 'Back',
        backTooltip: 'Go back',
      },
      aiConsult: {
        ...authCopy.aiConsult,
        title: 'Quick AI consult',
        description: 'Screen to try a quick consultation.',
        note: 'Not part of the prototype',
        backLabel: 'Back to home',
        backActivityLabel: 'Back to activity',
      },
    }
  }

  return {
    login: {
      ...authCopy.login,
      sampleUsersLabel: 'Usuaris de prova:',
      testAccess: {
        ...authCopy.login.testAccess,
        pairSeparator: ' / ',
        listSeparator: ' · ',
      },
      passwordToggle: {
        ...authCopy.login.passwordToggle,
      },
    },
    forgotPassword: authCopy.forgotPassword,
    register: authCopy.register,
    settings: authCopy.settings,
    aiConsult: authCopy.aiConsult,
  }
}
