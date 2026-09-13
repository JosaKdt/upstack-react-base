// src/services/evaluation.service.ts
import { User, Role } from '@/src/entities/User'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'
import { assignationRepository } from '@/src/repositories/assignation.repository'

interface EvaluateTravailInput {
  assignationId: string
  note: number
  commentaire?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formateur: any // Token JWT décodé (peut contenir userId ou id)
}

export async function evaluateTravail(input: EvaluateTravailInput) {
  console.log("")
  console.log("📝 [SERVICE] ========================================")
  console.log("📝 [SERVICE] evaluateTravail - DÉBUT")
  console.log("📝 [SERVICE] ========================================")
  console.log("📝 [SERVICE] Input reçu:", {
    assignationId: input.assignationId,
    note: input.note,
    commentaire: input.commentaire ? input.commentaire.substring(0, 50) + '...' : 'Aucun',
    formateur: {
      id: input.formateur.id,
      userId: input.formateur.userId,
      role: input.formateur.role
    }
  })

  // ✅ 1. Vérification du rôle
  console.log("🔐 [SERVICE] Vérification du rôle...")
  if (input.formateur.role !== Role.FORMATEUR && input.formateur.role !== 'FORMATEUR') {
    console.error("❌ [SERVICE] FORBIDDEN - Rôle:", input.formateur.role)
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent évaluer')
  }
  console.log("✅ [SERVICE] Rôle valide: FORMATEUR")

  // ✅ 2. Récupération de l'assignation
  console.log("📥 [SERVICE] Récupération de l'assignation:", input.assignationId)
  const assign = await assignationRepository.findById(input.assignationId)
  
  if (!assign) {
    console.error("❌ [SERVICE] ASSIGNATION_NOT_FOUND:", input.assignationId)
    throw new Error('ASSIGNATION_NOT_FOUND')
  }

  console.log("✅ [SERVICE] Assignation trouvée:", {
    id: assign.id,
    statut: assign.statut,
    etudiantNom: assign.etudiant?.user?.nom,
    etudiantPrenom: assign.etudiant?.user?.prenom,
    travailTitre: assign.travail?.titre,
    travailBareme: assign.travail?.bareme
  })

  // ✅ 3. Vérification du statut
  console.log("🔍 [SERVICE] Vérification du statut...")
  if (assign.statut !== 'LIVRE') {
    console.error("❌ [SERVICE] Statut invalide:", {
      attendu: 'LIVRE',
      actuel: assign.statut
    })
    throw new Error('Le travail n\'a pas encore été livré')
  }
  console.log("✅ [SERVICE] Statut valide: LIVRE")

  // ✅ 4. Vérification du barème
  console.log("🔍 [SERVICE] Vérification du barème...")
  if (input.note > assign.travail.bareme) {
    console.error("❌ [SERVICE] NOTE_EXCEEDED:", {
      note: input.note,
      bareme: assign.travail.bareme
    })
    throw new Error(`NOTE_EXCEEDED: La note ne peut pas dépasser le barème de ${assign.travail.bareme}`)
  }
  console.log("✅ [SERVICE] Note valide:", input.note, "/", assign.travail.bareme)

  // ✅ 5. Récupération de l'entité User du formateur
  console.log("👤 [SERVICE] Récupération de l'entité User du formateur...")
  const { getDataSource } = await import('@/src/lib/db')
  const db = await getDataSource()
  const userRepo = db.getRepository(User)
  
  // Le token peut contenir soit userId soit id
  const formateurId = input.formateur.userId || input.formateur.id
  console.log("👤 [SERVICE] ID du formateur à rechercher:", formateurId)
  
  const formateurUser = await userRepo.findOne({ where: { id: formateurId } })
  
  if (!formateurUser) {
    console.error("❌ [SERVICE] Formateur non trouvé dans la base:", formateurId)
    throw new Error('FORMATEUR_NOT_FOUND: Utilisateur non trouvé dans la base de données')
  }

  console.log("✅ [SERVICE] Formateur trouvé:", {
    id: formateurUser.id,
    nom: formateurUser.nom,
    prenom: formateurUser.prenom,
    role: formateurUser.role
  })

  // ✅ 6. Création de l'évaluation
  console.log("💾 [SERVICE] Création de l'évaluation...")
  const evaluation = await evaluationRepository.create({
    assignation: assign,
    note: input.note,
    commentaire: input.commentaire,
    formateur: formateurUser,
  })

  console.log("✅ [SERVICE] Évaluation créée avec succès:", {
    id: evaluation.id,
    note: evaluation.note,
    dateEvaluation: evaluation.dateEvaluation
  })

  // ✅ 7. Mise à jour du statut de l'assignation
  console.log("🔄 [SERVICE] Mise à jour du statut de l'assignation...")
  await assignationRepository.markAsEvaluated(input.assignationId)
  console.log("✅ [SERVICE] Assignation marquée comme EVALUE")

  console.log("🏁 [SERVICE] evaluateTravail - FIN AVEC SUCCÈS")
  console.log("📝 [SERVICE] ========================================")
  console.log("")

  return evaluation
}

export async function listEvaluationsByAssignation(assignationId: string) {
  console.log("📋 [SERVICE] listEvaluationsByAssignation:", assignationId)
  const evaluations = await evaluationRepository.listByAssignation(assignationId)
  console.log("✅ [SERVICE] Évaluations trouvées:", evaluations.length)
  return evaluations
}