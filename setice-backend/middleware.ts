import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Liste des origines autorisées
  const allowedOrigins = [

    'https://resonant-wisp-67c4aa.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  const response = NextResponse.next()

  // Vérifier si l'origine est autorisée OU si c'est un domaine Netlify
  if (origin && (allowedOrigins.includes(origin) || origin.includes('.netlify.app'))) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Max-Age', '86400')

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }

  return response
}

// Appliquer le middleware à toutes les routes API
export const config = {
  matcher: '/api/:path*',
}