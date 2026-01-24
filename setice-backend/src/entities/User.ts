import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum Role {
  DIRECTEUR_ETUDES = 'DIRECTEUR_ETUDES',
  FORMATEUR = 'FORMATEUR',
  ETUDIANT = 'ETUDIANT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  nom!: string

  @Column()
  prenom!: string

  @Column({
    type: 'enum',
    enum: Role,
  })
  role!: Role

  @Column({ nullable: true })
  activationToken?: string

  @Column({ type: 'timestamp', nullable: true })
  activationTokenExpires?: Date

  @Column({ default: true })
  motDePasseTemporaire!: boolean

  @Column({ default: false })  // ✅ Ajout du décorateur manquant
  isActive!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}