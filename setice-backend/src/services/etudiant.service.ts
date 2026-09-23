import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import { CreateEtudiantInput } from '@/src/schemas/etudiant.schema'
import { generateMatricule } from '../lib/etudiant.utils'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail'



export async function createEtudiant(input: CreateEtudiantInput) {
  const db = await getDataSource()

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
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 4️⃣ Créer User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.ETUDIANT,
    motDePasseTemporaire: true,
  } as Partial<User>)

  await userRepo.save(user)


  // 5️⃣ Générer le token d'activation JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )

  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

   // Générer le matricule automatique
  // Générer un matricule unique
let studentNumber = await etudiantRepo.count({ where: { promotion } }) + 1
let matricule: string
let existing: Etudiant | null = null

do {
  matricule = generateMatricule(promotion.code, studentNumber)
  existing = await etudiantRepo.findOne({ where: { matricule } })
  studentNumber++
} while (existing)



  const insertResult = await etudiantRepo.insert({
    user: { id: user.id } as User,
    promotion: { id: promotion.id } as Promotion,
    matricule,
  })

  const etudiant = await etudiantRepo.findOneByOrFail({
    id: insertResult.identifiers[0].id,
  })

  await sendActivationEmail(user.email, matricule, tempPassword, token)

  return {
    id: etudiant.id,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      motDePasseTemporaire: true,
      temporaryPassword: tempPassword,
    },
    promotion: {
      id: promotion.id,
      code: promotion.code,
      libelle: promotion.libelle,
      annee: promotion.annee,
    },
    matricule,
  }

}
export async function getEtudiants() {
  const db = await getDataSource()
  const etudiantRepo = db.getRepository(Etudiant)

  const etudiants = await etudiantRepo.find({
    relations: ['user', 'promotion'], // On récupère le user et la promotion
  })

  // Optionnel : formater les données comme le frontend l'attend
  return etudiants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    
    user: {
      id: e.user.id,
      nom: e.user.nom,
      prenom: e.user.prenom,
      email: e.user.email,

    },
    promotion: {
      id: e.promotion.id,
      code: e.promotion.code,
      libelle: e.promotion.libelle,
      annee: e.promotion.annee,
    },
  }))
}


export interface UpdateEtudiantInput {
  nom: string
  prenom: string
  email: string
  promotionId: string
}

export async function updateEtudiant(id: string, input: UpdateEtudiantInput) {
  const db = await getDataSource()
  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)
  const promotionRepo = db.getRepository(Promotion)

  const etudiant = await etudiantRepo.findOne({
    where: { id },
    relations: ['user', 'promotion'],
  })

  if (!etudiant) {
    throw new Error('ETUDIANT_NOT_FOUND')
  }

  const promotion = await promotionRepo.findOne({
    where: { id: input.promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  const emailOwner = await userRepo.findOne({ where: { email: input.email } })
  if (emailOwner && emailOwner.id !== etudiant.user.id) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  await userRepo.update(etudiant.user.id, {
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
  })

  await etudiantRepo.update(etudiant.id, {
    promotion: { id: promotion.id } as Promotion,
  })

  const updated = await etudiantRepo.findOne({
    where: { id },
    relations: ['user', 'promotion'],
  })

  return {
    id: updated!.id,
    matricule: updated!.matricule,
    user: {
      id: updated!.user.id,
      nom: updated!.user.nom,
      prenom: updated!.user.prenom,
      email: updated!.user.email,
    },
    promotion: {
      id: updated!.promotion.id,
      code: updated!.promotion.code,
      libelle: updated!.promotion.libelle,
      annee: updated!.promotion.annee,
    },
  }
}

export async function deleteEtudiant(id: string) {
  const db = await getDataSource()
  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)

  const etudiant = await etudiantRepo.findOne({
    where: { id },
    relations: ['user'],
  })

  if (!etudiant) {
    throw new Error('ETUDIANT_NOT_FOUND')
  }

  const userId = etudiant.user.id

  await etudiantRepo.delete(etudiant.id)
  await userRepo.delete(userId)

  return { success: true }
}