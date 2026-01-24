export const runtime = 'nodejs'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { createEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { createEspacePedagogiqueSchema } from '@/src/schemas/espace-pedagogique.schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const data = createEspacePedagogiqueSchema.parse(body)

    const espace = await createEspacePedagogique(data)

    return NextResponse.json(
      { success: true, data: espace },
      { status: 201 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 400 }
    )
  }
}