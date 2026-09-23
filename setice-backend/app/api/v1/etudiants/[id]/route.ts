import { NextRequest, NextResponse } from 'next/server'
import { updateEtudiant, deleteEtudiant } from '@/src/services/etudiant.service'
import { requireRole } from '@/src/middleware/auth.middleware'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relaxed-selkie-3ef8a0.netlify.app',
  'Access-Control-Allow-Methods': 'PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, ['DIRECTEUR_ETUDES'])
    const { id } = await params
    const body = await req.json()

    const result = await updateEtudiant(id, body)

    return NextResponse.json({ success: true, data: result }, { headers: CORS_HEADERS })
  } catch (e: any) {
    let status = 400
    if (e.message === 'MISSING_TOKEN') status = 401
    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') status = 401
    if (e.message === 'FORBIDDEN') status = 403
    if (e.message === 'ETUDIANT_NOT_FOUND') status = 404
    if (e.message === 'PROMOTION_NOT_FOUND') status = 404
    if (e.message === 'USER_ALREADY_EXISTS') status = 409

    return NextResponse.json({ success: false, error: e.message }, { status, headers: CORS_HEADERS })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireRole(req, ['DIRECTEUR_ETUDES'])
    const { id } = await params

    await deleteEtudiant(id)

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (e: any) {
    let status = 400
    if (e.message === 'MISSING_TOKEN') status = 401
    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') status = 401
    if (e.message === 'FORBIDDEN') status = 403
    if (e.message === 'ETUDIANT_NOT_FOUND') status = 404

    return NextResponse.json({ success: false, error: e.message }, { status, headers: CORS_HEADERS })
  }
}