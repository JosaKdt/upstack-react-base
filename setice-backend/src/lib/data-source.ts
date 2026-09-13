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

// ✅ Active SSL automatiquement si on utilise Render ou en production
const useSSL = process.env.DATABASE_URL?.includes('render.com') ||
               process.env.NODE_ENV === 'production'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ✅ Utilise la variable DATABASE_URL de Render

  synchronize: true,
  logging: true,

  // ✅ Configuration SSL requise pour Render PostgreSQL
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  extra: useSSL ? {
    ssl: { rejectUnauthorized: false }
  } : {},

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