import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Etudiant } from '@/src/entities/Etudiant'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relaxed-selkie-3ef8a0.netlify.app',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: espaceId } = await params
    console.log('🔵 ASSIGNABLES - espaceId reçu:', espaceId)    
    const db = await getDataSource()

    // 1️⃣ Récupère l'espace pédagogique
    const espace = await db.getRepository(EspacePedagogique).findOne({
      where: { id: espaceId },
      relations: ['promotion', 'etudiants', 'etudiants.user'],
    })
    
    console.log('🔵 ESPACE trouvé:', espace?.id)
    console.log('🔵 Promotion de l\'espace:', espace?.promotion?.id)
    console.log('🔵 Étudiants DÉJÀ assignés à l\'espace:', espace?.etudiants?.length)
    
    if (!espace) {
      return NextResponse.json({ success: false, error: 'ESPACE_NOT_FOUND' }, { status: 404, headers: CORS_HEADERS })
    }

    // 2️⃣ Récupère TOUS les étudiants de la promotion
    const allEtudiants = await db.getRepository(Etudiant).find({
      where: { promotion: { id: espace.promotion.id } },
      relations: ['user'],
    })
    
    console.log('🔵 TOUS les étudiants de la promotion:', allEtudiants.length)
    console.log('🔵 Liste complète:', allEtudiants.map(e => ({
      id: e.id,
      nom: e.user.nom,
      prenom: e.user.prenom
    })))

    // 3️⃣ Filtre
    const assignedIds = espace.etudiants.map(e => e.id)
    console.log('🔵 IDs déjà assignés:', assignedIds)
    
    const assignables = allEtudiants.filter(e => !assignedIds.includes(e.id))
    console.log('🔵 Étudiants ASSIGNABLES (après filtre):', assignables.length)
    console.log('🔵 Liste assignables:', assignables.map(e => ({
      id: e.id,
      nom: e.user.nom,
      prenom: e.user.prenom
    })))

    return NextResponse.json({ success: true, data: assignables }, { headers: CORS_HEADERS })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ GET ASSIGNABLES ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: CORS_HEADERS })
  }
}