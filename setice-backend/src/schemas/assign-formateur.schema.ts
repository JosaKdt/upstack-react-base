import { z } from 'zod'

export const assignFormateurSchema = z.object({
  espacePedagogiqueId: z.string().uuid('ID espace pédagogique invalide'),
  formateurId: z.string().uuid('ID formateur invalide')
})

export type AssignFormateurDto = z.infer<typeof assignFormateurSchema>