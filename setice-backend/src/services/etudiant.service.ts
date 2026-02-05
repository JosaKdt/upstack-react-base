// src/services/etudiant.service.ts
import { getDataSource } from '@/src/lib/db'
import {  Role } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import { CreateEtudiantInput, UpdateEtudiantInput } from '@/src/schemas/etudiant.schema'
import { generateMatricule } from '../lib/etudiant.utils'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail'

// ✅ IMPORTANT : Utilisez NEXTAUTH_SECRET (pas JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET!


export async function createEtudiant(input: CreateEtudiantInput) {
  const db = await getDataSource()

  // ✅ Import dynamique
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

  // 5️⃣ Générer le token d'activation JWT
  // Dans etudiant.service.ts, ligne ~50

// ✅ Vérifiez que JWT_SECRET est bien défini
console.log('🔐 [SERVICE] JWT_SECRET présent?', !!JWT_SECRET)
console.log('🔐 [SERVICE] JWT_SECRET preview:', JWT_SECRET?.substring(0, 10) + '...')

const token = jwt.sign(
  { 
    userId: user.id,
    type: 'activation'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
)

console.log('✅ [SERVICE] Token généré (preview):', token.substring(0, 50) + '...')
console.log('✅ [SERVICE] Token complet length:', token.length)
  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

  // 6️⃣ Générer un matricule unique
  let studentNumber = await etudiantRepo.count({ where: { promotion } }) + 1
  let matricule: string
  let existing: Etudiant | null = null

  do {
    matricule = generateMatricule(promotion.code, studentNumber)
    existing = await etudiantRepo.findOne({ where: { matricule } })
    studentNumber++
  } while (existing)

  // 7️⃣ Créer l'étudiant
  const etudiant = etudiantRepo.create({
    user,
    promotion,
    matricule,
  })
  
  await etudiantRepo.save(etudiant)

  // 8️⃣ Envoyer l'email d'activation
  try {
    await sendActivationEmail(user.email,  tempPassword, token)
    console.log('✅ [SERVICE] Email d\'activation envoyé à:', user.email)
  } catch (emailError) {
    console.error('❌ [SERVICE] Erreur envoi email:', emailError)
    // Ne pas bloquer la création si l'email échoue
  }

  // 9️⃣ Retourner un objet FLAT
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

export async function getEtudiants() {
  const db = await getDataSource()
  
  // ✅ Import dynamique
  const { Etudiant } = await import('@/src/entities/Etudiant')
  
  const etudiantRepo = db.getRepository(Etudiant)

  const etudiants = await etudiantRepo.find({
    relations: ['user', 'promotion'],
  })

  return etudiants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    userId: e.user.id,
    nom: e.user.nom,
    prenom: e.user.prenom,
    email: e.user.email,
    role: e.user.role,
    motDePasseTemporaire: e.user.motDePasseTemporaire,
    actif: !e.user.motDePasseTemporaire && e.user.isActive,
    promotionId: e.promotion.id,
    promotionCode: e.promotion.code,
    promotionLibelle: e.promotion.libelle,
    promotionAnnee: e.promotion.annee,
    createdAt: e.user.createdAt.toISOString(),
    updatedAt: e.user.updatedAt.toISOString(),
  }))
}

// ✅ NOUVELLE FONCTION UPDATE
export async function updateEtudiant(id: string, input: UpdateEtudiantInput) {
  const db = await getDataSource()

  // ✅ Import dynamique
  const { User } = await import('@/src/entities/User')
  const { Etudiant } = await import('@/src/entities/Etudiant')
  const { Promotion } = await import('@/src/entities/Promotion')

  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Trouver l'étudiant
  const etudiant = await etudiantRepo.findOne({
    where: { id },
    relations: ['user', 'promotion'],
  })

  if (!etudiant) {
    throw new Error('ETUDIANT_NOT_FOUND')
  }

  // 2️⃣ Mettre à jour les infos du user
  if (input.nom) etudiant.user.nom = input.nom
  if (input.prenom) etudiant.user.prenom = input.prenom
  if (input.email) {
    // Vérifier si l'email n'est pas déjà pris par un autre user
    const emailExists = await userRepo.findOne({
      where: { email: input.email },
    })
    if (emailExists && emailExists.id !== etudiant.user.id) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
    etudiant.user.email = input.email
  }

  await userRepo.save(etudiant.user)

  // 3️⃣ Mettre à jour la promotion si fournie
  if (input.promotionId) {
    const promotion = await promotionRepo.findOne({
      where: { id: input.promotionId },
    })

    if (!promotion) {
      throw new Error('PROMOTION_NOT_FOUND')
    }

    etudiant.promotion = promotion
  }

  // 4️⃣ Mettre à jour le matricule si fourni
  if (input.matricule) {
    // Vérifier si le matricule n'est pas déjà pris
    const matriculeExists = await etudiantRepo.findOne({
      where: { matricule: input.matricule },
    })
    if (matriculeExists && matriculeExists.id !== etudiant.id) {
      throw new Error('MATRICULE_ALREADY_EXISTS')
    }
    etudiant.matricule = input.matricule
  }

  await etudiantRepo.save(etudiant)

  // 5️⃣ Recharger avec les relations
  const updated = await etudiantRepo.findOne({
    where: { id },
    relations: ['user', 'promotion'],
  })

  // 6️⃣ Retourner un objet FLAT
  return {
    id: updated!.id,
    matricule: updated!.matricule,
    userId: updated!.user.id,
    nom: updated!.user.nom,
    prenom: updated!.user.prenom,
    email: updated!.user.email,
    role: updated!.user.role,
    actif: !updated!.user.motDePasseTemporaire && updated!.user.isActive,
    promotionId: updated!.promotion.id,
    promotionCode: updated!.promotion.code,
    promotionLibelle: updated!.promotion.libelle,
    promotionAnnee: updated!.promotion.annee,
    updatedAt: updated!.user.updatedAt.toISOString(),
  }
}

// ✅ NOUVELLE FONCTION DELETE
export async function deleteEtudiant(id: string) {
  const db = await getDataSource()

  // ✅ Import dynamique
  const { User } = await import('@/src/entities/User')
  const { Etudiant } = await import('@/src/entities/Etudiant')

  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)

  // 1️⃣ Trouver l'étudiant
  const etudiant = await etudiantRepo.findOne({
    where: { id },
    relations: ['user'],
  })

  if (!etudiant) {
    throw new Error('ETUDIANT_NOT_FOUND')
  }

  // 2️⃣ Supprimer l'étudiant d'abord (à cause de la contrainte FK)
  await etudiantRepo.remove(etudiant)

  // 3️⃣ Supprimer le user
  await userRepo.remove(etudiant.user)

  return { success: true }
}