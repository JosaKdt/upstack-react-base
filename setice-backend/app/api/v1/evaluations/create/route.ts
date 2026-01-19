/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { evaluateTravailSchema } from '@/src/schemas/evaluateTravail.schema'
import { evaluateTravail } from '@/src/services/evaluation.service'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

// ✅ POST /api/v1/evaluations
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)
    if (user.role !== 'FORMATEUR') return NextResponse.json({ success: false, error: 'FORBIDDEN' }, { status: 403 })

    const body = await req.json()
    const data = evaluateTravailSchema.parse(body)

    const evaluation = await evaluateTravail({ ...data, formateur: user })
    return NextResponse.json({ success: true, data: evaluation }, { status: 201 })
  } catch (err: any) {
    console.error('EVALUATE TRAVAIL ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 400 })
  }
}

// ✅ GET /api/v1/evaluations?assignationId=xxx
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const assignationId = url.searchParams.get('assignationId')
    if (!assignationId) return NextResponse.json({ success: false, error: 'ASSIGNATION_ID_REQUIRED' }, { status: 400 })

    const { evaluationRepository } = await import('@/src/repositories/evaluation.repository')
    const evaluations = await evaluationRepository.listByAssignation(assignationId)
    return NextResponse.json({ success: true, data: evaluations })
  } catch (err: any) {
    console.error('GET EVALUATIONS ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
