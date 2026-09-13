import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { Etudiant } from './Etudiant'

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

  @OneToMany('etudiants', 'promotion')
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
