import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  // TODO: bcrypt.compare
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  // Placeholder — substituir por JWT real
  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
}
