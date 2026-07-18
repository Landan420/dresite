import { json, rowToRecipe } from '../../_lib/http.js'
import { requireAuth } from '../../_lib/auth.js'

function normalize(body) {
  return {
    title: String(body.title || '').trim(),
    category: String(body.category || '').trim(),
    module: body.module ? String(body.module) : null,
    course: body.course ? String(body.course) : null,
    course_name: body.course_name ? String(body.course_name) : null,
    lesson: body.lesson === '' || body.lesson == null ? null : Number(body.lesson),
    yield: body.yield ? String(body.yield) : null,
    yield_num: body.yield_num ? String(body.yield_num) : null,
    batch_cols: JSON.stringify(Array.isArray(body.batch_cols) ? body.batch_cols : []),
    ingredients: JSON.stringify(Array.isArray(body.ingredients) ? body.ingredients : []),
    total: body.total ? JSON.stringify(body.total) : null,
    steps: JSON.stringify(Array.isArray(body.steps) ? body.steps : []),
    notes: JSON.stringify(Array.isArray(body.notes) ? body.notes : []),
    source_pdf: body.source_pdf ? String(body.source_pdf) : null,
    source_page: body.source_page === '' || body.source_page == null ? null : Number(body.source_page),
  }
}

export async function onRequestPost({ request, env }) {
  if (!(await requireAuth(request, env))) return json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Bad request' }, { status: 400 })
  }

  const r = normalize(body)
  if (!r.title || !r.category) return json({ error: 'title and category are required' }, { status: 400 })

  const result = await env.DB.prepare(
    `INSERT INTO recipes
      (title, category, module, course, course_name, lesson, yield, yield_num, batch_cols, ingredients, total, steps, notes, source_pdf, source_page, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch())`
  ).bind(
    r.title, r.category, r.module, r.course, r.course_name, r.lesson,
    r.yield, r.yield_num, r.batch_cols, r.ingredients, r.total, r.steps, r.notes,
    r.source_pdf, r.source_page
  ).run()

  const row = await env.DB.prepare('SELECT * FROM recipes WHERE id = ?').bind(result.meta.last_row_id).first()
  return json(rowToRecipe(row), { status: 201 })
}
