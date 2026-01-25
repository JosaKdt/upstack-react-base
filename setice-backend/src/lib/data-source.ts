// src/lib/data-source.ts
import { DataSource } from 'typeorm'
import * as Entities from '@/src/entities'

const isProduction = process.env.NODE_ENV === 'production'

function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
    }
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'azerty',
    database: process.env.DB_NAME || 'setice_db',
  }
}

// ✅ Créez le DataSource avec toutes les entités
export const AppDataSource = new DataSource({
  type: 'postgres',
  
  ...getDatabaseConfig(),
  
  ssl: isProduction ? { 
    rejectUnauthorized: false 
  } : false,
  
  connectTimeoutMS: 10000,
  maxQueryExecutionTime: 5000,
  
  synchronize: !isProduction,
  logging: ['error', 'warn'],
  
  // ✅ Utiliser Object.values pour obtenir toutes les entités
  entities: Object.values(Entities).filter(e => typeof e === 'function'),
})

console.log('📦 [DATA-SOURCE] DataSource créé avec les entités:', 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(Entities).filter(e => typeof e === 'function').map((e: any) => e.name)
)