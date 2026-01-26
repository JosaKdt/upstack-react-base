/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDataSource } from "@/src/lib/db"
import { User } from "@/src/entities/User"
import { hashPassword } from "@/src/lib/password"

const JWT_SECRET = process.env.JWT_SECRET!

interface ActivatePayload {
  userId: string
  type: string
}

export async function POST(req: NextRequest) {
  console.log("")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🎯 [ACTIVATE] POST /api/v1/auth/activate")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    const body = await req.json()
    console.log("📥 [ACTIVATE] Body reçu:", { 
      hasToken: !!body.token, 
      tokenLength: body.token?.length,
      tokenPreview: body.token?.substring(0, 20) + '...',
      hasNewPassword: !!body.newPassword 
    })

    const { token, newPassword } = body as { token: string; newPassword: string }

    // ✅ Vérification des champs obligatoires
    if (!token) {
      console.log("❌ [ACTIVATE] Token manquant")
      return NextResponse.json(
        { success: false, error: "Token manquant" }, 
        { status: 400 }
      )
    }

    if (!newPassword) {
      console.log("❌ [ACTIVATE] Nouveau mot de passe manquant")
      return NextResponse.json(
        { success: false, error: "Nouveau mot de passe requis" }, 
        { status: 400 }
      )
    }

    // ✅ Vérification du token JWT
    let payload: ActivatePayload
    try {
      console.log("🔐 [ACTIVATE] Vérification du JWT...")
      payload = jwt.verify(token, JWT_SECRET) as ActivatePayload
      console.log("✅ [ACTIVATE] Token valide - userId:", payload.userId)
    } catch (err: any) {
      console.error("❌ [ACTIVATE] Token invalide:", err.message)
      return NextResponse.json(
        { success: false, error: "Token invalide ou expiré" }, 
        { status: 401 }
      )
    }

    // ✅ Vérifier que c'est bien un token d'activation
    if (payload.type !== 'activation') {
      console.log("❌ [ACTIVATE] Type de token invalide:", payload.type)
      return NextResponse.json(
        { success: false, error: "Type de token invalide" }, 
        { status: 401 }
      )
    }

    // ✅ Recherche de l'utilisateur
    const db = await getDataSource()
    const userRepo = db.getRepository(User)
    const user = await userRepo.findOne({ where: { id: payload.userId } })

    if (!user) {
      console.log("❌ [ACTIVATE] Utilisateur introuvable:", payload.userId)
      return NextResponse.json(
        { success: false, error: "Utilisateur introuvable" }, 
        { status: 404 }
      )
    }

    console.log("👤 [ACTIVATE] Utilisateur trouvé:", user.email)

    // ✅ Vérifier que le compte n'est pas déjà activé
    if (user.isActive && !user.motDePasseTemporaire) {
      console.log("⚠️ [ACTIVATE] Compte déjà activé")
      return NextResponse.json({ 
        success: false, 
        error: "Le compte est déjà activé" 
      }, { status: 400 })
    }

    // ✅ Hacher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword)
    
    // ✅ Activer le compte et mettre à jour le mot de passe
    user.password = hashedPassword
    user.motDePasseTemporaire = false
    user.isActive = true
    user.activationToken = undefined  // ✅ undefined au lieu de null
    user.activationTokenExpires = undefined
    await userRepo.save(user)
    
    console.log("✅ [ACTIVATE] Compte activé avec succès pour:", user.email)

    return NextResponse.json({ 
      success: true, 
      message: "Compte activé avec succès !" 
    }, { status: 200 })

  } catch (err: any) {
    console.error("💥 [ACTIVATE] Erreur:", err)
    return NextResponse.json(
      { success: false, error: "Erreur serveur" }, 
      { status: 500 }
    )
  }
}