import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { requireRole } from '@/src/middleware/auth.middleware'
import jwt from 'jsonwebtoken'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relaxed-selkie-3ef8a0.netlify.app',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ['FORMATEUR', 'DIRECTEUR_ETUDES'])

    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
    const decoded = jwt.verify(token!, process.env.NEXTAUTH_SECRET || 'super-secret-key') as any

    const db = await getDataSource()
    const espaces = await db.getRepository(EspacePedagogique).find({
      where: { formateur: { id: decoded.userId } },
      relations: ['promotion', 'matiere', 'formateur', 'etudiants'],
    })

    return NextResponse.json({ success: true, data: espaces }, { headers: CORS_HEADERS })
  } catch (e: any) {
    let status = 400
    if (e.message === 'MISSING_TOKEN') status = 401
    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') status = 401
    if (e.message === 'FORBIDDEN') status = 403

    return NextResponse.json({ success: false, error: e.message }, { status, headers: CORS_HEADERS })
  }
}