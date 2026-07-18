import { json, rowToRecipe } from '../_lib/http.js'

export async function onRequestGet({ env }) {
  const db = env.DB
  if (!db) return json({ error: 'Database not configured' }, { status: 500 })

  const { results } = await db
    .prepare('SELECT * FROM recipes ORDER BY category, title')
    .all()

  return json((results || []).map(rowToRecipe), {
    headers: { 'cache-control': 'public, max-age=5' },
  })
}
