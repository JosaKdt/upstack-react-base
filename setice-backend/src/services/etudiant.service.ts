// src/services/etudiant.service.ts
import { getDataSource } from '@/src/lib/db' // ✅ Changez aussi ça
import {  Role } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import { CreateEtudiantInput } from '@/src/schemas/etudiant.schema'
import { generateMatricule } from '../lib/etudiant.utils'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail'

// ✅ IMPORTANT : Utilisez NEXTAUTH_SECRET (pas JWT_SECRET)
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

// src/services/etudiant.service.ts

export async function createEtudiant(input: CreateEtudiantInput) {
  const db = await getDataSource()

  const { User } = await import('@/src/entities/User')
  const { Etudiant } = await import('@/src/entities/Etudiant')
  const { Promotion } = await import('@/src/entities/Promotion')

  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Vérifier promotion
  const promotion = await promotionRepo.findOne({
    where: { id: input.promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  // 2️⃣ Vérifier email
  const exists = await userRepo.findOne({
    where: { email: input.email },
  })

  if (exists) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 3️⃣ Mot de passe temporaire
  const tempPassword = input.temporaryPassword || generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 4️⃣ Créer User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.ETUDIANT,
    motDePasseTemporaire: true,
    isActive: false
  })

  await userRepo.save(user)

  // 5️⃣ ✅ GÉNÉRER LE TOKEN ICI (AVANT de l'utiliser !)
  console.log('🔐 [SERVICE] Génération token avec secret:', JWT_SECRET.substring(0, 10) + '...')
  
  const token = jwt.sign(
    { 
      userId: user.id,
      type: 'activation'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  console.log('✅ [SERVICE] Token généré:', token.substring(0, 30) + '...')

  // 6️⃣ Sauvegarder le token dans la BDD
  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

  // 7️⃣ Générer un matricule unique
  let studentNumber = await etudiantRepo.count({ where: { promotion } }) + 1
  let matricule: string
  let existing: Etudiant | null = null

  do {
    matricule = generateMatricule(promotion.code, studentNumber)
    existing = await etudiantRepo.findOne({ where: { matricule } })
    studentNumber++
  } while (existing)

  // 8️⃣ Créer l'étudiant
  const etudiant = etudiantRepo.create({
    user,
    promotion,
    matricule,
  })
  
  await etudiantRepo.save(etudiant)

  // 9️⃣ ✅ MAINTENANT vous pouvez envoyer l'email (token existe maintenant)
  try {
    await sendActivationEmail(user.email, matricule, tempPassword, token)
    console.log('✅ [SERVICE] Email d\'activation envoyé à:', user.email)
  } catch (emailError) {
    console.error('❌ [SERVICE] Erreur envoi email:', emailError)
    // Ne pas bloquer la création si l'email échoue
  }

  // 🔟 Retourner un objet FLAT
  return {
    id: etudiant.id,
    matricule: matricule,
    userId: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    motDePasseTemporaire: true,
    temporaryPassword: tempPassword,
    activationToken: token,
    promotionId: promotion.id,
    promotionCode: promotion.code,
    promotionLibelle: promotion.libelle,
    promotionAnnee: promotion.annee,
  }
}