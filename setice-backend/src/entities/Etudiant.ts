import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'
// ✅ Import normal pour utilisation dans les décorateurs
import { Promotion } from './Promotion'
import { User } from './User'
import { EspacePedagogique } from './EspacePedagogique'

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // ✅ La fonction fléchée () => évite la circularité
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

  @ManyToMany(() => EspacePedagogique, (espace) => espace.etudiants)
  espacesPedagogiques!: EspacePedagogique[]
}