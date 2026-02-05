import { z } from 'zod'

export const createMatiereSchema = z.object({
  code: z.string().optional(),
  libelle: z.string().min(1, 'Le libellé est requis'),
  credits: z.number().optional()
})

// ✅ Schéma pour la mise à jour
export const updateMatiereSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  code: z.string().optional(),
  libelle: z.string().min(1, 'Le libellé est requis').optional(),
  credits: z.number().optional()
})

export type CreateMatiereDto = z.infer<typeof createMatiereSchema>
export type UpdateMatiereDto = z.infer<typeof updateMatiereSchema>