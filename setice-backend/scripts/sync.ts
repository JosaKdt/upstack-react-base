import 'reflect-metadata'
import { AppDataSource } from '../src/lib/data-source'

async function sync() {
  try {
    console.log('⏳ Connexion...')
    await AppDataSource.initialize()
    console.log('✅ Connecté')
    console.log('📊 isInitialized:', AppDataSource.isInitialized)

    console.log('⏳ Synchronisation du schéma...')
    await AppDataSource.synchronize()
    console.log('✅ Tables créées avec succès!')

    // Vérification : lister les tables créées
    const tables = await AppDataSource.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    )
    console.log('📋 Tables dans la base:', tables)

    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur complète:', error)
    process.exit(1)
  }
}

sync()