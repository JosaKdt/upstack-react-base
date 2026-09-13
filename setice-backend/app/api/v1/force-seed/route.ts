import { NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import bcrypt from 'bcrypt'

export async function GET() {
  try {
    const db = await getDataSource()
    const userRepo = db.getRepository(User)

    const existing = await userRepo.findOne({
      where: { email: 'directeur@setice.edu' }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Directeur existe déjà',
        email: existing.email
      })
    }

    const hashedPassword = await bcrypt.hash('password123', 10)

    const director = userRepo.create({
      nom: 'ADMIN',
      prenom: 'Directeur',
      email: 'directeur@setice.edu',
      role: Role.DIRECTEUR_ETUDES,
      password: hashedPassword,
      motDePasseTemporaire: true
    })

    await userRepo.save(director)

    return NextResponse.json({
      success: true,
      message: 'Directeur créé avec succès',
      email: 'directeur@setice.edu',
      password: 'password123',
      id: director.id
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}