export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { assignFormateur } from '@/src/services/espace-pedagogique.service'
import { assignFormateurSchema } from '@/src/schemas/assign-formateur.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function POST(req: Request) {
  try {
    // Vérifier que l'utilisateur est un Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // Parser et valider le body
    const body = await req.json()
    const data = assignFormateurSchema.parse(body)

    // Affecter le formateur
    const result = await assignFormateur(data.espacePedagogiqueId, data.formateurId)

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    )
  } catch (e: any) {
    // Gestion des erreurs d'authentification
    if (e.message === 'MISSING_TOKEN') {
      return NextResponse.json(
        { success: false, error: 'Token manquant' },
        { status: 401 }
      )
    }

    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') {
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 401 }
      )
    }

    if (e.message === 'FORBIDDEN') {
      return NextResponse.json(
        { success: false, error: 'Accès refusé - Réservé au Directeur des Études' },
        { status: 403 }
      )
    }

    // Erreurs métier
    if (e.message === 'ESPACE_NOT_FOUND') {
      return NextResponse.json(
        { success: false, error: 'Espace pédagogique introuvable' },
        { status: 404 }
      )
    }

    if (e.message === 'FORMATEUR_NOT_FOUND') {
      return NextResponse.json(
        { success: false, error: 'Formateur introuvable' },
        { status: 404 }
      )
    }

    // Erreur de validation Zod
    if (e.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: JSON.stringify(e.errors) },
        { status: 400 }
      )
    }

    // Erreur générique
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    )
  }
}