import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

export const espacePedagogiqueRepository = {
  async create(data: {
    promotionId: string
    matiereId: string
    formateurId: string
  }) {
    const db = await getDataSource()
    return db.getRepository(EspacePedagogique).save({
      promotion: { id: data.promotionId },
      matiere: { id: data.matiereId },
      formateur: { id: data.formateurId },
    })
  },

  async findAll() {
    const db = await getDataSource()
    return db.getRepository(EspacePedagogique).find({
      relations: ['promotion', 'matiere', 'formateur', 'formateur.user'],
      order: {
        createdAt: 'DESC'
      }
    })
  },
  async assignFormateur(espacePedagogiqueId: string, formateurId: string) {
    const db = await getDataSource()
    const espaceRepo = db.getRepository(EspacePedagogique)
    
    // Récupérer l'espace pédagogique
    const espace = await espaceRepo.findOne({
      where: { id: espacePedagogiqueId }
    })
    
    if (!espace) {
      throw new Error('ESPACE_NOT_FOUND')
    }
    
    // Mettre à jour le formateur
    espace.formateur = { id: formateurId } as any
    
    return espaceRepo.save(espace)
  },

  async addEtudiants(espacePedagogiqueId: string, etudiantIds: string[]) {
    const db = await getDataSource()
    const espaceRepo = db.getRepository(EspacePedagogique)
    
    // Récupérer l'espace avec ses étudiants actuels
    const espace = await espaceRepo.findOne({
      where: { id: espacePedagogiqueId },
      relations: ['etudiants']
    })
    
    if (!espace) {
      throw new Error('ESPACE_NOT_FOUND')
    }
    
    // Récupérer les IDs déjà inscrits
    const existingIds = espace.etudiants?.map(e => e.id) || []
    
    // Filtrer les nouveaux étudiants (éviter les doublons)
    const newIds = etudiantIds.filter(id => !existingIds.includes(id))
    
    // Ajouter les nouveaux étudiants
    const nouveauxEtudiants = newIds.map(id => ({ id } as any))
    espace.etudiants = [...(espace.etudiants || []), ...nouveauxEtudiants]
    
    await espaceRepo.save(espace)
    
    return {
      inscrits: newIds.length,
      dejaInscrits: etudiantIds.length - newIds.length
    }
  }
}