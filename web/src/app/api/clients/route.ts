import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientCreateSchema } from '@/lib/schemas'
import { withAuth, badRequest, serverError } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { searchParams } = new URL(req.url)
      const q = searchParams.get('q') || ''
      const clients = await prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { pets: { some: { name: { contains: q } } } },
          ],
        },
        include: { pets: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(clients)
    } catch (error) {
      console.error('GET /api/clients error:', error)
      return serverError()
    }
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const body = await req.json()
      const parsed = clientCreateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const { name, phone, email, cpf, address, pet } = parsed.data
      const client = await prisma.client.create({
        data: {
          name,
          phone,
          email,
          cpf,
          address,
          pets: pet
            ? {
                create: {
                  name: pet.name,
                  species: pet.species,
                  breed: pet.breed,
                  weight: pet.weight,
                  birthDate: pet.birthDate ? new Date(pet.birthDate) : null,
                  alert: pet.alert,
                  notes: pet.notes,
                },
              }
            : undefined,
        },
        include: { pets: true },
      })
      return NextResponse.json(client, { status: 201 })
    } catch (error) {
      console.error('POST /api/clients error:', error)
      const err = error as { code?: string }
      if (err.code === 'P2002') return badRequest('CPF ou email ja cadastrado')
      return serverError()
    }
  })
}
