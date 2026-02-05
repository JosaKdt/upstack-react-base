import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EspacePedagogique } from './EspacePedagogique'  // ✅ Import normal

@Entity('matieres')
export class Matiere {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, nullable: true })
  code?: string

  @Column()
  libelle!: string

  @OneToMany(() => EspacePedagogique, (espace) => espace.matiere)
  espacesPedagogiques!: EspacePedagogique[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
  credits: any
}