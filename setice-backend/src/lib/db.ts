import { AppDataSource } from './data-source'


let initialized = false

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    console.log('⏳ Initialisation DB...')
    await AppDataSource.initialize()
    console.log('✅ DB connectée')
  }
  return AppDataSource
}