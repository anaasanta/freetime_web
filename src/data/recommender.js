import { allActivities } from '@/data/activities'

/**
 * @param {{ energy: number, need: string|null, time: number }} answers
 *   energy  — valor del slider (0–100)
 *   need    — 'desconnectar' | 'creativitat' | 'activar' | null
 *   time    — minuts disponibles (10–120)
 * @returns {Array} — 2 activitats ordenades de millor a pitjor
 */
export function getRecommendations({ energy, need, time }) {
  const scored = allActivities.map((activity) => {
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

    return { activity, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.activity)
}