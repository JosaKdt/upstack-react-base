/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createFormateur, getFormateurs, deleteFormateur, updateFormateur } from '@/src/services/formateur.service'
import { createFormateurSchema, updateFormateurSchema } from '@/src/schemas/formateur.schema'

const JWT_SECRET = process.env.JWT_SECRET!

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
    const data = createFormateurSchema.parse(body)

    const formateur = await createFormateur(data)

    return NextResponse.json(
      { success: true, data: formateur },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE FORMATEUR ERROR:', err)

    let status = 400
    if (err.message === 'USER_ALREADY_EXISTS') status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}

// ✅ READ - GET
export async function GET(req: NextRequest) {
  try {
    const formateurs = await getFormateurs()
    return NextResponse.json(
      { success: true, data: formateurs },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("GET FORMATEURS ERROR:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

// ✅ UPDATE - PUT
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
    const validatedData = updateFormateurSchema.parse(body)
    const { id, ...updateData } = validatedData

    const formateur = await updateFormateur(id, updateData)

    return NextResponse.json(
      { success: true, data: formateur },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('UPDATE FORMATEUR ERROR:', err)

    let status = 400
    if (err.message === 'FORMATEUR_NOT_FOUND') status = 404
    if (err.message === 'EMAIL_ALREADY_EXISTS') status = 409
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

    await deleteFormateur(id)

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('DELETE FORMATEUR ERROR:', err)

    let status = 400
    if (err.message === 'FORMATEUR_NOT_FOUND') status = 404
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}