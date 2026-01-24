import { NextRequest, NextResponse } from 'next/server'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const assignationId = url.searchParams.get('assignationId')
    if (!assignationId) return NextResponse.json({ success: false, error: 'ASSIGNATION_ID_REQUIRED' }, { status: 400 })

    const evaluations = await evaluationRepository.listByAssignation(assignationId)
    return NextResponse.json({ success: true, data: evaluations })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}