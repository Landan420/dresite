import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} — Dre's Pastry Book` : "Dre's Pastry Book"
    return () => { document.title = previous }
  }, [title])
}
