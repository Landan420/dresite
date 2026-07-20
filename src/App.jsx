import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { RecipesProvider, useRecipes } from './lib/useRecipes.jsx'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import RecipePage from './pages/RecipePage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import NotFound from './pages/NotFound.jsx'
import styles from './App.module.css'

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('dresite_theme') || 'auto')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    localStorage.setItem('dresite_theme', theme)
  }, [theme])

  return [theme, setTheme]
}

function Header() {
  const [theme, setTheme] = useTheme()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { recipes } = useRecipes()

  function goToRandom() {
    if (!recipes || !recipes.length) return
    const pick = recipes[Math.floor(Math.random() * recipes.length)]
    navigate(`/recipe/${pick.id}`)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setQ(location.pathname === '/search' ? params.get('q') || '' : '')
  }, [location])

  function submitSearch(e) {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  function cycleTheme() {
    setTheme(theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto')
  }

  return (
    <header className={`${styles.header} no-print`}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>✦</span>
          <span>Dre&rsquo;s Pastry Book</span>
        </Link>

        <form className={styles.searchForm} onSubmit={submitSearch} role="search">
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search recipes, ingredients, techniques…"
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Search recipes"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Search">⌕</button>
        </form>

        <nav className={styles.nav}>
          <button type="button" className={styles.navLink} onClick={goToRandom}>Surprise me</button>
          <Link to="/favorites" className={styles.navLink}>Favorites</Link>
          <button
            className={styles.themeBtn}
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐'}
          </button>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const { recipes } = useRecipes()
  const count = recipes?.filter(r => r.category !== 'Mixing Methods').length

  return (
    <footer className={`${styles.footer} no-print`}>
      <p>
        Dre&rsquo;s Pastry Book — {count ? `${count} formulas` : 'formulas'} from the pastry &amp; baking course.
        Scaled to fit your kitchen.
      </p>
      <a href="/admin" className={styles.adminLink}>Admin</a>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <RecipesProvider>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </RecipesProvider>
    </BrowserRouter>
  )
}
