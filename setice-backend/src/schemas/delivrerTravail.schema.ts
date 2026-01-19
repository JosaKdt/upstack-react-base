// src/schemas/deliverTravail.schema.ts
import { z } from 'zod'

export const deliverTravailSchema = z.object({
  assignationId: z.string().uuid("ID d'assignation invalide"),
  texte: z.string().optional(),
  fichierUrl: z.string().url("URL du fichier invalide").optional(),
})
  .refine((data) => data.texte || data.fichierUrl, {
    message: "Vous devez fournir soit un texte, soit un fichier",
  })
