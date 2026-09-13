import { NextRequest, NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relaxed-selkie-3ef8a0.netlify.app',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, data: [] }, { headers: CORS_HEADERS })
}