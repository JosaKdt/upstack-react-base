import { User, Role } from '@/src/entities/User'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { StatutTravail, TypeTravail } from '@/src/entities/Travail'
import { travailRepository } from '@/src/repositories/travail.repository'
import { getDataSource } from '@/src/lib/db'

interface CreateTravailInput {
  titre: string
  consignes: string
  type: TypeTravail
  dateLimite: string
  bareme: number
  espacePedagogiqueId: string
  formateur: User
}

export async function createTravail(input: CreateTravailInput) {
  if (input.formateur.role !== Role.FORMATEUR) {
    throw new Error('FORBIDDEN: Seuls les formateurs peuvent créer des travaux')
  }

  const db = await getDataSource()
  const espaceRepo = db.getRepository(EspacePedagogique)
  const espace = await espaceRepo.findOne({ where: { id: input.espacePedagogiqueId }, relations: ['etudiants'] })
  if (!espace) throw new Error('ESPACE_NOT_FOUND')

  const travail = await travailRepository.createTravail({
    titre: input.titre,
    consignes: input.consignes,
    type: input.type,
    dateLimite: new Date(input.dateLimite),
    bareme: input.bareme,
    statut: StatutTravail.BROUILLON,
    espacePedagogique: espace,
    formateur: {id: input.formateur.id} as User ,
  })

  return travail
}

export async function listTravauxByEspace(espaceId: string) {
  return travailRepository.listByEspace(espaceId)
}

export async function getTravailById(travailId: string) {
  return travailRepository.findById(travailId)
}
