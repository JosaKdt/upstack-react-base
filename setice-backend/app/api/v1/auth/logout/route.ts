import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  console.log("🚪 [API LOGOUT] Début de la déconnexion côté serveur")
  
  try {
    const cookieStore = cookies()
    
    const authCookies = [
      'token',
      'auth_token',
      'session',
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
    ]
    
    authCookies.forEach(async cookieName => {
      try {
        (await cookieStore).delete(cookieName)
        console.log(`🗑️ [API LOGOUT] Cookie supprimé: ${cookieName}`)
      } catch (error) {
        console.warn(`⚠️ [API LOGOUT] Impossible de supprimer ${cookieName}:`, error)
      }
    })
    
    console.log("✅ [API LOGOUT] Déconnexion côté serveur réussie")
    
    const response = NextResponse.json(
      { success: true, message: 'Déconnexion réussie' },
      { status: 200 }
    )
    
    authCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
    })
    
    return response
    
  } catch (error) {
    console.error("❌ [API LOGOUT] Erreur:", error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}