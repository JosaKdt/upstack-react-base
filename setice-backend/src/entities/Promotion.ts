import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Etudiant } from './Etudiant' // ✅ Import direct

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  code!: string

  @Column()
  libelle!: string

  @Column()
  annee!: string

  // ✅ Supprimé require(), utilisé fonction fléchée
  @OneToMany(
    () => Etudiant,
    (etudiant) => etudiant.promotion
  )
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}