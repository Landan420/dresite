import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecipes } from '../lib/useRecipes.jsx'
import { categoryCounts } from '../lib/categories.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import RecipeGrid from '../components/RecipeGrid.jsx'
import styles from './ListPage.module.css'

function matches(recipe, needle) {
  if (recipe.title.toLowerCase().includes(needle)) return true
  if (recipe.ingredients.some(i => i.name?.toLowerCase().includes(needle))) return true
  if (recipe.steps.some(s => s.toLowerCase().includes(needle))) return true
  if (recipe.notes.some(n => n.toLowerCase().includes(needle))) return true
  return false
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const { recipes, error } = useRecipes()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  useDocumentTitle(q ? `“${q}”` : 'Search')

  const results = useMemo(() => {
    if (!recipes) return []
    const needle = q.trim().toLowerCase()
    return recipes.filter(r => {
      if (category && r.category !== category) return false
      if (needle && !matches(r, needle)) return false
      return true
    })
  }, [recipes, q, category])

  if (error) return <p className={styles.status}>Couldn&rsquo;t load recipes — {error}</p>
  if (!recipes) return <p className={styles.status}>Loading…</p>

  const cats = categoryCounts(recipes)

  function onCategoryChange(e) {
    const next = new URLSearchParams(params)
    if (e.target.value) next.set('category', e.target.value)
    else next.delete('category')
    setParams(next, { replace: true })
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{q ? `“${q}”` : 'All recipes'}</h1>
      <p className={styles.searchMeta}>{results.length} match{results.length === 1 ? '' : 'es'}</p>

      <div className={styles.filters}>
        <select className={styles.filterSelect} value={category} onChange={onCategoryChange} aria-label="Filter by category">
          <option value="">All categories</option>
          {cats.map(c => <option key={c.category} value={c.category}>{c.category} ({c.count})</option>)}
        </select>
      </div>

      <RecipeGrid recipes={results} emptyMessage="No recipes match your search or filters." />
    </div>
  )
}
