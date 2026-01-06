export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { login } from '@/src/services/auth.service'
import { loginSchema } from '@/src/schemas/login.schema'

export async function POST(req: Request) {
  try {
    // Parser et valider le body
    const body = await req.json()
    const data = loginSchema.parse(body)

    // Authentifier l'utilisateur
    const result = await login(data.email, data.password)

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    )
  } catch (e: any) {
    // Gestion des erreurs
    if (e.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
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