import { z } from 'zod'

// ✅ Schéma pour la création
export const createFormateurSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  specialite: z.string().optional(),
  temporaryPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
})

// ✅ Schéma pour la mise à jour (tous les champs sont optionnels)
export const updateFormateurSchema = z.object({
  id: z.string().uuid("ID invalide"),
  nom: z.string().min(1, "Le nom est requis").optional(),
  prenom: z.string().min(1, "Le prénom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  specialite: z.string().optional(),
})

export type CreateFormateurInput = z.infer<typeof createFormateurSchema>
export type UpdateFormateurInput = z.infer<typeof updateFormateurSchema>