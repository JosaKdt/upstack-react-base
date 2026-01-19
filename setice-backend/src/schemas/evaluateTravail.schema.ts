// src/schemas/evaluateTravail.schema.ts
import { z } from 'zod'

export const evaluateTravailSchema = z.object({
  assignationId: z.string().uuid("ID d'assignation invalide"),
  note: z.number().min(0, "La note doit être positive"),
  commentaire: z.string().optional(),
})
