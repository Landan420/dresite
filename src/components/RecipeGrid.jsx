import RecipeCard from './RecipeCard.jsx'
import styles from './RecipeGrid.module.css'

export default function RecipeGrid({ recipes, emptyMessage = 'No recipes found.' }) {
  if (!recipes.length) {
    return <p className={styles.empty}>{emptyMessage}</p>
  }
  return (
    <div className={styles.grid}>
      {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  )
}
