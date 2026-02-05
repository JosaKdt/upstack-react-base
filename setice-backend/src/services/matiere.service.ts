import { getDataSource } from '@/src/lib/db'
import { Matiere } from '@/src/entities/Matiere'
import { CreateMatiereDto } from '@/src/schemas/matiere.schema'

// ✅ CREATE
export async function createMatiere(input: CreateMatiereDto) {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  // 1️⃣ Vérifier unicité du code (si fourni)
  if (input.code) {
    const exists = await matiereRepo.findOne({
      where: { code: input.code },
    })

    if (exists) {
      throw new Error('MATIERE_ALREADY_EXISTS')
    }
  }

  // 2️⃣ Créer matière
  const matiere = matiereRepo.create({
    code: input.code,
    libelle: input.libelle,
    credits: input.credits,
  } as Partial<Matiere>)

  await matiereRepo.save(matiere)

  return {
    id: matiere.id,
    code: matiere.code,
    libelle: matiere.libelle,
    credits: matiere.credits,
  }
}

// ✅ READ ALL
export async function listMatieres() {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  const matieres = await matiereRepo.find()

  return matieres.map((m) => ({
    id: m.id,
    code: m.code,
    libelle: m.libelle,
    credits: m.credits,
  }))
}

// ✅ UPDATE
export async function updateMatiere(
  id: string,
  input: {
    code?: string
    libelle?: string
    credits?: number
  }
) {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  // 1️⃣ Vérifier existence
  const matiere = await matiereRepo.findOne({
    where: { id },
  })

  if (!matiere) {
    throw new Error('MATIERE_NOT_FOUND')
  }

  // 2️⃣ Vérifier unicité du code (si modifié)
  if (input.code && input.code !== matiere.code) {
    const exists = await matiereRepo.findOne({
      where: { code: input.code },
    })

    if (exists) {
      throw new Error('CODE_ALREADY_EXISTS')
    }
  }

  // 3️⃣ Mettre à jour
  if (input.code !== undefined) matiere.code = input.code
  if (input.libelle !== undefined) matiere.libelle = input.libelle
  if (input.credits !== undefined) matiere.credits = input.credits

  await matiereRepo.save(matiere)

  return {
    id: matiere.id,
    code: matiere.code,
    libelle: matiere.libelle,
    credits: matiere.credits,
  }
}

// ✅ DELETE
export async function deleteMatiere(id: string) {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  // 1️⃣ Vérifier existence
  const matiere = await matiereRepo.findOne({
    where: { id },
  })

  if (!matiere) {
    throw new Error('MATIERE_NOT_FOUND')
  }

  // 2️⃣ Supprimer
  await matiereRepo.remove(matiere)
}