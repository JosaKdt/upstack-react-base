import { z } from 'zod'

export const createEtudiantSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  promotionId: z.string().uuid(),
   temporaryPassword: z.string().min(6).optional(),
})

export const updateEtudiantSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').optional(),
  prenom: z.string().min(1, 'Le prénom est requis').optional(),
  email: z.string().email('Email invalide').optional(),
  promotionId: z.string().optional(),
  matricule: z.string().optional(),
})

export type CreateEtudiantInput = z.infer<typeof createEtudiantSchema>
export type UpdateEtudiantInput = z.infer<typeof updateEtudiantSchema>