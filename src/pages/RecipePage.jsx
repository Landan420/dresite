import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useRecipes } from '../lib/useRecipes.jsx'
import { useFavorites } from '../lib/useFavorites.js'
import { baseYieldGrams, scaleIngredients } from '../lib/scale.js'
import { iconFor, slugify } from '../lib/categories.js'
import Scaler from '../components/Scaler.jsx'
import IngredientList from '../components/IngredientList.jsx'
import StepList from '../components/StepList.jsx'
import styles from './RecipePage.module.css'
import listStyles from './ListPage.module.css'

const PRO_SCALE_THRESHOLD_G = 2500

export default function RecipePage() {
  const { id } = useParams()
  const { recipes, error } = useRecipes()
  const { isFavorite, toggle } = useFavorites()

  const recipe = useMemo(
    () => recipes?.find(r => String(r.id) === id) || null,
    [recipes, id]
  )

  const siblings = useMemo(
    () => (recipe && recipes ? recipes.filter(r => r.title === recipe.title && r.id !== recipe.id) : []),
    [recipes, recipe]
  )

  const [colIndex, setColIndex] = useState(0)
  const [targetGrams, setTargetGrams] = useState(0)

  const baseGrams = recipe ? baseYieldGrams(recipe, colIndex) : null

  useEffect(() => {
    if (baseGrams) setTargetGrams(Math.round(baseGrams))
  }, [recipe?.id, colIndex, baseGrams])

  if (error) return <p className={listStyles.status}>Couldn&rsquo;t load recipes — {error}</p>
  if (!recipes) return <p className={listStyles.status}>Loading…</p>

  if (!recipe) {
    return (
      <div className={listStyles.wrap}>
        <p className={listStyles.status}>Recipe not found. <Link to="/">Back home</Link></p>
      </div>
    )
  }

  const scaled = scaleIngredients(recipe, colIndex, targetGrams || baseGrams || 0)
  const fav = isFavorite(recipe.id)
  const isProScale = baseGrams && baseGrams >= PRO_SCALE_THRESHOLD_G

  return (
    <div className={styles.wrap}>
      <Link to={`/category/${slugify(recipe.category)}`} className={`${styles.back} no-print`}>
        ← {recipe.category}
      </Link>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <button
          className={`${styles.favBtn} no-print`}
          onClick={() => toggle(recipe.id)}
          aria-pressed={fav}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {fav ? '★' : '☆'}
        </button>
      </div>

      <div className={styles.metaRow}>
        <span>{iconFor(recipe.category)} {recipe.category}</span>
        {recipe.module && <span>{recipe.module}{recipe.course ? ` · ${recipe.course}` : ''}</span>}
        {recipe.lesson != null && <span>Lesson {recipe.lesson}</span>}
      </div>

      {recipe.yield && <p className={`mono ${styles.yieldLine}`}>{recipe.yield}</p>}

      {siblings.length > 0 && (
        <div className={`${styles.siblingsNote} no-print`}>
          <strong>{siblings.length + 1} recipes on this site are named &ldquo;{recipe.title}.&rdquo;</strong>{' '}
          This one is from {recipe.module || 'the course'}{recipe.course ? `, ${recipe.course}` : ''}
          {recipe.yield_num ? <> and makes <span className="mono">{recipe.yield_num}</span></> : null}.
          {' '}Other versions:{' '}
          {siblings.map((s, i) => (
            <span key={s.id}>
              <Link to={`/recipe/${s.id}`}>
                {s.yield_num || (s.module ? `${s.module}${s.course ? `, ${s.course}` : ''}` : `recipe #${s.id}`)}
              </Link>
              {i < siblings.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}

      {isProScale && (
        <div className={styles.warning}>
          ⚠ Professional-scale formula — this batch is {Math.round(baseGrams).toLocaleString()} g as written.
          Use the scaler below to bring it down to a home-kitchen size.
        </div>
      )}

      <Scaler
        recipe={recipe}
        colIndex={colIndex}
        onColIndexChange={setColIndex}
        targetGrams={targetGrams || baseGrams || 0}
        onTargetGramsChange={setTargetGrams}
        baseGrams={baseGrams}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <IngredientList ingredients={scaled} />
        {recipe.total && (
          <p className={styles.totalLine}>
            Formula total (as written): <span className="mono">{recipe.total[0]} {recipe.total[1]}</span>
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Method</h2>
        <StepList recipeId={recipe.id} steps={recipe.steps} />
      </section>

      {recipe.notes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notes &amp; technique</h2>
          <ul className={styles.notes}>
            {recipe.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </section>
      )}

      <div className={`${styles.footerRow} no-print`}>
        <button className={styles.printBtn} onClick={() => window.print()}>Print recipe</button>
        {recipe.source_pdf && (
          <span className={styles.source}>
            Source: {recipe.source_pdf}{recipe.source_page ? `, p. ${recipe.source_page}` : ''}
          </span>
        )}
      </div>
    </div>
  )
}
