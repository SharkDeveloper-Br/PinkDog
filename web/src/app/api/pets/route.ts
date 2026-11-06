import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { petCreateSchema } from '@/lib/schemas'
import { withAuth, badRequest, serverError } from '@/lib/api-utils'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { searchParams } = new URL(req.url)
      const clientId = searchParams.get('clientId')
      const pets = await prisma.pet.findMany({
        where: clientId ? { clientId } : undefined,
        include: { client: true, appointments: { orderBy: { date: 'desc' }, take: 5 } },
      })
      return NextResponse.json(pets)
    } catch (error) {
      console.error('GET /api/pets error:', error)
      return serverError()
    }
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const body = await req.json()
      const parsed = petCreateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const data = parsed.data
      const pet = await prisma.pet.create({
        data: {
          name: data.name,
          species: data.species,
          breed: data.breed,
          weight: data.weight,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          alert: data.alert,
          notes: data.notes,
          clientId: data.clientId,
        },
      })
      return NextResponse.json(pet, { status: 201 })
    } catch (error) {
      console.error('POST /api/pets error:', error)
      const err = error as { code?: string }
      if (err.code === 'P2003') return badRequest('Cliente nao encontrado')
      return serverError()
    }
  })
}
