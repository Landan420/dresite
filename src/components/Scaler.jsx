import styles from './Scaler.module.css'

export default function Scaler({ recipe, colIndex, onColIndexChange, targetGrams, onTargetGramsChange, baseGrams }) {
  const hasBatches = recipe.batch_cols && recipe.batch_cols.length > 1

  return (
    <div className={styles.scaler}>
      {hasBatches && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="batch-select">Batch size</label>
          <select
            id="batch-select"
            className={styles.select}
            value={colIndex}
            onChange={e => onColIndexChange(Number(e.target.value))}
          >
            {recipe.batch_cols.map((label, i) => (
              <option key={i} value={i}>{label}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="target-weight">
          Scale to target weight (grams)
        </label>
        <div className={styles.weightRow}>
          <input
            id="target-weight"
            type="number"
            min="1"
            step="any"
            className={styles.weightInput}
            value={targetGrams}
            onChange={e => onTargetGramsChange(Number(e.target.value) || 0)}
          />
          {baseGrams && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => onTargetGramsChange(baseGrams)}
            >
              reset to {Math.round(baseGrams).toLocaleString()} g
            </button>
          )}
        </div>
        {baseGrams > 0 && (
          <input
            type="range"
            className={styles.slider}
            min={Math.max(1, Math.round(baseGrams * 0.1))}
            max={Math.round(baseGrams * 3)}
            value={Math.min(targetGrams, Math.round(baseGrams * 3))}
            onChange={e => onTargetGramsChange(Number(e.target.value))}
            aria-label="Scale slider"
          />
        )}
      </div>
    </div>
  )
}
