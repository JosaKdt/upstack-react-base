import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'
import { Promotion } from './Promotion' // ✅ Import direct
import { User } from './User'
import { EspacePedagogique } from './EspacePedagogique'

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // ✅ Supprimé require(), utilisé fonction fléchée
  @ManyToOne(
    () => Promotion,
    (promotion) => promotion.etudiants,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    }
  )
  @JoinColumn()
  promotion!: Promotion

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User

  @Column({ unique: true })
  matricule!: string

  // ✅ Relation inverse pour les espaces pédagogiques
  @ManyToMany(
    () => EspacePedagogique,
    (espace) => espace.etudiants
  )
  espacesPedagogiques!: EspacePedagogique[]
}