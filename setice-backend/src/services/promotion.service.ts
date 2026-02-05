console.log('🟠 [SERVICE-PROMOTION] 1. Début chargement promotion.service.ts')

import { getDataSource } from '../lib/db'
import { promotionRepository } from '../repositories/promotion.repository'

console.log('🟠 [SERVICE-PROMOTION] 2. Repository importé avec succès')

export async function createPromotion(input: {
  code: string
  libelle: string
  annee: string
}) {
  console.log('🟠 [SERVICE-PROMOTION] createPromotion appelé avec:', input)
  
  const exists = await promotionRepository.findByCode(input.code)
  if (exists) {
    console.log('⚠️ [SERVICE-PROMOTION] Promotion existe déjà:', input.code)
    throw new Error('PROMOTION_ALREADY_EXISTS')
  }

  console.log('🟠 [SERVICE-PROMOTION] Création de la promotion...')
  return promotionRepository.create(input)
}

export async function getPromotions() {
  console.log('🟠 [SERVICE-PROMOTION] getPromotions appelé')
  return promotionRepository.findAll()
}

console.log('✅ [SERVICE-PROMOTION] 3. Service défini avec succès')

// ✅ AJOUTE CETTE FONCTION - DELETE PROMOTION
export async function deletePromotion(promotionId: string) {
  const db = await getDataSource()
  
  const { Promotion } = await import('@/src/entities/Promotion')
  
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Trouver la promotion
  const promotion = await promotionRepo.findOne({
    where: { id: promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  // 2️⃣ Vérifier si la promotion a des étudiants
  // (optionnel - tu peux empêcher la suppression si elle a des étudiants)
  const { Etudiant } = await import('@/src/entities/Etudiant')
  const etudiantRepo = db.getRepository(Etudiant)
  
  const etudiantsCount = await etudiantRepo.count({
    where: { promotion: { id: promotionId } }
  })

  if (etudiantsCount > 0) {
    throw new Error('PROMOTION_HAS_STUDENTS')
  }

  // 3️⃣ Supprimer la promotion
  await promotionRepo.remove(promotion)

  console.log('✅ [PROMOTION-SERVICE] Promotion supprimée:', promotionId)
  
  return { success: true }
}

// ✅ AJOUTE CETTE FONCTION - UPDATE PROMOTION
export async function updatePromotion(
  promotionId: string,
  input: Partial<{
    code: string
    libelle: string
    annee: string
  }>
) {
  const db = await getDataSource()
  
  const { Promotion } = await import('@/src/entities/Promotion')
  
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Trouver la promotion
  const promotion = await promotionRepo.findOne({
    where: { id: promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  // 2️⃣ Vérifier si le code est déjà utilisé par une autre promotion
  if (input.code && input.code !== promotion.code) {
    const existingPromotion = await promotionRepo.findOne({
      where: { code: input.code },
    })

    if (existingPromotion && existingPromotion.id !== promotionId) {
      throw new Error('CODE_ALREADY_EXISTS')
    }
  }

  // 3️⃣ Mettre à jour la promotion
  if (input.code) promotion.code = input.code
  if (input.libelle) promotion.libelle = input.libelle
  if (input.annee) promotion.annee = input.annee

  await promotionRepo.save(promotion)

  console.log('✅ [PROMOTION-SERVICE] Promotion mise à jour:', promotionId)

  // 4️⃣ Retourner la structure cohérente
  return {
    id: promotion.id,
    code: promotion.code,
    libelle: promotion.libelle,
    annee: promotion.annee,
  }
}