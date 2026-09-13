import { NextResponse } from 'next/server'
import { AppDataSource } from '@/src/lib/data-source'

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    await AppDataSource.synchronize()

    const tables = await AppDataSource.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    )

    return NextResponse.json({
      success: true,
      message: 'Tables synchronisées avec succès',
      tables
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}