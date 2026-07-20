import { useParams, Link } from 'react-router-dom'
import { useRecipes } from '../lib/useRecipes.jsx'
import { iconFor, slugify } from '../lib/categories.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import RecipeGrid from '../components/RecipeGrid.jsx'
import styles from './ListPage.module.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const { recipes, error } = useRecipes()

  const category = recipes ? recipes.find(r => slugify(r.category) === slug)?.category : null
  useDocumentTitle(category || null)

  if (error) return <p className={styles.status}>Couldn&rsquo;t load recipes — {error}</p>
  if (!recipes) return <p className={styles.status}>Loading…</p>

  const filtered = recipes.filter(r => slugify(r.category) === slug)

  if (!category) {
    return (
      <div className={styles.wrap}>
        <p className={styles.status}>No such category. <Link to="/">Back home</Link></p>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <Link to="/" className={styles.back}>← All categories</Link>
      <h1 className={styles.title}>
        <span aria-hidden="true">{iconFor(category)}</span> {category}
      </h1>
      <p className={styles.count}>{filtered.length} recipe{filtered.length === 1 ? '' : 's'}</p>
      <RecipeGrid recipes={filtered} />
    </div>
  )
}
