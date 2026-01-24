export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { addEtudiantsFromPromotion, getEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { addEtudiantsSchema } from '@/src/schemas/add-etudiants.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function POST(req: NextRequest) {
  try {
    console.log('🔵 ADD ETUDIANTS - Début')
    
    requireRole(req, ['DIRECTEUR_ETUDES', 'FORMATEUR'])
    console.log('🔵 ADD ETUDIANTS - Auth OK')

    const body = await req.json()
    console.log('🔵 ADD ETUDIANTS - Body reçu:', body)

    const data = addEtudiantsSchema.parse(body)
    console.log('🔵 ADD ETUDIANTS - Validation OK:', data)

    const result = await addEtudiantsFromPromotion(
      data.espacePedagogiqueId,
      data.promotionId
    )
    console.log('🔵 ADD ETUDIANTS - Résultat:', result)

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      { status: 200 }
    )
  } catch (e: any) {
    console.error('❌ ADD ETUDIANTS ERROR:', e)
    console.error('❌ Error message:', e.message)
    console.error('❌ Error name:', e.name)
    
    let status = 400
    let error = e.message

    if (e.message === 'MISSING_TOKEN') {
      status = 401
      error = 'Token manquant'
    }

    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') {
      status = 401
      error = 'Token invalide'
    }

    if (e.message === 'FORBIDDEN') {
      status = 403
      error = 'Accès refusé - Réservé au Directeur des Études'
    }

    if (e.message === 'ESPACE_NOT_FOUND') {
      status = 404
      error = 'Espace pédagogique introuvable'
    }

    if (e.message === 'PROMOTION_NOT_FOUND') {
      status = 404
      error = 'Promotion introuvable'
    }
    
    if (e.message?.includes('PROMOTION_MISMATCH')) {
      status = 400
      error = e.message
    }

    if (e.message === 'NO_STUDENTS_IN_PROMOTION') {
      status = 404
      error = 'Aucun étudiant dans cette promotion'
    }

    if (e.name === 'ZodError') {
      status = 400
      error = `Validation échouée: ${JSON.stringify(e.errors)}`
    }

    return NextResponse.json(
      { success: false, error },
      { status }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const espace = await getEspacePedagogique(params.id)

  return NextResponse.json({
    success: true,
    data: espace,
  })
}