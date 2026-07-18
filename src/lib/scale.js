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

function isGramUnit(unit) {
  return unit === 'grams' || unit === 'gram'
}

// Total flour weight is the 100% base for baker's percentage. Sums every
// flour-type ingredient (a recipe may use more than one, e.g. bread + whole wheat).
function totalFlourGrams(ingredients, colIndex) {
  let total = 0
  let found = false
  for (const ing of ingredients) {
    if (!/flour/i.test(ing.name)) continue
    const pair = ing.amounts?.[colIndex] || ing.amounts?.[0]
    if (!pair || !isGramUnit(pair[1])) continue
    const n = parseAmount(pair[0])
    if (n != null) {
      total += n
      found = true
    }
  }
  return found ? total : null
}

export function scaleIngredients(recipe, colIndex, targetGrams) {
  const base = baseYieldGrams(recipe, colIndex)
  const factor = base && targetGrams ? targetGrams / base : 1
  const flourTotal = totalFlourGrams(recipe.ingredients, colIndex)

  return recipe.ingredients.map(ing => {
    const pair = ing.amounts?.[colIndex] || ing.amounts?.[0]

    let bakersPct = ing.bakers_pct
    if (bakersPct == null && flourTotal && pair && isGramUnit(pair[1])) {
      const n = parseAmount(pair[0])
      if (n != null) bakersPct = Math.round((n / flourTotal) * 1000) / 10
    }

    if (!pair) return { ...ing, bakers_pct: bakersPct, scaledAmount: null, scaledUnit: null }
    const [amtStr, unit] = pair
    const n = parseAmount(amtStr)
    if (n == null) return { ...ing, bakers_pct: bakersPct, scaledAmount: amtStr || null, scaledUnit: unit }
    return { ...ing, bakers_pct: bakersPct, scaledAmount: roundAmount(n * factor), scaledUnit: unit }
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
