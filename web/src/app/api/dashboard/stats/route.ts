import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, serverError } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today.getTime() + 86400000)

      const [totalToday, completedToday, bathCount, vetCount, revenueAgg] = await Promise.all([
        prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
        prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, status: 'COMPLETED' } }),
        prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, service: { category: 'BATH' } } }),
        prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, service: { category: 'VET_CONSULT' } } }),
        prisma.appointment.aggregate({
          where: { date: { gte: today, lt: tomorrow }, isPaid: true },
          _sum: { priceCharged: true },
        }),
      ])

      return NextResponse.json({
        totalToday,
        completedToday,
        remaining: totalToday - completedToday,
        bathCount,
        vetCount,
        revenue: revenueAgg._sum.priceCharged || 0,
      })
    } catch (error) {
      console.error('GET /api/dashboard/stats error:', error)
      return serverError()
    }
  })
}
