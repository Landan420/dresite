import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../lib/useRecipes.jsx'
import styles from './RichText.module.css'

// Recipe-mention links, authored directly into note text as [[Label]] or
// [[Display|lookup key]] when the display text shouldn't match the stored
// title verbatim (typos, accents, or a title buried inside a longer
// multi-component title).
const BRACKET_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

// Mixing-method phrases as they actually appear in this dataset's recipe
// steps/notes (e.g. "Utilize the Creaming Mixing Method"), mapped to the
// canonical title of that method's own page. Order doesn't affect matching
// here since every phrase has a distinct literal prefix, but more specific
// phrases are listed first for clarity.
const METHOD_LINKS = [
  ['Modified Creaming Method', /Modified Creaming(?: Mixing)? Method/],
  ['Creaming Dough Mixing Method', /Creaming Dough Mixing Method/],
  ['Genoise Mousseline Mixing Method', /Genoise Mousseline Mixing Method/],
  ['Pain de Gênes Mixing Method', /Pain de Gen[eê]s? Mixing Method/],
  ['High-Ratio (Two-Stage) Mixing Method', /High[- ]Ratio Mixing Method/],
  ['One-Stage Mixing Method', /One[- ]Step Mixing Method/],
  ['Mealy Dough Mixing Method', /Mealy Dough Mixing Method/],
  ['Flaky Dough Mixing Method', /Flaky Dough Mixing Method/],
  ['Biscuit Mixing Method', /Biscuit Mixing Method/],
  ['Chiffon Mixing Method', /Chiffon Mixing Method/],
  ['Genoise Mixing Method', /Genoise Mixing Method/],
  ['Pâte à Bombe Method', /P[aâ]te [aà] Bombe Method/],
  ['Creaming Method', /Creaming (?:Mixing )?Method/],
]

const METHOD_RE = new RegExp(METHOD_LINKS.map(([, re]) => `(${re.source})`).join('|'), 'gi')

const DIACRITICS_RE = new RegExp('[̀-ͯ]', 'g')
const QUOTES_RE = new RegExp('[“”"‘’\']', 'g')

function normalize(str) {
  return str
    .normalize('NFD').replace(DIACRITICS_RE, '')
    .replace(QUOTES_RE, '')
    .toLowerCase()
    .trim()
}

function splitByRegex(text, regex, mapMatch) {
  const parts = []
  let lastIndex = 0
  let m
  regex.lastIndex = 0
  while ((m = regex.exec(text))) {
    if (m.index > lastIndex) parts.push({ type: 'text', value: text.slice(lastIndex, m.index) })
    parts.push(mapMatch(m))
    lastIndex = m.index + m[0].length
    if (m[0].length === 0) regex.lastIndex++
  }
  if (lastIndex < text.length) parts.push({ type: 'text', value: text.slice(lastIndex) })
  return parts
}

function parseRichText(text) {
  const bracketParts = splitByRegex(text, BRACKET_RE, m => ({
    type: 'recipeLink',
    label: m[1],
    lookup: m[2] || m[1],
  }))

  const final = []
  for (const part of bracketParts) {
    if (part.type !== 'text') {
      final.push(part)
      continue
    }
    final.push(...splitByRegex(part.value, METHOD_RE, m => {
      const groupIdx = m.slice(1).findIndex(g => g !== undefined)
      return { type: 'methodLink', label: m[0], title: METHOD_LINKS[groupIdx][0] }
    }))
  }
  return final
}

function buildTitleIndex(recipes) {
  return (recipes || []).map(r => ({ id: r.id, norm: normalize(r.title) }))
}

function resolveByTitle(title, index) {
  const key = normalize(title)
  const exact = index.find(e => e.norm === key)
  if (exact) return exact.id
  const contains = index.find(e => e.norm.includes(key))
  return contains ? contains.id : null
}

export default function RichText({ text }) {
  const { recipes } = useRecipes()

  const titleIndex = useMemo(() => buildTitleIndex(recipes), [recipes])
  const methodIndex = useMemo(
    () => buildTitleIndex((recipes || []).filter(r => r.category === 'Mixing Methods')),
    [recipes]
  )

  const parts = useMemo(() => parseRichText(text), [text])

  if (!recipes) return text

  return parts.map((part, i) => {
    if (part.type === 'text') return part.value
    if (part.type === 'methodLink') {
      const id = resolveByTitle(part.title, methodIndex)
      if (!id) return part.label
      return (
        <Link key={i} to={`/recipe/${id}`} className={styles.link} onClick={e => e.stopPropagation()}>
          {part.label}
        </Link>
      )
    }
    if (part.type === 'recipeLink') {
      const id = resolveByTitle(part.lookup, titleIndex)
      if (!id) return part.label
      return (
        <Link key={i} to={`/recipe/${id}`} className={styles.link} onClick={e => e.stopPropagation()}>
          {part.label}
        </Link>
      )
    }
    return null
  })
}
