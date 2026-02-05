import { z } from 'zod'

// ✅ Schéma pour la création
export const createPromotionSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  libelle: z.string().min(1, "Le libellé est requis"),
  annee: z.string().regex(/^\d{4}$/, "L'année doit être au format YYYY"),
})

// ✅ Schéma pour la mise à jour (tous les champs sont optionnels)
export const updatePromotionSchema = z.object({
  id: z.string().uuid("ID invalide"),
  code: z.string().min(1, "Le code est requis").optional(),
  libelle: z.string().min(1, "Le libellé est requis").optional(),
  annee: z.string().regex(/^\d{4}$/, "L'année doit être au format YYYY").optional(),
})

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>