import { useEffect, useMemo, useState } from 'react'
import styles from './AdminApp.module.css'

const TOKEN_KEY = 'dresite_admin_token'

const UNIT_OPTIONS = [
  'grams', 'ounces', 'pounds', 'kilograms', 'cups', 'tablespoons', 'teaspoons',
  'each', 'sheets', 'milliliters', 'liters', 'pinch',
]

function blankIngredient() {
  return { name: '', amount: '', unit: '', asNeeded: false, section: '', bakersPct: null, extraAmounts: [] }
}

function recipeToFormState(recipe) {
  const ingredients = recipe.ingredients && recipe.ingredients.length
    ? recipe.ingredients.map(ing => {
        const first = ing.amounts?.[0] || ['', '']
        const isAsNeeded = first[1] === 'as needed'
        return {
          name: ing.name || '',
          amount: isAsNeeded ? '' : (first[0] ?? ''),
          unit: isAsNeeded ? '' : (first[1] ?? ''),
          asNeeded: isAsNeeded,
          section: ing.component || '',
          bakersPct: ing.bakers_pct ?? null,
          extraAmounts: (ing.amounts || []).slice(1),
        }
      })
    : [blankIngredient()]

  const steps = recipe.steps && recipe.steps.length ? [...recipe.steps] : ['']

  return {
    title: recipe.title || '',
    category: recipe.category || '',
    yieldText: recipe.yield || '',
    yieldGrams: recipe.yield_num ? String(parseFloat(String(recipe.yield_num).replace(/,/g, '')) || '') : '',
    ingredients,
    steps,
    notes: (recipe.notes || []).join('\n'),
    _module: recipe.module ?? null,
    _course: recipe.course ?? null,
    _course_name: recipe.course_name ?? null,
    _lesson: recipe.lesson ?? null,
    _batch_cols: recipe.batch_cols ?? [],
    _total: recipe.total ?? null,
    _source_pdf: recipe.source_pdf ?? null,
    _source_page: recipe.source_page ?? null,
  }
}

