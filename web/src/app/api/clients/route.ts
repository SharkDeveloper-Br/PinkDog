import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const clients = await prisma.client.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
        { pets: { some: { name: { contains: q, mode: 'insensitive' } } } },
      ],
    },
    include: { pets: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, email, cpf, address, pet } = body
  const client = await prisma.client.create({
    data: {
      name, phone, email, cpf, address,
      pets: pet ? { create: { name: pet.name, species: pet.species, breed: pet.breed, weight: pet.weight, birthDate: pet.birthDate ? new Date(pet.birthDate) : null, alert: pet.alert, notes: pet.notes } } : undefined,
    },
    include: { pets: true },
  })
  return NextResponse.json(client, { status: 201 })
}
