import { allActivities } from '@/data/activities'

/**
 * @param {{ energy: number, need: string|null, time: number, budget?: number, company?: string, excludedIds?: string[], rejectionReason?: string|null, rejectedActivity?: object|null }} answers
 *   energy  — valor del slider (0–100)
 *   need    — 'desconnectar' | 'creativitat' | 'activar' | null
 *   time    — minuts disponibles (10–120)
 * @returns {Array} — 2 activitats ordenades de millor a pitjor
 */
const soloFriendly = new Set([
  'reading',
  'drawing',
  'yoga',
  'breathing',
  'journaling',
  'crochet',
  'origami',
  'meditation',
  'playlist-curation',
  'creative-writing',
  'knitting',
  'scrapbook',
  'pottery',
  'gardening',
])

const socialFriendly = new Set([
  'dance-break',
  'bike-ride',
  'climbing',
  'boxing',
  'volleyball',
  'cooking-simple',
  'language-practice',
  'walk',
])

function parseMaxPrice(priceText) {
  if (!priceText) return 0
  const values = priceText.match(/\d+/g)?.map((value) => Number(value)) ?? []
  return values.length > 0 ? Math.max(...values) : 0
}

function parseDifficulty(difficultyText) {
  if (!difficultyText) return 0
  return difficultyText.match(/★|â˜…/g)?.length ?? 0
}

function parseDifficultyLevel(difficultyText) {
  if (!difficultyText) return 0
  const text = String(difficultyText)
  const starCount = text.match(/★/g)?.length ?? 0
  if (starCount > 0) return starCount

  const mojibakeStarCount = text.split('â˜…').length - 1
  if (mojibakeStarCount > 0) return mojibakeStarCount

  const doubleMojibakeStarCount = text.split('Ã¢Ëœâ€¦').length - 1
  return doubleMojibakeStarCount > 0 ? doubleMojibakeStarCount : 1
}

function effortScore(activity) {
  return parseDifficultyLevel(activity.difficulty) * 100 + activity.energy
}

function isStrictlyBetterAfterRejection(activity, rejectedActivity, rejectionReason) {
  if (!rejectedActivity || !rejectionReason) return true

  if (rejectionReason === 'time') {
    return activity.duration < rejectedActivity.duration
  }

  if (rejectionReason === 'budget') {
    return parseMaxPrice(activity.price) < parseMaxPrice(rejectedActivity.price)
  }

  if (rejectionReason === 'effort') {
    return effortScore(activity) < effortScore(rejectedActivity)
  }

  return true
}

export function getRecommendations({ energy, need, time, budget = 10, company = 'mix', excludedIds = [], rejectionReason = null, rejectedActivity = null }) {
  const scored = allActivities.map((activity) => {
    if (excludedIds.includes(activity.id)) {
      return { activity, score: Number.NEGATIVE_INFINITY }
    }

    if (!isStrictlyBetterAfterRejection(activity, rejectedActivity, rejectionReason)) {
      return { activity, score: Number.NEGATIVE_INFINITY }
    }

    let score = 0

    // 1. Energia (màx 40 pts) — com més semblant a l'usuari, millor
    const energyDiff = Math.abs(energy - activity.energy)
    score += Math.max(0, 40 - energyDiff * 0.8)

    // 2. Necessitat (màx 40 pts)
    if (need && activity.needs.includes(need)) {
      score += 40
    }

    // 3. Temps disponible (màx 20 pts, penalització si no hi cap)
    if (time >= activity.duration) {
      score += (time - activity.duration) <= 30 ? 20 : 10
    } else {
      score -= 50
    }

    // 4. Pressupost (màx 20 pts)
    const maxPrice = parseMaxPrice(activity.price)
    const budgetGap = Math.max(0, maxPrice - budget)
    score += Math.max(0, 20 - budgetGap * 3)

    // 5. Companyia (màx 10 pts)
    if (company === 'solo' && soloFriendly.has(activity.id)) score += 10
    if (company === 'with' && socialFriendly.has(activity.id)) score += 10
    if (company === 'solo' && socialFriendly.has(activity.id)) score -= 8
    if (company === 'with' && soloFriendly.has(activity.id)) score -= 6

    // 6. Motiu del rebuig: reajust local
    if (rejectionReason === 'time') {
      score += Math.max(0, 10 - activity.duration * 0.25)
    }
    if (rejectionReason === 'budget') {
      score += Math.max(0, 10 - maxPrice)
    }
    if (rejectionReason === 'effort') {
      score += Math.max(0, 10 - activity.energy * 0.12)
    }

    return { activity, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((entry) => Number.isFinite(entry.score) && entry.score > Number.NEGATIVE_INFINITY)
    .slice(0, 2)
    .map((s) => s.activity)
}
