export interface Client {
  id: string
  name: string
  phone: string
  email?: string | null
  cpf?: string | null
  address?: string | null
  createdAt: string
  updatedAt: string
  pets?: Pet[]
}

export interface Pet {
  id: string
  name: string
  species: 'DOG' | 'CAT' | 'OTHER'
  breed: string
  weight?: number | null
  birthDate?: string | null
  alert?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  clientId: string
  client?: Client
  appointments?: Appointment[]
}

export interface Service {
  id: string
  name: string
  category: 'BATH' | 'GROOMING' | 'VET_CONSULT' | 'VACCINE' | 'SURGERY' | 'CHECKUP' | 'OTHER'
  description?: string | null
  price: number
  durationMin: number
  isActive: boolean
}

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'VET' | 'GROOMER' | 'RECEPTION'
  isActive: boolean
}

export interface StaffMember {
  id: string
  userId?: string | null
  name: string
  sector: 'SPA' | 'VET' | 'GERAL'
  roleTitle: string
  crmv?: string | null
  status: 'ACTIVE' | 'OFF_DUTY' | 'VACATION' | 'INACTIVE'
  permAdvanceStages: boolean
  permEditRecords: boolean
  permFinancial: boolean
  user?: User | null
}

export interface Appointment {
  id: string
  date: string
  time: string
  status: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'FINISHING' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  currentStep: number
  checklist?: string | null
  notes?: string | null
  tutorNotes?: string | null
  checkedInAt?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  petId: string
  pet?: Pet
  serviceId: string
  service?: Service
  vetId?: string | null
  vet?: User | null
  groomerId?: string | null
  groomer?: User | null
  priceCharged?: number | null
  isPaid: boolean
  paymentMethod?: string | null
}

export interface DashboardStats {
  totalToday: number
  completedToday: number
  remaining: number
  bathCount: number
  vetCount: number
  revenue: number
}
