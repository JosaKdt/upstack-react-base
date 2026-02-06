// src/services/formateur.service.ts
import { getDataSource } from '@/src/lib/db'
import { Role } from '@/src/entities/User'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-setice-universite'

export interface CreateFormateurInput {
  nom: string
  prenom: string
  email: string
  specialite?: string
}

export async function createFormateur(input: CreateFormateurInput) {
  const db = await getDataSource()

  const { User } = await import('@/src/entities/User')
  const { Formateur } = await import('@/src/entities/Formateur')

  const userRepo = db.getRepository(User)
  const formateurRepo = db.getRepository(Formateur)

  // 1️⃣ Vérifier si l'email existe déjà
  const existingUser = await userRepo.findOne({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 2️⃣ Générer mot de passe temporaire
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  console.log('🔑 [FORMATEUR-SERVICE] Mot de passe temporaire généré:', tempPassword)

  // 3️⃣ Créer le User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.FORMATEUR,
    motDePasseTemporaire: true,
    isActive: false,
  })

  await userRepo.save(user)

  // 4️⃣ Générer le token d'activation JWT
  console.log('🔐 [FORMATEUR-SERVICE] JWT_SECRET présent?', !!JWT_SECRET)
  
  const token = jwt.sign(
    { 
      userId: user.id,
      type: 'activation'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  console.log('✅ [FORMATEUR-SERVICE] Token généré (preview):', token.substring(0, 50) + '...')
  console.log('✅ [FORMATEUR-SERVICE] Token length:', token.length)

  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

  // 5️⃣ Créer le Formateur lié au User
  const formateur = formateurRepo.create({
    user,
    specialite: input.specialite || null,
  })

  await formateurRepo.save(formateur)

  // 6️⃣ Envoyer l'email d'activation
  try {
    console.log('📧 [FORMATEUR-SERVICE] Envoi email avec:')
    console.log('   - Email:', user.email)
    console.log('   - TempPassword:', tempPassword)
    console.log('   - Token (preview):', token.substring(0, 30) + '...')
    
    await sendActivationEmail(user.email, tempPassword, token)
    
    console.log('✅ [FORMATEUR-SERVICE] Email d\'activation envoyé à:', user.email)
  } catch (emailError) {
    console.error('❌ [FORMATEUR-SERVICE] Erreur envoi email:', emailError)
  }

  // 7️⃣ Retourner la structure cohérente
  return {
    id: formateur.id,
    actif: !user.motDePasseTemporaire && user.isActive,
    specialite: formateur.specialite,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    },
    _debug: {
      temporaryPassword: tempPassword,
      activationToken: token,
    }
  }
}

export async function getFormateurs() {
  const db = await getDataSource()
  
  const { Formateur } = await import('@/src/entities/Formateur')
  
  const formateurRepo = db.getRepository(Formateur)

  const formateurs = await formateurRepo
    .createQueryBuilder('formateur')
    .leftJoinAndSelect('formateur.user', 'user')
    .getMany()

  console.log('📦 Formateurs chargés:', formateurs.length)
  
  return formateurs.map((f) => {
    if (!f.user) {
      console.error('⚠️ Formateur sans user:', f.id)
      return null
    }
    
    return {
      id: f.id,
      actif: !f.user.motDePasseTemporaire && f.user.isActive,
      specialite: f.specialite,
      user: {
        id: f.user.id,
        nom: f.user.nom,
        prenom: f.user.prenom,
        email: f.user.email,
        role: f.user.role,
      },
    }
  }).filter(Boolean)
}

// ✅ DELETE FORMATEUR - Version simple qui marche avec nullable: true
export async function deleteFormateur(formateurId: string) {
  const db = await getDataSource()
  
  const { User } = await import('@/src/entities/User')
  const { Formateur } = await import('@/src/entities/Formateur')
  const { EspacePedagogique } = await import('@/src/entities/EspacePedagogique')

  const formateurRepo = db.getRepository(Formateur)
  const userRepo = db.getRepository(User)
  const espaceRepo = db.getRepository(EspacePedagogique)

  // 1️⃣ Trouver le formateur avec son user
  const formateur = await formateurRepo.findOne({
    where: { id: formateurId },
    relations: ['user'],
  })

  if (!formateur) {
    throw new Error('FORMATEUR_NOT_FOUND')
  }

  console.log('🗑️ [FORMATEUR-SERVICE] Suppression formateur:', formateurId)

  // 2️⃣ IMPORTANT: Mettre à NULL le formateur dans les espaces pédagogiques
  // Maintenant que nullable: true, TypeORM accepte SET NULL
  try {
    const espacesUpdated = await espaceRepo
      .createQueryBuilder()
      .update()
      .set({ formateur: null })
      .where('formateurId = :formateurId', { formateurId })
      .execute()

    console.log('✅ [FORMATEUR-SERVICE] Espaces désassignés:', espacesUpdated.affected)
  } catch (error) {
    console.error('❌ [FORMATEUR-SERVICE] Erreur désassignation espaces:', error)
    throw new Error('ERREUR_DESASSIGNATION_ESPACES')
  }

  // 3️⃣ Supprimer le formateur
  await formateurRepo.remove(formateur)

  // 4️⃣ Supprimer le user associé
  if (formateur.user) {
    await userRepo.remove(formateur.user)
  }

  console.log('✅ [FORMATEUR-SERVICE] Formateur supprimé, espaces conservés:', formateurId)
  
  return { success: true }
}

// ✅ UPDATE FORMATEUR
export async function updateFormateur(
  formateurId: string,
  input: Partial<{
    nom: string
    prenom: string
    email: string
    specialite: string
  }>
) {
  const db = await getDataSource()
  
  const { User } = await import('@/src/entities/User')
  const { Formateur } = await import('@/src/entities/Formateur')
  
  const formateurRepo = db.getRepository(Formateur)
  const userRepo = db.getRepository(User)

  // 1️⃣ Trouver le formateur avec son user
  const formateur = await formateurRepo.findOne({
    where: { id: formateurId },
    relations: ['user'],
  })

  if (!formateur || !formateur.user) {
    throw new Error('FORMATEUR_NOT_FOUND')
  }

  // 2️⃣ Vérifier si l'email est déjà utilisé par un autre user
  if (input.email && input.email !== formateur.user.email) {
    const existingUser = await userRepo.findOne({
      where: { email: input.email },
    })

    if (existingUser && existingUser.id !== formateur.user.id) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
  }

  // 3️⃣ Mettre à jour le User
  if (input.nom) formateur.user.nom = input.nom
  if (input.prenom) formateur.user.prenom = input.prenom
  if (input.email) formateur.user.email = input.email

  await userRepo.save(formateur.user)

  // 4️⃣ Mettre à jour le Formateur
  if (input.specialite !== undefined) {
    formateur.specialite = input.specialite || null
  }

  await formateurRepo.save(formateur)

  console.log('✅ [FORMATEUR-SERVICE] Formateur mis à jour:', formateurId)

  // 5️⃣ Retourner la structure cohérente
  return {
    id: formateur.id,
    actif: !formateur.user.motDePasseTemporaire && formateur.user.isActive,
    specialite: formateur.specialite,
    user: {
      id: formateur.user.id,
      nom: formateur.user.nom,
      prenom: formateur.user.prenom,
      email: formateur.user.email,
      role: formateur.user.role,
    },
  }
}