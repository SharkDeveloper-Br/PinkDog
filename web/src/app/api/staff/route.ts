import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const staff = await prisma.staffMember.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(staff)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, sector, roleTitle, crmv, permAdvanceStages, permEditRecords, permFinancial } = body
  const updated = await prisma.staffMember.update({
    where: { id },
    data: { sector, roleTitle, crmv, permAdvanceStages, permEditRecords, permFinancial },
  })
  return NextResponse.json(updated)
}
