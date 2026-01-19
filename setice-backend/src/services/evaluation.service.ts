import { User, Role } from '@/src/entities/User'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'
import { assignationRepository } from '@/src/repositories/assignation.repository'

interface EvaluateTravailInput {
  assignationId: string
  note: number
  commentaire?: string
  formateur: User
}

export async function evaluateTravail(input: EvaluateTravailInput) {
  if (input.formateur.role !== Role.FORMATEUR) {
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent évaluer')
  }

  const assign = await assignationRepository.findById(input.assignationId)
  if (!assign) throw new Error('ASSIGNATION_NOT_FOUND')
  if (assign.statut !== 'LIVRE') throw new Error('Le travail n’a pas encore été livré')

  if (input.note > assign.travail.bareme) {
    throw new Error(`NOTE_EXCEEDED: La note ne peut pas dépasser le barème de ${assign.travail.bareme}`)
  }

  const evaluation = await evaluationRepository.create({
    assignation: assign,
    note: input.note,
    commentaire: input.commentaire,
    formateur: input.formateur,
  })

  await assignationRepository.markAsEvaluated(input.assignationId)
  return evaluation
}

export async function listEvaluationsByAssignation(assignationId: string) {
  return evaluationRepository.listByAssignation(assignationId)
}
