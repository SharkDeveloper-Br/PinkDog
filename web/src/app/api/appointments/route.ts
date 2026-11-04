import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const status = searchParams.get('status')
  const petId = searchParams.get('petId')

  const where: any = {}
  if (status) where.status = status
  if (petId) where.petId = petId
  if (date) {
    const d = new Date(date)
    where.date = { gte: d, lt: new Date(d.getTime() + 86400000) }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { pet: { include: { client: true } }, service: true, vet: true, groomer: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
  return NextResponse.json(appointments)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const appointment = await prisma.appointment.create({
    data: {
      date: new Date(body.date),
      time: body.time,
      petId: body.petId,
      serviceId: body.serviceId,
      vetId: body.vetId,
      groomerId: body.groomerId,
      tutorNotes: body.tutorNotes,
      priceCharged: body.priceCharged,
    },
    include: { pet: { include: { client: true } }, service: true },
  })
  return NextResponse.json(appointment, { status: 201 })
}
