async function deriveKey(secret, usage) {
  const raw = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, [usage])
}

export async function makeToken(secret, payload) {
  const key = await deriveKey(secret, 'encrypt')
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(payload)))
  const combined = new Uint8Array(12 + ct.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ct), 12)
  let s = ''
  for (let i = 0; i < combined.length; i++) s += String.fromCharCode(combined[i])
  return btoa(s)
}

export async function verifyToken(secret, token) {
  try {
    const bytes = new Uint8Array(atob(token).split('').map(c => c.charCodeAt(0)))
    const iv = bytes.slice(0, 12)
    const ct = bytes.slice(12)
    const key = await deriveKey(secret, 'decrypt')
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
    const payload = JSON.parse(new TextDecoder().decode(pt))
    return Date.now() < payload.expiry ? payload : null
  } catch {
    return null
  }
}

export async function requireAuth(request, env) {
  const secret = env.SESSION_SECRET
  if (!secret) return false
  const auth = (request.headers.get('Authorization') || '').replace('Bearer ', '').trim()
  if (!auth) return false
  return Boolean(await verifyToken(secret, auth))
}
