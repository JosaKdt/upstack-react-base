import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Etudiant } from '@/src/entities/Etudiant'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: espaceId } = params
    console.log('🔵 ASSIGNABLES - espaceId reçu:', espaceId)
    
    const db = await getDataSource()

    const espace = await db.getRepository(EspacePedagogique).findOne({
      where: { id: espaceId },
      relations: ['promotion', 'etudiants', 'etudiants.user'],
    })
    
    console.log('🔵 ESPACE trouvé:', espace?.id)
    console.log('🔵 Promotion de l\'espace:', espace?.promotion?.id)
    console.log('🔵 Étudiants DÉJÀ assignés à l\'espace:', espace?.etudiants?.length)
    
    if (!espace) {
      return NextResponse.json({ success: false, error: 'ESPACE_NOT_FOUND' }, { status: 404 })
    }

    const allEtudiants = await db.getRepository(Etudiant).find({
      where: { promotion: { id: espace.promotion.id } },
      relations: ['user'],
    })
    
    console.log('🔵 TOUS les étudiants de la promotion:', allEtudiants.length)

    const assignedIds = espace.etudiants.map(e => e.id)
    console.log('🔵 IDs déjà assignés:', assignedIds)
    
    const assignables = allEtudiants.filter(e => !assignedIds.includes(e.id))
    console.log('🔵 Étudiants ASSIGNABLES (après filtre):', assignables.length)

    return NextResponse.json({ success: true, data: assignables })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ GET ASSIGNABLES ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}