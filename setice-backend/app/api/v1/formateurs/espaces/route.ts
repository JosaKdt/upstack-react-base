/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/src/middleware/auth.middleware'
import { listEspacesByFormateurUser } from '@/src/services/espace-pedagogique.service'

// ✅ Gestion de la pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": 'https://relaxed-selkie-3ef8a0.netlify.app',
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  })
}

// ✅ GET /api/v1/formateurs/espaces
export async function GET(req: NextRequest) {
  try {
    // Vérifie que l'utilisateur est bien un FORMATEUR
    // ⚠ Ici `user.id` correspond à ton `JwtPayload.id`
    const user = requireRole(req, ['FORMATEUR'])

    if (!user.userId) {
      throw new Error('USER_ID_MISSING')
    }

    // Récupère uniquement les espaces assignés à ce formateur
    const espaces = await listEspacesByFormateurUser(user.userId)

    console.log('USER ID:', user.id)
    console.log('Espaces trouvés:', espaces.length)
    espaces.forEach(e => console.log(e.id, e.formateur.user.id))

    return NextResponse.json(
      { success: true, data: espaces },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": 'https://relaxed-selkie-3ef8a0.netlify.app',
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  } catch (err: any) {
    console.error('GET ESPACES FORMATEUR ERROR:', err)
    let status = 403
    if (err.message === 'UNAUTHORIZED' || err.message === 'MISSING_TOKEN') status = 401
    return NextResponse.json(
      { success: false, error: err.message },
      {
        status,
        headers: {
          "Access-Control-Allow-Origin": 'https://relaxed-selkie-3ef8a0.netlify.app',
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  }
}
