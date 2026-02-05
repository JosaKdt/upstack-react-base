/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { 
  createPromotion, 
  getPromotions, 
  deletePromotion, 
  updatePromotion 
} from '@/src/services/promotion.service'
import { 
  createPromotionSchema, 
  updatePromotionSchema 
} from '@/src/schemas/promotion.schema'

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
    const data = createPromotionSchema.parse(body)

    const promotion = await createPromotion(data)

    return NextResponse.json(
      { success: true, data: promotion },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE PROMOTION ERROR:', err)

    let status = 400
    if (err.message === 'CODE_ALREADY_EXISTS') status = 409
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
    const promotions = await getPromotions()
    return NextResponse.json(
      { success: true, data: promotions },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("GET PROMOTIONS ERROR:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
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
    const validatedData = updatePromotionSchema.parse(body)
    const { id, ...updateData } = validatedData

    const promotion = await updatePromotion(id, updateData)

    return NextResponse.json(
      { success: true, data: promotion },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('UPDATE PROMOTION ERROR:', err)

    let status = 400
    if (err.message === 'PROMOTION_NOT_FOUND') status = 404
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

    await deletePromotion(id)

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('DELETE PROMOTION ERROR:', err)

    let status = 400
    if (err.message === 'PROMOTION_NOT_FOUND') status = 404
    if (err.message === 'PROMOTION_HAS_STUDENTS') status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}