function buildPayload(form) {
  const ingredients = form.ingredients
    .filter(ing => ing.name.trim() !== '' || ing.amount !== '')
    .map(ing => ({
      name: ing.name.trim(),
      amounts: [
        ing.asNeeded ? ['', 'as needed'] : [String(ing.amount).trim(), ing.unit.trim()],
        ...ing.extraAmounts,
      ],
      bakers_pct: ing.bakersPct,
      component: ing.section.trim() || null,
    }))

  const steps = form.steps.map(s => s.trim()).filter(Boolean)
  const notes = form.notes.split('\n').map(s => s.trim()).filter(Boolean)
  const gramsNum = form.yieldGrams.trim() ? Number(form.yieldGrams) : null

  return {
    title: form.title.trim(),
    category: form.category.trim(),
    module: form._module,
    course: form._course,
    course_name: form._course_name,
    lesson: form._lesson,
    yield: form.yieldText.trim() || null,
    yield_num: gramsNum ? `${gramsNum.toLocaleString()} grams` : null,
    batch_cols: form._batch_cols,
    ingredients,
    total: form._total,
    steps,
    notes,
    source_pdf: form._source_pdf,
    source_page: form._source_page,
  }
}

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)

  const [recipes, setRecipes] = useState(null)
  const [listError, setListError] = useState('')
  const [query, setQuery] = useState('')

  const [editing, setEditing] = useState(null) // null = list view, 'new' or recipe object
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  function flash(text, isErr = false) {
    if (isErr) setErr(text); else setMsg(text)
    setTimeout(() => { setMsg(''); setErr('') }, 3000)
  }

  function loadRecipes() {
    fetch('/api/recipes', { cache: 'no-store' })
      .then(r => r.json())
      .then(setRecipes)
      .catch(() => setListError('Could not load recipes'))
  }

  useEffect(() => { if (token) loadRecipes() }, [token])

  async function doLogin(e) {
    e.preventDefault()
    setLoginErr(''); setLoginBusy(true)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      })
      const d = await r.json()
      if (!r.ok) { setLoginErr(d.error || 'Wrong password'); setLoginBusy(false); return }
      localStorage.setItem(TOKEN_KEY, d.token)
      setToken(d.token)
    } catch {
      setLoginErr('Something went wrong')
    }
    setLoginBusy(false)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setRecipes(null)
    setEditing(null)
  }

  function openNew() {
    setEditing('new')
    setForm(recipeToFormState({}))
  }

  function openEdit(recipe) {
    setEditing(recipe)
    setForm(recipeToFormState(recipe))
  }

  function closeEditor() {
    setEditing(null)
    setForm(null)
  }

  async function saveRecipe() {
    if (!form.title.trim() || !form.category.trim()) {
      flash('Please enter a recipe name and category', true)
      return
    }
    const payload = buildPayload(form)

    setSaving(true)
    const isNew = editing === 'new'
    const url = isNew ? '/api/admin/recipes' : `/api/admin/recipes/${editing.id}`
    try {
      const r = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (r.status === 401) { logout(); return }
      const d = await r.json()
      if (!r.ok) { flash(d.error || 'Could not save', true); setSaving(false); return }
      flash(isNew ? 'Recipe added!' : 'Changes saved!')
      closeEditor()
      loadRecipes()
    } catch {
      flash('Something went wrong', true)
    }
    setSaving(false)
  }

  async function deleteRecipe(recipe) {
    if (!confirm(`Delete "${recipe.title}"? This can't be undone.`)) return
    try {
      const r = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (r.status === 401) { logout(); return }
      if (!r.ok) { flash('Could not delete', true); return }
      flash('Recipe deleted')
      loadRecipes()
      if (editing && editing !== 'new' && editing.id === recipe.id) closeEditor()
    } catch {
      flash('Something went wrong', true)
    }
  }

  const categories = useMemo(() => {
    if (!recipes) return []
    return Array.from(new Set(recipes.map(r => r.category))).sort()
  }, [recipes])

  const filtered = useMemo(() => {
    if (!recipes) return []
    const needle = query.trim().toLowerCase()
    if (!needle) return recipes
    return recipes.filter(r => r.title.toLowerCase().includes(needle) || r.category.toLowerCase().includes(needle))
  }, [recipes, query])

  // ── Login screen ──
  if (!token) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <span className={styles.loginMark}>✦</span> Dre&rsquo;s Pastry Book
          </div>
          <p className={styles.loginSub}>Recipe Editor</p>
          <form onSubmit={doLogin} className={styles.loginForm}>
            <input
              className={styles.bigInput}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
            {loginErr && <div className={styles.errMsg}>{loginErr}</div>}
            <button className={styles.saveBtn} type="submit" disabled={loginBusy}>
              {loginBusy ? 'Checking…' : 'Log In'}
            </button>
          </form>
          <a href="/" className={styles.backLink}>← Back to site</a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminPage}>
      <header className={styles.topBar}>
        <a href="/" className={styles.topBarBack} aria-label="Back to site">←</a>
        <span className={styles.topBarTitle}>✦ Recipe Editor</span>
        <button className={styles.logoutBtn} onClick={logout}>Log Out</button>
      </header>

      <main className={styles.content}>
        {editing ? (
          <RecipeEditor
            isNew={editing === 'new'}
            form={form}
            setForm={setForm}
            categories={categories}
            onCancel={closeEditor}
            onSave={saveRecipe}
            onDelete={editing !== 'new' ? () => deleteRecipe(editing) : null}
            saving={saving}
          />
        ) : (
          <div>
            <div className={styles.searchWrap}>
              <input
                className={styles.bigSearchInput}
                placeholder="Search recipes…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
                inputMode="search"
              />
              {query && (
                <button className={styles.clearSearchBtn} onClick={() => setQuery('')} aria-label="Clear search">✕</button>
              )}
            </div>

            <button className={styles.addBtn} onClick={openNew}>+ Add New Recipe</button>

            {listError && <div className={styles.errMsg}>{listError}</div>}
            {!recipes && !listError && <p className={styles.muted}>Loading recipes…</p>}

            {recipes && (
              <>
                <p className={styles.muted}>{filtered.length} of {recipes.length} recipes</p>
                <div className={styles.recipeList}>
                  {filtered.map(r => (
                    <div key={r.id} className={styles.recipeListCard}>
                      <button className={styles.recipeCardMain} onClick={() => openEdit(r)}>
                        <span className={styles.recipeCardTitle}>{r.title}</span>
                        <span className={styles.recipeCardCategory}>{r.category}</span>
                      </button>
                      <div className={styles.recipeCardActions}>
                        <button className={styles.editBtn} onClick={() => openEdit(r)}>✏️ Edit</button>
                        <button className={styles.deleteSmallBtn} onClick={() => deleteRecipe(r)}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {msg && <div className={styles.toastOk}>{msg}</div>}
        {err && <div className={styles.toastErr}>{err}</div>}
      </main>
    </div>
  )
}

function RecipeEditor({ isNew, form, setForm, categories, onCancel, onSave, onDelete, saving }) {
  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function updateIngredient(i, patch) {
    setForm(f => ({ ...f, ingredients: f.ingredients.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)) }))
  }
  function addIngredient() {
    setForm(f => ({ ...f, ingredients: [...f.ingredients, blankIngredient()] }))
  }
  function removeIngredient(i) {
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))
  }
  function moveIngredient(i, dir) {
    setForm(f => {
      const list = [...f.ingredients]
      const j = i + dir
      if (j < 0 || j >= list.length) return f
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...f, ingredients: list }
    })
  }

  function updateStep(i, value) {
    setForm(f => ({ ...f, steps: f.steps.map((s, idx) => (idx === i ? value : s)) }))
  }
  function addStep() {
    setForm(f => ({ ...f, steps: [...f.steps, ''] }))
  }
  function removeStep(i) {
    setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }))
  }
  function moveStep(i, dir) {
    setForm(f => {
      const list = [...f.steps]
      const j = i + dir
      if (j < 0 || j >= list.length) return f
      ;[list[i], list[j]] = [list[j], list[i]]
      return { ...f, steps: list }
    })
  }

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <button className={styles.cancelLink} onClick={onCancel}>← Cancel</button>
        <h2 className={styles.editorTitle}>{isNew ? 'New Recipe' : 'Edit Recipe'}</h2>
      </div>

      <div className={styles.simpleForm}>
        <BigField label="Recipe Name">
          <input
            className={styles.bigInput}
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="e.g. Chocolate Chip Cookies"
          />
        </BigField>

        <BigField label="Category">
          <input
            className={styles.bigInput}
            list="category-options"
            value={form.category}
            onChange={e => update('category', e.target.value)}
            placeholder="e.g. Cookies & Bars"
          />
          <datalist id="category-options">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
        </BigField>

        <BigField label="What does it make? (optional)">
          <input
            className={styles.bigInput}
            value={form.yieldText}
            onChange={e => update('yieldText', e.target.value)}
            placeholder="e.g. 2 dozen cookies"
          />
        </BigField>

        <BigField label="Total weight in grams (optional — used to scale the recipe)">
          <input
            className={styles.bigInput}
            type="number"
            inputMode="decimal"
            value={form.yieldGrams}
            onChange={e => update('yieldGrams', e.target.value)}
            placeholder="e.g. 900"
          />
        </BigField>

        <section className={styles.bigSection}>
          <h3 className={styles.bigSectionTitle}>Ingredients</h3>

          {form.ingredients.map((ing, i) => (
            <div key={i} className={styles.ingredientCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardNumBadge}>{i + 1}</span>
                <div className={styles.rowButtons}>
                  <button type="button" className={styles.moveBtn} onClick={() => moveIngredient(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" className={styles.moveBtn} onClick={() => moveIngredient(i, 1)} disabled={i === form.ingredients.length - 1} aria-label="Move down">↓</button>
                </div>
              </div>

              <div className={styles.ingredientAmountRow}>
                <input
                  className={styles.amountInput}
                  type="text"
                  inputMode="decimal"
                  placeholder="Amount"
                  value={ing.amount}
                  disabled={ing.asNeeded}
                  onChange={e => updateIngredient(i, { amount: e.target.value })}
                />
                <input
                  className={styles.unitInput}
                  list="unit-options"
                  placeholder="Unit"
                  value={ing.unit}
                  disabled={ing.asNeeded}
                  onChange={e => updateIngredient(i, { unit: e.target.value })}
                />
              </div>

              <input
                className={styles.bigInput}
                placeholder="Ingredient name"
                value={ing.name}
                onChange={e => updateIngredient(i, { name: e.target.value })}
              />

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={ing.asNeeded}
                  onChange={e => updateIngredient(i, { asNeeded: e.target.checked })}
                />
                Just &ldquo;as needed&rdquo; — no exact amount
              </label>

              <input
                className={styles.sectionInput}
                placeholder="Part of recipe (optional — e.g. Filling, Frosting)"
                value={ing.section}
                onChange={e => updateIngredient(i, { section: e.target.value })}
              />

              {ing.bakersPct != null && (
                <span className={styles.pctBadge}>Baker&rsquo;s %: {ing.bakersPct}% (kept as-is)</span>
              )}

              <button type="button" className={styles.removeBtn} onClick={() => removeIngredient(i)}>🗑 Remove Ingredient</button>
            </div>
          ))}

          <datalist id="unit-options">
            {UNIT_OPTIONS.map(u => <option key={u} value={u} />)}
          </datalist>

          <button type="button" className={styles.addBtn} onClick={addIngredient}>+ Add Ingredient</button>
        </section>

        <section className={styles.bigSection}>
          <h3 className={styles.bigSectionTitle}>Steps</h3>

          {form.steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardNumBadge}>{i + 1}</span>
                <div className={styles.rowButtons}>
                  <button type="button" className={styles.moveBtn} onClick={() => moveStep(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" className={styles.moveBtn} onClick={() => moveStep(i, 1)} disabled={i === form.steps.length - 1} aria-label="Move down">↓</button>
                </div>
              </div>
              <textarea
                className={styles.stepTextarea}
                rows={3}
                value={step}
                onChange={e => updateStep(i, e.target.value)}
                placeholder={`What do they do in step ${i + 1}?`}
              />
              <button type="button" className={styles.removeBtn} onClick={() => removeStep(i)}>🗑 Remove Step</button>
            </div>
          ))}

          <button type="button" className={styles.addBtn} onClick={addStep}>+ Add Step</button>
        </section>

        <BigField label="Notes or Tips (optional — one per line)">
          <textarea
            className={styles.bigTextarea}
            rows={4}
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            placeholder="Any extra tips, warnings, or notes..."
          />
        </BigField>

        {onDelete && (
          <button className={styles.deleteBtn} onClick={onDelete}>🗑 Delete This Recipe</button>
        )}
      </div>

      <div className={styles.editorFooter}>
        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Recipe'}
        </button>
      </div>
    </div>
  )
}

function BigField({ label, children }) {
  return (
    <div className={styles.bigField}>
      <label className={styles.bigLabel}>{label}</label>
      {children}
    </div>
  )
}
