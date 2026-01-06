import { z } from 'zod'

export const createMatiereSchema = z.object({
  code: z.string().optional(),  // ← optionnel
  libelle: z.string().min(1, 'Le libellé est requis')
})

export type CreateMatiereDto = z.infer<typeof createMatiereSchema>