import { useEffect, useState } from 'react'
import RichText from './RichText.jsx'
import styles from './StepList.module.css'

export default function StepList({ recipeId, steps }) {
  const storageKey = `dresite_steps_${recipeId}`
  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(Array.from(done))) } catch { /* ignore */ }
  }, [done, storageKey])

  function toggle(i) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      {done.size > 0 && (
        <button className={styles.clearBtn} onClick={() => setDone(new Set())}>
          reset progress ({done.size}/{steps.length})
        </button>
      )}
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={i} className={styles.step}>
            <label className={`${styles.stepLabel} ${done.has(i) ? styles.stepDone : ''}`}>
              <input
                type="checkbox"
                checked={done.has(i)}
                onChange={() => toggle(i)}
                className={styles.checkbox}
              />
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepText}><RichText text={step} /></span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  )
}
