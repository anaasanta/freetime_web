import { allActivities } from './activities'

const activityTranslations = {
  reading: {
    es: { title: 'Leer 30 min', shortDescription: 'Desconectarse de pantallas con una lectura corta.' },
    en: { title: 'Read 30 min', shortDescription: 'Disconnect from screens with a short read.' },
  },
  drawing: {
    es: { title: 'Dibujo relajante', shortDescription: 'Actividad manual, tranquila y fácil de iniciar.' },
    en: { title: 'Relaxing drawing', shortDescription: 'Hands-on activity, calm and easy to start.' },
  },
  yoga: {
    es: { title: 'Yoga y estiramientos', shortDescription: 'Mover el cuerpo sin exigirte demasiado.' },
    en: { title: 'Yoga and stretching', shortDescription: 'Move your body without pushing too hard.' },
  },
  walk: {
    es: { title: 'Paseo corto', shortDescription: 'Salir un rato y cambiar de ambiente.' },
    en: { title: 'Short walk', shortDescription: 'Step outside and change your scenery.' },
  },
  breathing: {
    es: { title: 'Playlist + respiración', shortDescription: 'Bajar revoluciones antes de dormir.' },
    en: { title: 'Playlist + breathing', shortDescription: 'Wind down before sleep.' },
  },
  journaling: {
    es: { title: 'Journaling', shortDescription: 'Escribir sin presión para ordenar ideas.' },
    en: { title: 'Journaling', shortDescription: 'Write freely to organize your thoughts.' },
  },
  crochet: {
    es: { title: 'Crochet', shortDescription: 'Actividad manual repetitiva y relajante.' },
    en: { title: 'Crochet', shortDescription: 'Hands-on repetitive and relaxing activity.' },
  },
  origami: {
    es: { title: 'Origami sencillo', shortDescription: 'Doblar papel con calma y atención.' },
    en: { title: 'Simple origami', shortDescription: 'Fold paper with care and focus.' },
  },
  'cooking-simple': {
    es: { title: 'Cocinar una receta fácil', shortDescription: 'Preparar algo bueno sin complicarte.' },
    en: { title: 'Cook an easy recipe', shortDescription: 'Prepare something delicious without stress.' },
  },
  'dance-break': {
    es: { title: 'Bailar', shortDescription: 'Mover el cuerpo con música que te venga de gusta.' },
    en: { title: 'Dance break', shortDescription: 'Move to music you love.' },
  },
  'language-practice': {
    es: { title: 'Practicar un idioma', shortDescription: 'Hacer una práctica corta y realista.' },
    en: { title: 'Language practice', shortDescription: 'Do a short, practical session.' },
  },
  meditation: {
    es: { title: 'Meditación guiada', shortDescription: 'Atarte unos minutos y respirar con guía.' },
    en: { title: 'Guided meditation', shortDescription: 'Take a moment to breathe and center yourself.' },
  },
  'playlist-curation': {
    es: { title: 'Curaciones de playlist', shortDescription: 'Hacer una lista personalizada.' },
    en: { title: 'Playlist curation', shortDescription: 'Create a personalized playlist.' },
  },
  'creative-writing': {
    es: { title: 'Escritura creativa', shortDescription: 'Escribir una historia o poema corto.' },
    en: { title: 'Creative writing', shortDescription: 'Write a short story or poem.' },
  },
  'bike-ride': {
    es: { title: 'Paseo en bici', shortDescription: 'Actividad al aire libre con ritmo medio.' },
    en: { title: 'Bike ride', shortDescription: 'Outdoor activity at a steady pace.' },
  },
  climbing: {
    es: { title: 'Escalada', shortDescription: 'Actividad de desafío físico y mental.' },
    en: { title: 'Climbing', shortDescription: 'Physical and mental challenge activity.' },
  },
  knitting: {
    es: { title: 'Tejer', shortDescription: 'Actividad manual rítmica y meditativa.' },
    en: { title: 'Knitting', shortDescription: 'Rhythmic and meditative hands-on activity.' },
  },
  scrapbook: {
    es: { title: 'Scrapbook', shortDescription: 'Organizar fotos y recuerdos creativamente.' },
    en: { title: 'Scrapbooking', shortDescription: 'Organize photos and memories creatively.' },
  },
  boxing: {
    es: { title: 'Boxeo', shortDescription: 'Actividad intensiva para descargar energía.' },
    en: { title: 'Boxing', shortDescription: 'Intense activity to release energy.' },
  },
  pottery: {
    es: { title: 'Cerámica', shortDescription: 'Dar forma a la arcilla con las manos.' },
    en: { title: 'Pottery', shortDescription: 'Mold clay with your hands.' },
  },
  gardening: {
    es: { title: 'Jardinería', shortDescription: 'Cuidar plantas y conectar con la naturaleza.' },
    en: { title: 'Gardening', shortDescription: 'Tend to plants and connect with nature.' },
  },
}

export function getActivityTitle(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return ''

  if (language === 'es' || language === 'en') {
    return activityTranslations[activityId]?.[language]?.title || activity.title
  }

  return activity.title
}

export function getActivityShortDescription(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return ''

  if (language === 'es' || language === 'en') {
    return activityTranslations[activityId]?.[language]?.shortDescription || activity.shortDescription
  }

  return activity.shortDescription
}

export function getActivityByIdWithTranslations(activityId, language = 'ca') {
  const activity = allActivities.find((a) => a.id === activityId)
  if (!activity) return null

  if (language === 'es' || language === 'en') {
    const trans = activityTranslations[activityId]?.[language]
    return {
      ...activity,
      title: trans?.title || activity.title,
      shortDescription: trans?.shortDescription || activity.shortDescription,
    }
  }

  return activity
}

export const durationUnitI18n = {
  ca: 'min',
  es: 'min',
  en: 'min',
}
