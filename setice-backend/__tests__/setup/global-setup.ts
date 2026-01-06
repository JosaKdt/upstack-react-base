/**
 * 🔧 Global Setup - Tests d'Acceptation
 * 
 * Vérifie que le serveur Next.js est disponible avant de lancer les tests
 */

export default async function globalSetup() {
  console.log('\n🚀 Initialisation des tests d\'acceptation...\n')
  
  const BASE_URL = 'http://localhost:3000'
  const MAX_RETRIES = 10
  const RETRY_DELAY = 2000 // 2 secondes
  
  console.log('🔍 Vérification de la disponibilité du serveur...')
  console.log(`📡 URL: ${BASE_URL}`)
  
  for (let i = 1; i <= MAX_RETRIES; i++) {
    try {
      const response = await fetch(BASE_URL)
      
      if (response.ok || response.status === 404) {
        // 404 est OK, ça veut dire que le serveur répond (juste pas de route à /)
        console.log('✅ Serveur Next.js disponible\n')
        return
      }
    } catch (error) {
      if (i === MAX_RETRIES) {
        console.error('\n❌ ERREUR: Le serveur Next.js n\'est pas disponible\n')
        console.error('⚠️  Assurez-vous que le serveur tourne sur localhost:3000')
        console.error('⚠️  Commande: npm run dev\n')
        throw new Error('Serveur non disponible après 10 tentatives')
      }
      
      console.log(`⏳ Tentative ${i}/${MAX_RETRIES}... (retry dans ${RETRY_DELAY/1000}s)`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    }
  }
}
