/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createTravailSchema } from '@/src/schemas/createTravail.schema'
import { createTravail, listTravauxByEspace } from '@/src/services/travail.service'
import { User } from '@/src/entities/User'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

// Headers CORS communs
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
}

// ✅ Pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

// Récupérer l'utilisateur depuis le token
async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

// ✅ GET /api/v1/travaux?espaceId=xxx
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const espaceId = url.searchParams.get('espaceId')
    if (!espaceId) {
      return NextResponse.json(
        { success: false, error: 'ESPACE_ID_REQUIRED' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const travaux = await listTravauxByEspace(espaceId)
    return NextResponse.json({ success: true, data: travaux }, { headers: CORS_HEADERS })
  } catch (err: any) {
    console.error('GET TRAVAUX ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

// ✅ POST /api/v1/travaux
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)
    if (user.role !== 'FORMATEUR') {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    const body = await req.json()
    const data = createTravailSchema.parse(body)

    // ⚡ Fix : utiliser user.userId pour formateur
    const travail = await createTravail({
      ...data,
      formateur:{
        id: user.userId,
        role: user.role,
      } as User,
      
      
      espacePedagogiqueId: data.espacePedagogiqueId,
    })

    return NextResponse.json(
      { success: true, data: travail },
      { status: 201, headers: CORS_HEADERS }
    )
  } catch (err: any) {
    console.error('CREATE TRAVAIL ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400, headers: CORS_HEADERS }
    )
  }
}
