import { Link } from 'react-router-dom'
import { useRecipes } from '../lib/useRecipes.jsx'
import { categoryCounts, iconFor, slugify } from '../lib/categories.js'
import SplitReveal from '../components/SplitReveal.jsx'
import CountUp from '../components/CountUp.jsx'
import GlareCard from '../components/GlareCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  const { recipes, error } = useRecipes()

  if (error) return <p className={styles.status}>Couldn&rsquo;t load recipes — {error}</p>
  if (!recipes) return <p className={styles.status}>Loading the formula book…</p>

  const cats = categoryCounts(recipes)
  const totalIngredients = recipes.reduce((sum, r) => sum + r.ingredients.length, 0)

  return (
    <div>
      <section className={styles.hero}>
        <SplitReveal
          tag="h1"
          className={styles.heroTitle}
          text="Every formula from Dre's pastry course, ready for a home kitchen."
        />
        <p className={styles.heroSub}>
          <span className="gold-shine">{recipes.length} professional-scale recipes</span> — scaled by weight,
          organized by category, and searchable down to the ingredient.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <CountUp to={recipes.length} className={styles.statNum} />
            <span className={styles.statLabel}>recipes</span>
          </div>
          <div className={styles.stat}>
            <CountUp to={cats.length} className={styles.statNum} />
            <span className={styles.statLabel}>categories</span>
          </div>
          <div className={styles.stat}>
            <CountUp to={totalIngredients} className={styles.statNum} />
            <span className={styles.statLabel}>ingredient lines</span>
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Browse by category</h2>
        <div className={styles.categoryGrid}>
          {cats.map(({ category, count }) => (
            <GlareCard
              as={Link}
              key={category}
              to={`/category/${slugify(category)}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryIcon}>{iconFor(category)}</span>
              <span className={styles.categoryName}>{category}</span>
              <span className={`mono ${styles.categoryCount}`}>{count}</span>
            </GlareCard>
          ))}
        </div>
      </section>
    </div>
  )
}
