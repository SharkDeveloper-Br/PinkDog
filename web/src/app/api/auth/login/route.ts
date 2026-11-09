import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken, comparePassword } from '@/lib/auth'
import { loginSchema } from '@/lib/schemas'
import { badRequest, serverError } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
    }

    const { email, password } = parsed.data

    // 1. Tenta funcionario (User)
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      const valid = comparePassword(password, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const token = await signToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
      const res = NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
        path: '/',
      })
      return res
    }

    // 2. Tenta cliente (Client) por email ou telefone
    const client = await prisma.client.findFirst({
      where: { OR: [{ email }, { phone: email }] },
    })
    if (client && client.password) {
      const valid = comparePassword(password, client.password)
      if (!valid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const token = await signToken({
        sub: client.id,
        email: client.email || client.phone,
        name: client.name,
        role: 'CLIENT',
      })
      const res = NextResponse.json({
        id: client.id,
        email: client.email,
        phone: client.phone,
        name: client.name,
        role: 'CLIENT',
      })
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
        path: '/',
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return serverError()
  }
}
