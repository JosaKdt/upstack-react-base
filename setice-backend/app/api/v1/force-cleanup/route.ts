import { NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'

export async function GET() {
  try {
    const db = await getDataSource()
    const userRepo = db.getRepository(User)

    // Supprime tous les users ETUDIANT qui n'ont PAS de directeur
    const deleted = await userRepo
      .createQueryBuilder()
      .delete()
      .where('role = :role', { role: Role.ETUDIANT })
      .execute()

    return NextResponse.json({
      success: true,
      message: `${deleted.affected} compte(s) étudiant supprimé(s)`,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}