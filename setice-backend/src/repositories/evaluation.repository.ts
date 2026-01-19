// src/repositories/evaluation.repository.ts
import { getDataSource } from '@/src/lib/db'
import { Evaluation } from '@/src/entities/Evaluation'

export const evaluationRepository = {
  async create(evaluation: Partial<Evaluation>) {
    const db = await getDataSource()
    const repo = db.getRepository(Evaluation)
    const entity = repo.create(evaluation)
    await repo.save(entity)
    return entity
  },

  async findById(id: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Evaluation)
    return repo.findOne({ where: { id } })
  },

  async listByAssignation(assignationId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Evaluation)
    return repo.find({
      where: { assignation: { id: assignationId } },
      order: { dateEvaluation: 'DESC' },
    })
  },
}
