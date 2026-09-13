import { DataSource } from 'typeorm'
import { User } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Matiere } from '@/src/entities/Matiere'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Assignation } from '../entities/Assignation'
import { Travail } from '../entities/Travail'
import { Evaluation } from '../entities/Evaluation'
import { Livraison } from '../entities/Livraison'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,

  // ✅ Une seule config SSL, simplifiée
  ssl: {
    rejectUnauthorized: false,
  },

  // ✅ Limite le nombre de connexions (important pour le plan gratuit Render)
  extra: {
    max: 5,
    connectionTimeoutMillis: 10000,
  },

  entities: [
    User,
    Etudiant,
    Promotion,
    Formateur,
    Matiere,
    EspacePedagogique,
    Assignation,
    Travail,
    Evaluation,
    Livraison
  ],
})