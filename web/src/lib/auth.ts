import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export type JWTPayload = {
  sub: string
  email: string
  name: string
  role: string
  iat: number
  exp: number
}

export async function signToken(payload: { sub: string; email: string; name: string; role: string }) {
  return new SignJWT({ sub: payload.sub, email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 })
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export function getTokenFromRequest(req: Request): string | null {
  const cookie = req.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function forbidden() {
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}
