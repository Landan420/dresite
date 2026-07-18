import { json, rowToRecipe } from '../../_lib/http.js'

export async function onRequestGet({ env, params }) {
  const db = env.DB
  if (!db) return json({ error: 'Database not configured' }, { status: 500 })

  const row = await db.prepare('SELECT * FROM recipes WHERE id = ?').bind(params.id).first()
  if (!row) return json({ error: 'Not found' }, { status: 404 })

  return json(rowToRecipe(row), { headers: { 'cache-control': 'public, max-age=60' } })
}
