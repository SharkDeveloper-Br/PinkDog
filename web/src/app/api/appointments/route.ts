import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { appointmentCreateSchema, appointmentUpdateSchema } from '@/lib/schemas'
import { withAuth, badRequest, notFound, serverError } from '@/lib/api-utils'
export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const { searchParams } = new URL(req.url)
      const date = searchParams.get('date')
      const status = searchParams.get('status')
      const petId = searchParams.get('petId')

      const where: Record<string, unknown> = {}
      if (status) where.status = status
      if (petId) where.petId = petId
      if (date) {
        const d = new Date(date)
        if (isNaN(d.getTime())) {
          return badRequest('Data invalida')
        }
        where.date = {
          gte: d,
          lt: new Date(d.getTime() + 86400000),
        }
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          pet: { include: { client: true } },
          service: true,
          vet: { select: { id: true, name: true, email: true } },
          groomer: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      })
      return NextResponse.json(appointments)
    } catch (error) {
      console.error('GET /api/appointments error:', error)
      return serverError()
    }
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const body = await req.json()
      const parsed = appointmentCreateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const data = parsed.data
      const appointment = await prisma.appointment.create({
        data: {
          date: new Date(data.date),
          time: data.time,
          petId: data.petId,
          serviceId: data.serviceId,
          vetId: data.vetId,
          groomerId: data.groomerId,
          tutorNotes: data.tutorNotes,
          priceCharged: data.priceCharged,
        },
        include: {
          pet: { include: { client: true } },
          service: true,
        },
      })
      return NextResponse.json(appointment, { status: 201 })
    } catch (error) {
      console.error('POST /api/appointments error:', error)
      const err = error as { code?: string }
      if (err.code === 'P2003') return badRequest('Referencia invalida (pet, servico ou profissional nao existe)')
      return serverError()
    }
  })
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const body = await req.json()
      const parsed = appointmentUpdateSchema.safeParse(body)
      if (!parsed.success) {
        return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
      }

      const { id, ...data } = parsed.data
      const updateData: Record<string, unknown> = {}
      if (data.status !== undefined) updateData.status = data.status
      if (data.currentStep !== undefined) updateData.currentStep = data.currentStep
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.priceCharged !== undefined) updateData.priceCharged = data.priceCharged
      if (data.isPaid !== undefined) updateData.isPaid = data.isPaid
      if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod

      const updated = await prisma.appointment.update({
        where: { id },
        data: updateData,
      })
      return NextResponse.json(updated)
    } catch (error) {
      console.error('PATCH /api/appointments error:', error)
      const err = error as { code?: string }
      if (err.code === 'P2025') return notFound('Agendamento nao encontrado')
      return serverError()
    }
  })
}
