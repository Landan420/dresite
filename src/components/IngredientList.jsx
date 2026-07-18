import styles from './IngredientList.module.css'

function groupByComponent(ingredients) {
  const groups = []
  const map = new Map()
  for (const ing of ingredients) {
    const key = ing.component || ''
    if (!map.has(key)) {
      const group = { component: ing.component, items: [] }
      map.set(key, group)
      groups.push(group)
    }
    map.get(key).items.push(ing)
  }
  return groups
}

export default function IngredientList({ ingredients }) {
  const groups = groupByComponent(ingredients)

  return (
    <div className={styles.list}>
      {groups.map((group, gi) => (
        <div key={gi} className={styles.group}>
          {group.component && <h3 className={styles.groupTitle}>{group.component}</h3>}
          <ul className={styles.rows}>
            {group.items.map((ing, i) => (
              <li key={i} className={styles.row}>
                <span className={styles.name}>{ing.name}</span>
                <span className={styles.dots} aria-hidden="true" />
                <span className={`mono ${styles.amount}`}>
                  {ing.scaledAmount === '' || ing.scaledAmount == null
                    ? (ing.scaledUnit || '—')
                    : `${ing.scaledAmount} ${ing.scaledUnit || ''}`.trim()}
                  {ing.bakers_pct != null && (
                    <span className={styles.pct}> · {ing.bakers_pct}%</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
