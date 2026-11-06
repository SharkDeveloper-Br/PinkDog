import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serviceCreateSchema } from '@/lib/schemas'
import { withAuth, badRequest, serverError } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { category: 'asc' },
      })
      return NextResponse.json(services)
    } catch (error) {
      console.error('GET /api/services error:', error)
      return serverError()
    }
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const body = await req.json()
      const parsed = serviceCreateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const service = await prisma.service.create({ data: parsed.data })
      return NextResponse.json(service, { status: 201 })
    } catch (error) {
      console.error('POST /api/services error:', error)
      return serverError()
    }
  })
}
