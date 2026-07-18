import { json } from '../../_lib/http.js'
import { makeToken } from '../../_lib/auth.js'

export async function onRequestPost({ request, env }) {
  const secret = env.SESSION_SECRET
  const adminPassword = env.ADMIN_PASSWORD
  if (!secret || !adminPassword) return json({ error: 'Server misconfigured' }, { status: 500 })

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Bad request' }, { status: 400 })
  }

  const { password } = body
  if (!password || password !== adminPassword) {
    return json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await makeToken(secret, { role: 'admin', expiry: Date.now() + 24 * 60 * 60 * 1000 })
  return json({ token })
}
