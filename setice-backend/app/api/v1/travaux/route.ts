/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { listTravauxByEspace, getTravailById } from '@/src/services/travail.service'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const espaceId = url.searchParams.get('espaceId')

    if (id) {
      const travail = await getTravailById(id)
      if (!travail) {
        return NextResponse.json(
          { success: false, error: 'TRAVAIL_NOT_FOUND' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { success: true, data: travail },
        { status: 200 }
      )
    }

    if (espaceId) {
      const travaux = await listTravauxByEspace(espaceId)
      return NextResponse.json(
        { success: true, data: travaux },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'ID_OR_ESPACE_ID_REQUIRED' },
      { status: 400 }
    )
  } catch (err: any) {
    console.error('GET TRAVAUX ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}