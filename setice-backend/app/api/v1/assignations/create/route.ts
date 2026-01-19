/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { deliverTravail } from '@/src/services/assignation.service'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

// ✅ POST /api/v1/assignations/deliver
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)
    if (user.role !== 'ETUDIANT') return NextResponse.json({ success: false, error: 'FORBIDDEN' }, { status: 403 })

    const body = await req.json()
    const { assignationId } = body
    if (!assignationId) return NextResponse.json({ success: false, error: 'ASSIGNATION_ID_REQUIRED' }, { status: 400 })

    const result = await deliverTravail(assignationId, user)
    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    console.error('DELIVER TRAVAIL ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 400 })
  }
}

// ✅ GET /api/v1/assignations?etudiantId=xxx
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const etudiantId = url.searchParams.get('etudiantId')
    if (!etudiantId) return NextResponse.json({ success: false, error: 'ETUDIANT_ID_REQUIRED' }, { status: 400 })

    const { assignationRepository } = await import('@/src/repositories/assignation.repository')
    const assignations = await assignationRepository.listByEtudiant(etudiantId)
    return NextResponse.json({ success: true, data: assignations })
  } catch (err: any) {
    console.error('GET ASSIGNATIONS ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
