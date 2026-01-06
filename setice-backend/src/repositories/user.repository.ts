import { User, Role } from '@/src/entities/User'
import { getDataSource } from '@/src/lib/db'

export const userRepository = {
  async findByEmail(email: string) {
    const db = await getDataSource()
    return db.getRepository(User).findOne({
      where: { email },
    })
  },

  async findById(id: string) {
    const db = await getDataSource()
    return db.getRepository(User).findOne({
      where: { id },
    })
  },

  async findByRole(role: Role) {
    const db = await getDataSource()
    return db.getRepository(User).findOne({
      where: { role },
    })
  },
}