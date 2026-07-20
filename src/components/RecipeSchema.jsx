import { useEffect } from 'react'

/** Injects schema.org Recipe JSON-LD for the current page, for search-engine rich results. */
export default function RecipeSchema({ recipe }) {
  useEffect(() => {
    if (!recipe) return

    const ingredientLines = recipe.ingredients.map(ing => {
      const pair = ing.amounts?.[0]
      const amount = pair && pair[0] ? `${pair[0]} ${pair[1] || ''}`.trim() : ''
      return amount ? `${amount} ${ing.name}` : ing.name
    })

    const data = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      recipeCategory: recipe.category,
      recipeIngredient: ingredientLines,
      recipeInstructions: recipe.steps.map(step => ({ '@type': 'HowToStep', text: step })),
      ...(recipe.yield ? { recipeYield: recipe.yield } : {}),
      ...(recipe.notes?.length ? { description: recipe.notes.join(' ') } : {}),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    return () => { document.head.removeChild(script) }
  }, [recipe])

  return null
}
