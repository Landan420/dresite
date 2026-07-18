export function json(data, init = {}) {
  const h = new Headers(init.headers)
  h.set('content-type', 'application/json')
  return new Response(JSON.stringify(data), { ...init, headers: h })
}

export function rowToRecipe(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    module: row.module,
    course: row.course,
    course_name: row.course_name,
    lesson: row.lesson,
    yield: row.yield,
    yield_num: row.yield_num,
    batch_cols: JSON.parse(row.batch_cols || '[]'),
    ingredients: JSON.parse(row.ingredients || '[]'),
    total: row.total ? JSON.parse(row.total) : null,
    steps: JSON.parse(row.steps || '[]'),
    notes: JSON.parse(row.notes || '[]'),
    source_pdf: row.source_pdf,
    source_page: row.source_page,
  }
}
