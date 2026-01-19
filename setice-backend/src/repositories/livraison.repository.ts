// src/repositories/livraison.repository.ts
import { getDataSource } from '@/src/lib/db'
import { Livraison } from '@/src/entities/Livraison'
import { Assignation } from '@/src/entities/Assignation'

export const livraisonRepository = {
  async createLivraison(
    assignation: Assignation,
    data: {
      fichierUrl?: string
      texte?: string
    }
  ) {
    const db = await getDataSource()
    const repo = db.getRepository(Livraison)

    const livraison = repo.create({
      assignation,
      fichierUrl: data.fichierUrl,
      texte: data.texte,
    })

    return repo.save(livraison)
  },

  async findByAssignation(assignationId: string) {
    const db = await getDataSource()
    return db.getRepository(Livraison).findOne({
      where: {
        assignation: { id: assignationId },
      },
    })
  },
}
