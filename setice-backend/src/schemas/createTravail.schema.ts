// src/schemas/createTravail.schema.ts
import { z } from 'zod'
import { TypeTravail } from '../entities/Travail'

export const createTravailSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  consignes: z.string().min(5, "Les consignes doivent être précisées"),
  type: z.nativeEnum(TypeTravail),
  dateLimite: z
    .string()
    .refine((date) => new Date(date) > new Date(), {
      message: "La date limite doit être dans le futur",
    }),
  bareme: z.number().min(1, "Le barème doit être supérieur à 0"),
  espacePedagogiqueId: z.string().uuid("ID de l'espace pédagogique invalide"),
})
