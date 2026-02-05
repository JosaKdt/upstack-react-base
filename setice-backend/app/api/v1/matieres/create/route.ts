/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { 
  createMatiere, 
  listMatieres, 
  deleteMatiere, 
  updateMatiere 
} from "@/src/services/matiere.service"
import { 
  createMatiereSchema, 
  updateMatiereSchema 
} from "@/src/schemas/matiere.schema"

const JWT_SECRET = process.env.JWT_SECRET!

// ✅ READ - GET
export async function GET(req: NextRequest) {
  try {
    const matieres = await listMatieres()
    return NextResponse.json(
      { success: true, data: matieres },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("GET MATIERES ERROR:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

// ✅ CREATE - POST
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    const data = createMatiereSchema.parse(body)
    const matiere = await createMatiere(data)

    return NextResponse.json(
      { success: true, data: matiere },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE MATIERE ERROR:', err)

    let status = 400
    if (err.message === "MATIERE_ALREADY_EXISTS") status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}

// ✅ UPDATE - PUT
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    
    // ✅ Valider avec le schéma
    const validatedData = updateMatiereSchema.parse(body)
    const { id, ...updateData } = validatedData

    const matiere = await updateMatiere(id, updateData)

    return NextResponse.json(
      { success: true, data: matiere },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('UPDATE MATIERE ERROR:', err)

    let status = 400
    if (err.message === 'MATIERE_NOT_FOUND') status = 404
    if (err.message === 'CODE_ALREADY_EXISTS') status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401
    
    // ✅ Gestion des erreurs de validation Zod
    if (err.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: err.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}

// ✅ DELETE - DELETE
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      )
    }

    await deleteMatiere(id)

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('DELETE MATIERE ERROR:', err)

    let status = 400
    if (err.message === 'MATIERE_NOT_FOUND') status = 404
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}