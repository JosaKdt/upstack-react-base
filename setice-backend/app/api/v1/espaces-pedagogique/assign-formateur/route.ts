/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { assignFormateur } from '@/src/services/espace-pedagogique.service'
import { assignFormateurSchema } from '@/src/schemas/assign-formateur.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function POST(req: NextRequest) {
  try {
    requireRole(req, ['DIRECTEUR_ETUDES'])

    const body = await req.json()
    const data = assignFormateurSchema.parse(body)

    const result = await assignFormateur(
      data.espacePedagogiqueId,
      data.formateurId
    )

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    )
  } catch (e: any) {
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

    if (e.message === 'FORMATEUR_NOT_FOUND') {
      status = 404
      error = 'Formateur introuvable'
    }

    if (e.name === 'ZodError') {
      status = 400
      error = JSON.stringify(e.errors)
    }

    return NextResponse.json(
      { success: false, error },
      { status }
    )
  }
}