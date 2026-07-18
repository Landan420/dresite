import { Link } from 'react-router-dom'
import GlareCard from './GlareCard.jsx'
import { useFavorites } from '../lib/useFavorites.js'
import { useRecipes } from '../lib/useRecipes.jsx'
import styles from './RecipeCard.module.css'

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggle } = useFavorites()
  const { recipes } = useRecipes()
  const fav = isFavorite(recipe.id)

  const hasTwin = recipes && recipes.filter(r => r.title === recipe.title).length > 1
  const ingredientPreview = hasTwin
    ? recipe.ingredients.slice(0, 3).map(i => i.name).join(', ') +
      (recipe.ingredients.length > 3 ? `, +${recipe.ingredients.length - 3} more` : '')
    : null

  return (
    <GlareCard as={Link} to={`/recipe/${recipe.id}`} className={styles.card}>
      <button
        className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
        onClick={e => { e.preventDefault(); toggle(recipe.id) }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={fav}
      >
        {fav ? '★' : '☆'}
      </button>
      <span className={styles.category}>{recipe.category}</span>
      <h3 className={styles.title}>{recipe.title}</h3>
      {ingredientPreview && <p className={styles.preview}>{ingredientPreview}</p>}
      <div className={styles.meta}>
        {recipe.yield_num && <span className="mono">{recipe.yield_num}</span>}
        <span>{recipe.ingredients.length} ingredient{recipe.ingredients.length === 1 ? '' : 's'}</span>
      </div>
    </GlareCard>
  )
}
