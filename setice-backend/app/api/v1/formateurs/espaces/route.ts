/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/src/middleware/auth.middleware'
import { listEspacesByFormateurUser } from '@/src/services/espace-pedagogique.service'

export async function GET(req: NextRequest) {
  try {
    const user = requireRole(req, ['FORMATEUR'])

    if (!user.userId) {
      throw new Error('USER_ID_MISSING')
    }

    const espaces = await listEspacesByFormateurUser(user.userId)

    console.log('USER ID:', user.id)
    console.log('Espaces trouvés:', espaces.length)
    espaces.forEach((e: { id: any; formateur: { user: { id: any } } }) => console.log(e.id, e.formateur.user.id))

    return NextResponse.json(
      { success: true, data: espaces },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('GET ESPACES FORMATEUR ERROR:', err)
    let status = 403
    if (err.message === 'UNAUTHORIZED' || err.message === 'MISSING_TOKEN') status = 401
    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}