import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const recipes = JSON.parse(readFileSync(join(root, 'data', 'pastry_recipes.json'), 'utf-8'))

function sqlStr(value) {
  if (value === null || value === undefined) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlNum(value) {
  if (value === null || value === undefined || value === '') return 'NULL'
  const n = Number(value)
  return Number.isFinite(n) ? String(n) : 'NULL'
}

const lines = ['DELETE FROM recipes;']

for (const r of recipes) {
  const cols = [
    'title', 'category', 'module', 'course', 'course_name', 'lesson',
    'yield', 'yield_num', 'batch_cols', 'ingredients', 'total', 'steps', 'notes',
    'source_pdf', 'source_page',
  ]
  const vals = [
    sqlStr(r.title),
    sqlStr(r.category),
    sqlStr(r.module),
    sqlStr(r.course),
    sqlStr(r.course_name),
    sqlNum(r.lesson),
    sqlStr(r.yield),
    sqlStr(r.yield_num),
    sqlStr(JSON.stringify(r.batch_cols ?? [])),
    sqlStr(JSON.stringify(r.ingredients ?? [])),
    r.total ? sqlStr(JSON.stringify(r.total)) : 'NULL',
    sqlStr(JSON.stringify(r.steps ?? [])),
    sqlStr(JSON.stringify(r.notes ?? [])),
    sqlStr(r.source_pdf),
    sqlNum(r.source_page),
  ]
  lines.push(`INSERT INTO recipes (${cols.join(', ')}) VALUES (${vals.join(', ')});`)
}

writeFileSync(join(root, 'data', 'seed.sql'), lines.join('\n') + '\n')
console.log(`Wrote ${recipes.length} recipes to data/seed.sql`)
