/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    const db = await getDataSource()
    const repo = db.getRepository(EspacePedagogique)
    const espace = await repo.findOne({
      where: { id },
      relations: ['etudiants'],
    })

    if (!espace) {
      return NextResponse.json({ success: false, error: 'ESPACE_NOT_FOUND' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: espace })
  } catch (err: any) {
    console.error('GET ESPACE ERROR:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}