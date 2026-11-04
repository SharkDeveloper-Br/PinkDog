import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Usuários / Staff
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pinkdog.vet',
      password: '$2b$10$hashedpasswordplaceholder',
      name: 'Beatriz Nogueira',
      role: 'ADMIN',
    },
  })

  const vet = await prisma.user.create({
    data: {
      email: 'vet@pinkdog.vet',
      password: '$2b$10$hashedpasswordplaceholder',
      name: 'Dra. Camila Pink',
      role: 'VET',
    },
  })

  const groomer = await prisma.user.create({
    data: {
      email: 'spa@pinkdog.vet',
      password: '$2b$10$hashedpasswordplaceholder',
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
        roleTitle: 'Médica Veterinária Chefe',
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
        roleTitle: 'Groomer Sênior',
        status: 'ACTIVE',
        permAdvanceStages: true,
        permEditRecords: false,
        permFinancial: false,
      },
    ],
  })

  // 2. Serviços
  const services = await prisma.service.createMany({
    data: [
      { name: 'Banho Relax & Hidratação', category: 'BATH', price: 65, durationMin: 60 },
      { name: 'SPA & Tosa da Raça', category: 'GROOMING', price: 90, durationMin: 90 },
      { name: 'Consulta Clínica Geral', category: 'VET_CONSULT', price: 140, durationMin: 30 },
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
      alert: 'Não utilizar secador na potência máxima',
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
      name: 'Paçoca',
      species: 'DOG',
      breed: 'Bulldog Francês',
      weight: 12,
      alert: 'Respiração ruidosa típica. Evitar estresse.',
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
      breed: 'Spitz Alemão',
      weight: 4,
      clientId: client3.id,
    },
  })

  // 4. Agendamentos de hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.appointment.createMany({
    data: [
      {
        date: today,
        time: '09:00',
        status: 'COMPLETED',
        petId: pet1.id,
        serviceId: (await prisma.service.findFirst({ where: { category: 'BATH' } }))!.id,
        groomerId: groomer.id,
        priceCharged: 65,
        isPaid: true,
        paymentMethod: 'PIX',
        notes: 'Tosa higiênica e unhas aparadas.',
      },
      {
        date: today,
        time: '11:30',
        status: 'WAITING',
        petId: pet2.id,
        serviceId: (await prisma.service.findFirst({ where: { category: 'VET_CONSULT' } }))!.id,
        vetId: vet.id,
        notes: 'Avaliação de secreção ocular crônica.',
      },
      {
        date: today,
        time: '14:00',
        status: 'SCHEDULED',
        petId: pet3.id,
        serviceId: (await prisma.service.findFirst({ where: { category: 'GROOMING' } }))!.id,
        groomerId: groomer.id,
      },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
