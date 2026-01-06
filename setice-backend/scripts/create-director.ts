import { getDataSource } from '../src/lib/db'
import { User, Role } from '../src/entities/User'
import bcrypt from 'bcrypt'

async function createDirector() {
  try {
    const db = await getDataSource()
    const userRepo = db.getRepository(User)

    // Vérifier si le Directeur existe déjà
    const existing = await userRepo.findOne({
      where: { email: 'directeur@setice.edu' }
    })

    if (existing) {
      console.log('⚠️  Directeur existe déjà. Suppression...')
      await userRepo.remove(existing)
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Créer le nouveau Directeur
    const director = userRepo.create({
      nom: 'ADMIN',
      prenom: 'Directeur',
      email: 'directeur@setice.edu',
      role: Role.DIRECTEUR_ETUDES,
      password: hashedPassword,
      motDePasseTemporaire: true
    })

    await userRepo.save(director)

    console.log('✅ Directeur créé avec succès !')
    console.log('   Email: directeur@setice.edu')
    console.log('   Mot de passe: password123')
    console.log('   ID:', director.id)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

createDirector()