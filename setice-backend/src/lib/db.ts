import { AppDataSource } from './data-source'

let initialized = false

export async function getDataSource() {
  // ✅ Vérifier si déjà initialisé ET si la connexion est active
  if (initialized && AppDataSource.isInitialized) {
    return AppDataSource
  }

  // ✅ Initialiser seulement si pas encore fait
  if (!AppDataSource.isInitialized) {
    console.log('⏳ Initialisation DB...')
    await AppDataSource.initialize()
    console.log('✅ DB connectée')
    initialized = true
  }

  return AppDataSource
}