export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { addEtudiantsFromPromotion } from '@/src/services/espace-pedagogique.service'
import { addEtudiantsSchema } from '@/src/schemas/add-etudiants.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function POST(req: Request) {
  try {
    // Vérifier que l'utilisateur est un Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // Parser et valider le body
    const body = await req.json()
    const data = addEtudiantsSchema.parse(body)

    // Inscrire les étudiants de la promotion
    const result = await addEtudiantsFromPromotion(data.espacePedagogiqueId, data.promotionId)

    return NextResponse.json(
      { 
        success: true, 
        message: result.message,
        data: result.data
      },
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

    if (e.message === 'PROMOTION_NOT_FOUND') {
      return NextResponse.json(
        { success: false, error: 'Promotion introuvable' },
        { status: 404 }
      )
    }

    if (e.message === 'NO_STUDENTS_IN_PROMOTION') {
      return NextResponse.json(
        { success: false, error: 'Aucun étudiant dans cette promotion' },
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