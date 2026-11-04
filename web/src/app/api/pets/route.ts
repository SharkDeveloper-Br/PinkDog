import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const pets = await prisma.pet.findMany({
    where: clientId ? { clientId } : undefined,
    include: { client: true, appointments: { orderBy: { date: 'desc' }, take: 5 } },
  })
  return NextResponse.json(pets)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const pet = await prisma.pet.create({ data: body })
  return NextResponse.json(pet, { status: 201 })
}
