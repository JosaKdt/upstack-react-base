// src/repositories/assignation.repository.ts
import { getDataSource } from '@/src/lib/db'
import { Assignation, StatutAssignation } from '@/src/entities/Assignation'

export const assignationRepository = {
  async create(assignation: Partial<Assignation>) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    const entity = repo.create(assignation)
    await repo.save(entity)
    return entity
  },

  async findById(id: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).findOne({ where: { id } })
  },

  async listByEtudiant(etudiantId: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).find({
      where: { etudiant: { id: etudiantId } },
      order: { createdAt: 'DESC' },
    })
  },

  async listByTravail(travailId: string) {
    const db = await getDataSource()
    return db.getRepository(Assignation).find({
      where: { travail: { id: travailId } },
      order: { createdAt: 'DESC' },
    })
  },

  async markAsDelivered(assignationId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    const assign = await repo.findOne({ where: { id: assignationId } })
    if (!assign) return null

    assign.statut = StatutAssignation.LIVRE
    assign.dateLivraison = new Date()
    return repo.save(assign)
  },

  async markAsEvaluated(assignationId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Assignation)
    const assign = await repo.findOne({ where: { id: assignationId } })
    if (!assign) return null

    assign.statut = StatutAssignation.EVALUE
    return repo.save(assign)
  },
}
