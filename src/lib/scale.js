export function parseAmount(str) {
  if (str === '' || str == null) return null
  const n = parseFloat(String(str).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

export function baseYieldGrams(recipe, colIndex = 0) {
  if (recipe.yield_num) {
    const n = parseAmount(recipe.yield_num)
    if (n) return n
  }
  let sum = 0
  let found = false
  for (const ing of recipe.ingredients) {
    const pair = ing.amounts?.[colIndex] || ing.amounts?.[0]
    const n = pair ? parseAmount(pair[0]) : null
    if (n) {
      sum += n
      found = true
    }
  }
  return found ? sum : null
}

function roundAmount(n) {
  if (n >= 100) return Math.round(n)
  if (n >= 10) return Math.round(n * 10) / 10
  return Math.round(n * 100) / 100
}

export function scaleIngredients(recipe, colIndex, targetGrams) {
  const base = baseYieldGrams(recipe, colIndex)
  const factor = base && targetGrams ? targetGrams / base : 1

  return recipe.ingredients.map(ing => {
    const pair = ing.amounts?.[colIndex] || ing.amounts?.[0]
    if (!pair) return { ...ing, scaledAmount: null, scaledUnit: null }
    const [amtStr, unit] = pair
    const n = parseAmount(amtStr)
    if (n == null) return { ...ing, scaledAmount: amtStr || null, scaledUnit: unit }
    return { ...ing, scaledAmount: roundAmount(n * factor), scaledUnit: unit }
  })
}

export function formatAmount(amount) {
  if (amount == null || amount === '') return ''
  if (typeof amount === 'number') {
    return amount % 1 === 0 ? String(amount) : String(amount)
  }
  return String(amount)
}

export const GRAMS_PER = {
  gram: 1,
  ounce: 28.3495,
  pound: 453.592,
  kilogram: 1000,
}

export function gramsToUS(grams) {
  if (grams == null) return null
  if (grams < 28.35) return `${roundAmount(grams / 1)} g`
  const oz = grams / 28.3495
  if (oz < 16) return `${roundAmount(oz)} oz`
  return `${roundAmount(oz / 16)} lb`
}
