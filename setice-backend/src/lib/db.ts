import { AppDataSource } from './data-source'

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    console.log('⏳ Initialisation DB...')
    await AppDataSource.initialize()
    console.log('✅ DB connectée')
  }
  return AppDataSource
}

// ✅ Alias attendu par tous les repositories/services
export async function getDataSource() {
  return initializeDatabase()
}