import { createContext, useContext, useEffect, useState } from 'react'

const RecipesContext = createContext(null)

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/recipes')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load recipes')
        return r.json()
      })
      .then(data => { if (!cancelled) setRecipes(data) })
      .catch(e => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true }
  }, [])

  return (
    <RecipesContext.Provider value={{ recipes, error }}>
      {children}
    </RecipesContext.Provider>
  )
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider')
  return ctx
}
