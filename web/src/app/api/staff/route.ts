import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { staffUpdateSchema } from '@/lib/schemas'
import { withAuthRole, badRequest, notFound, serverError } from '@/lib/api-utils'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  return withAuthRole(req, ['ADMIN', 'RECEPTION'], async () => {
    try {
      const staff = await prisma.staffMember.findMany({
        include: { user: { select: { id: true, email: true, name: true, role: true, isActive: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(staff)
    } catch (error) {
      console.error('GET /api/staff error:', error)
      return serverError()
    }
  })
}

export async function PATCH(req: NextRequest) {
  return withAuthRole(req, ['ADMIN'], async () => {
    try {
      const body = await req.json()
      const parsed = staffUpdateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const { id, ...data } = parsed.data
      const updated = await prisma.staffMember.update({
        where: { id },
        data,
      })
      return NextResponse.json(updated)
    } catch (error) {
      console.error('PATCH /api/staff error:', error)
      const err = error as { code?: string }
      if (err.code === 'P2025') return notFound('Funcionario nao encontrado')
      return serverError()
    }
  })
}
