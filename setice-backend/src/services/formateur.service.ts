// src/services/formateur.service.ts
import { getDataSource } from '@/src/lib/db'
import { Role } from '@/src/entities/User'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail' // ✅ CORRIGÉ : mail au lieu de mail-form

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
      type: 'activation'  // ✅ AJOUTÉ : type activation
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
    
    await sendActivationEmail(user.email, tempPassword, token)  // ✅ Ordre correct
    
    console.log('✅ [FORMATEUR-SERVICE] Email d\'activation envoyé à:', user.email)
  } catch (emailError) {
    console.error('❌ [FORMATEUR-SERVICE] Erreur envoi email:', emailError)
    // Ne pas bloquer la création si l'email échoue
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
    // Info pour le debug
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

  // ✅ Charger les formateurs avec leurs users
  const formateurs = await formateurRepo
    .createQueryBuilder('formateur')
    .leftJoinAndSelect('formateur.user', 'user')
    .getMany()

  console.log('📦 Formateurs chargés:', formateurs.length)
  
  // ✅ Retourner la structure avec user imbriqué
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
  }).filter(Boolean) // Enlever les nulls
}