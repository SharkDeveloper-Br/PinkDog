import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken, hashPassword } from '@/lib/auth'
import { clientRegisterSchema } from '@/lib/schemas'
import { badRequest, serverError } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = clientRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((i: { message: string }) => i.message).join(', '))
    }

    const { name, phone, email, cpf, address, password, pet } = parsed.data

    const existing = await prisma.client.findUnique({ where: { phone } })
    if (existing) {
      return badRequest('Telefone ja cadastrado. Faca login ou use outro numero.')
    }

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        email,
        cpf,
        address,
        password: hashPassword(password),
        pets: {
          create: {
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            weight: pet.weight,
            birthDate: pet.birthDate ? new Date(pet.birthDate) : null,
            alert: pet.alert,
            notes: pet.notes,
            preferredSector: pet.preferredSector || 'SPA',
          },
        },
      },
      include: { pets: true },
    })

    const token = await signToken({
      sub: client.id,
      email: client.email || client.phone,
      name: client.name,
      role: 'CLIENT',
    })

    const res = NextResponse.json({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      role: 'CLIENT',
      pets: client.pets,
    }, { status: 201 })

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return res
  } catch (error) {
    console.error('Register error:', error)
    const err = error as { code?: string }
    if (err.code === 'P2002') return badRequest('CPF ou email ja cadastrado')
    return serverError()
  }
}
