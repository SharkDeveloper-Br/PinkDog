import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from './auth'

export async function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const payload = await requireAuth(req)
  if (!payload) return { error: 'Unauthorized', status: 401 }
  if (!allowedRoles.includes(payload.role)) {
    return { error: 'Forbidden', status: 403 }
  }
  return payload
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function serverError(message = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 })
}

export async function withAuth<T>(
  req: NextRequest,
  handler: (user: { sub: string; email: string; name: string; role: string }) => Promise<T>
): Promise<T> {
  const user = await requireAuth(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as unknown as T
  }
  return handler(user)
}

export async function withAuthRole<T>(
  req: NextRequest,
  roles: string[],
  handler: (user: { sub: string; email: string; name: string; role: string }) => Promise<T>
): Promise<T> {
  const user = await requireAuth(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as unknown as T
  }
  if (!roles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 }) as unknown as T
  }
  return handler(user)
}
