/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { listEspacesPedagogiques } from '@/src/services/espace-pedagogique.service'
import { requireRole } from '@/src/middleware/auth.middleware'

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ['DIRECTEUR_ETUDES'])

    const espaces = await listEspacesPedagogiques()

    // 🔍 DEBUG : Vérifier les données brutes
    console.log('🔍 ESPACES BRUTS:', JSON.stringify(espaces, null, 2))
    
    espaces.forEach((espace, index) => {
      console.log(`\n📊 Espace ${index + 1}:`)
      console.log('  - ID:', espace.id)
      console.log('  - Formateur:', espace.formateur)
      console.log('  - Formateur.user:', espace.formateur?.user)
      console.log('  - Etudiants:', espace.etudiants?.length || 0)
      
      if (espace.formateur && !espace.formateur.user) {
        console.error('  ❌ FORMATEUR SANS USER!')
      }
      
      espace.etudiants?.forEach((e, i) => {
        if (!e.user) {
          console.error(`  ❌ ETUDIANT ${i} SANS USER!`)
        }
      })
    })

    const data = espaces.map(espace => ({
      id: espace.id,
      promotion: {
        id: espace.promotion.id,
        code: espace.promotion.code,
        libelle: espace.promotion.libelle,
        annee: espace.promotion.annee,
      },
      matiere: {
        id: espace.matiere.id,
        libelle: espace.matiere.libelle,
      },
      formateur: espace.formateur
        ? {
            id: espace.formateur.id,
            nom: espace.formateur.user?.nom || '⚠️ MANQUANT',
            prenom: espace.formateur.user?.prenom || '⚠️ MANQUANT',
          }
        : null,
      etudiants: espace.etudiants?.map(e => ({
        id: e.id,
        matricule: e.matricule,
        user: {
          id: e.user?.id || 'ERROR',
          prenom: e.user?.prenom || '⚠️ MANQUANT',
          nom: e.user?.nom || '⚠️ MANQUANT',
          email: e.user?.email || '⚠️ MANQUANT',
        },
      })) ?? [],
      createdAt: espace.createdAt,
    }))

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (e: any) {
    // ... reste du code
  }
}