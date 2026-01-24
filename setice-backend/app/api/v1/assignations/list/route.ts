/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { assignationRepository } from '@/src/repositories/assignation.repository'
import { validate as isUuid } from 'uuid'

// GET /api/v1/assignations/list?travailId=xxx
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const travailId = url.searchParams.get('travailId')

    // 1️⃣ Vérifie que le param existe
    if (!travailId) {
      return NextResponse.json(
        { success: false, error: 'TRAVAIL_ID_REQUIRED' },
        { status: 400 }
      )
    }

    // 2️⃣ Vérifie que c'est un UUID valide
    if (!isUuid(travailId)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_UUID' },
        { status: 400 }
      )
    }

    // 3️⃣ Récupère les assignations
    const assignations = await assignationRepository.listByTravail(travailId)

    // 4️⃣ Retourne le nombre total et les assignations
    return NextResponse.json(
      { success: true, data: { total: assignations.length, assignations } }
    )
  } catch (err: any) {
    console.error('GET ASSIGNATIONS BY TRAVAIL ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}