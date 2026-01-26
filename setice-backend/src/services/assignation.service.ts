/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/assignation.service.ts
import { Role } from '@/src/entities/User'
import { assignationRepository } from '@/src/repositories/assignation.repository'

interface AssignTravailInput {
  travail: any  // ✅ Utilisez any
  etudiant: any  // ✅ Utilisez any
  formateur: any  // ✅ Utilisez any
}

export async function assignTravail(input: AssignTravailInput) {
  if (input.formateur.role !== Role.FORMATEUR) {
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent assigner un travail')
  }

  const etudiants = input.travail.espacePedagogique?.etudiants || []
  const inscrit = etudiants.some((e: any) => e.id === input.etudiant.id)
  
  if (!inscrit) {
    console.log('❌ Étudiant non inscrit:', {
      etudiantId: input.etudiant.id,
      espaceId: input.travail.espacePedagogique?.id,
      etudiantsInscrits: etudiants.map((e: any) => e.id),
    })
    throw new Error('ETUDIANT_NOT_INSCRIT')
  }

  const assignation = await assignationRepository.create({
    travail: input.travail,
    etudiant: input.etudiant,
    formateur: input.formateur
  })

  return assignation
}

export async function deliverTravail(assignationId: string, student: any) {
  if (student.role !== Role.ETUDIANT) {
    throw new Error('FORBIDDEN: Seuls les étudiants peuvent livrer un travail')
  }

  const assign = await assignationRepository.findById(assignationId)
  if (!assign) throw new Error('ASSIGNATION_NOT_FOUND')
  if (assign.etudiant.user.id !== student.id) {
    throw new Error('FORBIDDEN: Vous ne pouvez pas livrer le travail')
  }

  if (new Date() > assign.travail.dateLimite) {
    throw new Error('DATE_EXCEEDED: La date limite est dépassée')
  }

  return assignationRepository.markAsDelivered(assignationId)
}

export async function listAssignationsByEtudiant(etudiantId: string) {
  return assignationRepository.listByEtudiantWithPromotionFilter(etudiantId)
}

export async function listAssignationsByTravail(travailId: string) {
  return assignationRepository.listByTravail(travailId)
}