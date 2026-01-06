export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { listEspacesPedagogiques } from '@/src/services/espace-pedagogique.service'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function GET(req: Request) {
  try {
    // Vérifier que l'utilisateur est un Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // Récupérer tous les espaces pédagogiques
    const espaces = await listEspacesPedagogiques()

    // Formater la réponse
    const data = espaces.map(espace => ({
      id: espace.id,
      promotion: {
        id: espace.promotion.id,
        code: espace.promotion.code,
        libelle: espace.promotion.libelle,
        annee: espace.promotion.annee
      },
      matiere: {
        id: espace.matiere.id,
        libelle: espace.matiere.libelle
      },
      formateur: espace.formateur ? {
        id: espace.formateur.id,
        nom: espace.formateur.user?.nom,
        prenom: espace.formateur.user?.prenom
      } : null,
      createdAt: espace.createdAt
    }))

    return NextResponse.json(
      { success: true, data },
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

    // Erreur générique
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    )
  }
}