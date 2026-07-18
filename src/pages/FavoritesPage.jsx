import { useRecipes } from '../lib/useRecipes.jsx'
import { useFavorites } from '../lib/useFavorites.js'
import RecipeGrid from '../components/RecipeGrid.jsx'
import styles from './ListPage.module.css'

export default function FavoritesPage() {
  const { recipes, error } = useRecipes()
  const { favorites } = useFavorites()

  if (error) return <p className={styles.status}>Couldn&rsquo;t load recipes — {error}</p>
  if (!recipes) return <p className={styles.status}>Loading…</p>

  const filtered = recipes.filter(r => favorites.has(r.id))

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>★ Favorites</h1>
      <p className={styles.count}>{filtered.length} saved recipe{filtered.length === 1 ? '' : 's'}</p>
      <RecipeGrid recipes={filtered} emptyMessage="No favorites yet — tap the star on any recipe to save it here." />
    </div>
  )
}
