import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
})

export const appointmentCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Horario deve estar no formato HH:MM'),
  petId: z.string().uuid('ID do pet invalido'),
  serviceId: z.string().uuid('ID do servico invalido'),
  vetId: z.string().uuid().optional().nullable(),
  groomerId: z.string().uuid().optional().nullable(),
  tutorNotes: z.string().max(500).optional(),
  priceCharged: z.number().nonnegative().optional(),
})

export const appointmentUpdateSchema = z.object({
  id: z.string().uuid('ID invalido'),
  status: z.enum([
    'SCHEDULED', 'WAITING', 'IN_PROGRESS', 'FINISHING', 'READY', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
  ]).optional(),
  currentStep: z.number().int().min(0).max(4).optional(),
  notes: z.string().max(1000).optional(),
  priceCharged: z.number().nonnegative().optional(),
  isPaid: z.boolean().optional(),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']).optional().nullable(),
})

export const clientCreateSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio').max(100),
  phone: z.string().min(8, 'Telefone invalido').max(20),
  email: z.string().email().optional().nullable(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  pet: z.object({
    name: z.string().min(1).max(50),
    species: z.enum(['DOG', 'CAT', 'OTHER']),
    breed: z.string().min(1).max(50),
    weight: z.number().positive().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    alert: z.string().max(200).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  }).optional(),
})

export const staffUpdateSchema = z.object({
  id: z.string().uuid('ID invalido'),
  sector: z.enum(['SPA', 'VET', 'GERAL']),
  roleTitle: z.string().min(1).max(100),
  crmv: z.string().max(30).optional().nullable(),
  permAdvanceStages: z.boolean().optional(),
  permEditRecords: z.boolean().optional(),
  permFinancial: z.boolean().optional(),
})

export const petCreateSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(['DOG', 'CAT', 'OTHER']),
  breed: z.string().min(1).max(50),
  weight: z.number().positive().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  alert: z.string().max(200).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  clientId: z.string().uuid(),
})

export const serviceCreateSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['BATH', 'GROOMING', 'VET_CONSULT', 'VACCINE', 'SURGERY', 'CHECKUP', 'OTHER']),
  description: z.string().max(500).optional().nullable(),
  price: z.number().positive(),
  durationMin: z.number().int().positive(),
})

export const clientRegisterSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio').max(100),
  phone: z.string().min(8, 'Telefone invalido').max(20),
  email: z.string().email().optional().nullable(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres').max(100),
  pet: z.object({
    name: z.string().min(1).max(50),
    species: z.enum(['DOG', 'CAT', 'OTHER']),
    breed: z.string().min(1).max(50),
    weight: z.number().positive().optional().nullable(),
    birthDate: z.string().optional().nullable(),
    alert: z.string().max(200).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
    preferredSector: z.enum(['SPA', 'VET', 'GERAL']).optional().nullable(),
  }),
})
