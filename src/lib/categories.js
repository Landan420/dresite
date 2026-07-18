export const CATEGORY_ICONS = {
  'Custards & Creams': '🍮',
  'Frozen Desserts': '🍨',
  'Chocolate & Bonbons': '🍫',
  'Cakes & Sponges': '🎂',
  'Fillings, Sauces & Garnishes': '🥣',
  'Breads & Yeast Doughs': '🍞',
  'Pies & Tarts': '🥧',
  'Laminated & Phyllo Doughs': '🥐',
  'Plated Dessert Components': '🍽️',
  'Meringues & Soufflés': '☁️',
  'Mousses & Entremets': '🍰',
  'Doughs & Crusts': '🥮',
  'Confections & Sugar Work': '🍬',
  'Cookies & Bars': '🍪',
  'Quick Breads & Scones': '🧁',
  'Buttercreams & Icings': '🎨',
  'Cake Decorating': '✨',
  'Cheesecakes': '🍰',
  'Flavorings': '🍋',
  'Mixing Methods': '🌀',
}

export function iconFor(category) {
  return CATEGORY_ICONS[category] || '📋'
}

export function categoryCounts(recipes) {
  const map = new Map()
  for (const r of recipes) {
    map.set(r.category, (map.get(r.category) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
