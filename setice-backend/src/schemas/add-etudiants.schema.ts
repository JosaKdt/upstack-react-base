import { z } from 'zod'

export const addEtudiantsSchema = z.object({
  espacePedagogiqueId: z.string().uuid('ID espace pédagogique invalide'),
  promotionId: z.string().uuid('ID promotion invalide')
})

export type AddEtudiantsDto = z.infer<typeof addEtudiantsSchema>