import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.appointment.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.client.deleteMany()
  await prisma.service.deleteMany()
  await prisma.staffMember.deleteMany()
  await prisma.user.deleteMany()

  // 1. Usuarios / Staff
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pinkdog.vet',
      password: hashPassword('admin123'),
      name: 'Beatriz Nogueira',
      role: 'ADMIN',
    },
  })

  const vet = await prisma.user.create({
    data: {
      email: 'vet@pinkdog.vet',
      password: hashPassword('vet123'),
      name: 'Dra. Camila Pink',
      role: 'VET',
    },
  })

  const groomer = await prisma.user.create({
    data: {
      email: 'spa@pinkdog.vet',
      password: hashPassword('spa123'),
      name: 'Mariana Rocha',
      role: 'GROOMER',
    },
  })

  await prisma.staffMember.createMany({
    data: [
      {
        userId: admin.id,
        name: 'Beatriz Nogueira',
        sector: 'GERAL',
        roleTitle: 'Gerente de Atendimento',
        status: 'ACTIVE',
        permAdvanceStages: true,
        permEditRecords: true,
        permFinancial: true,
      },
      {
        userId: vet.id,
        name: 'Dra. Camila Pink',
        sector: 'VET',
        roleTitle: 'Medica Veterinaria Chefe',
        crmv: 'CRMV-SP 44.912',
        status: 'ACTIVE',
        permAdvanceStages: true,
        permEditRecords: true,
        permFinancial: false,
      },
      {
        userId: groomer.id,
        name: 'Mariana Rocha',
        sector: 'SPA',
        roleTitle: 'Groomer Senior',
        status: 'ACTIVE',
        permAdvanceStages: true,
        permEditRecords: false,
        permFinancial: false,
      },
    ],
  })

  // 2. Servicos
  await prisma.service.createMany({
    data: [
      { name: 'Banho Relax & Hidratacao', category: 'BATH', price: 65, durationMin: 60 },
      { name: 'SPA & Tosa da Raca', category: 'GROOMING', price: 90, durationMin: 90 },
      { name: 'Consulta Clinica Geral', category: 'VET_CONSULT', price: 140, durationMin: 30 },
      { name: 'Vacina V10 / V8 Importada', category: 'VACCINE', price: 110, durationMin: 15 },
      { name: 'Check-up Preventivo Anual', category: 'CHECKUP', price: 290, durationMin: 45 },
    ],
  })

  // 3. Clientes & Pets
  const client1 = await prisma.client.create({
    data: {
      name: 'Igor Torres',
      phone: '(11) 98841-3320',
      email: 'igor@email.com',
    },
  })

  const pet1 = await prisma.pet.create({
    data: {
      name: 'Shaggy',
      species: 'DOG',
      breed: 'Golden Retriever',
      weight: 31,
      alert: 'Nao utilizar secador na potencia maxima',
      clientId: client1.id,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Fernanda Lima',
      phone: '(11) 97123-4567',
    },
  })

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Pacoca',
      species: 'DOG',
      breed: 'Bulldog Frances',
      weight: 12,
      alert: 'Respiracao ruidosa tipica. Evitar estresse.',
      clientId: client2.id,
    },
  })

  const client3 = await prisma.client.create({
    data: {
      name: 'Carlos Eduardo',
      phone: '(11) 99876-1234',
    },
  })

  const pet3 = await prisma.pet.create({
    data: {
      name: 'Luna',
      species: 'DOG',
      breed: 'Spitz Alemao',
      weight: 4,
      clientId: client3.id,
    },
  })

  // 4. Agendamentos de hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const bathService = await prisma.service.findFirst({ where: { category: 'BATH' } })
  const vetService = await prisma.service.findFirst({ where: { category: 'VET_CONSULT' } })
  const groomingService = await prisma.service.findFirst({ where: { category: 'GROOMING' } })

  await prisma.appointment.createMany({
    data: [
      {
        date: today,
        time: '09:00',
        status: 'COMPLETED',
        petId: pet1.id,
        serviceId: bathService!.id,
        groomerId: groomer.id,
        priceCharged: 65,
        isPaid: true,
        paymentMethod: 'PIX',
        notes: 'Tosa higienica e unhas aparadas.',
      },
      {
        date: today,
        time: '11:30',
        status: 'WAITING',
        petId: pet2.id,
        serviceId: vetService!.id,
        vetId: vet.id,
        notes: 'Avaliacao de secrecao ocular cronica.',
      },
      {
        date: today,
        time: '14:00',
        status: 'SCHEDULED',
        petId: pet3.id,
        serviceId: groomingService!.id,
        groomerId: groomer.id,
      },
    ],
  })

  console.log('Seed concluido com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
