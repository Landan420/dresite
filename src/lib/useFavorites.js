import { useCallback, useEffect, useState } from 'react'

const KEY = 'dresite_favorites'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(Array.from(favorites))) } catch { /* ignore */ }
  }, [favorites])

  const toggle = useCallback(id => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isFavorite = useCallback(id => favorites.has(id), [favorites])

  return { favorites, toggle, isFavorite }
}
