import jwt from 'jsonwebtoken'

// ⚠️ Mets de vrais IDs venant de ta base
const payload = {
  id: '676fc351-0610-49a8-9297-3c050963ddef',
  role: 'FORMATEUR', // FORMATEUR | ETUDIANT | DIRECTEUR_ETUDES
}

const secret = process.env.NEXTAUTH_SECRET || 'super-secret-key'

const token = jwt.sign(payload, secret, {
  expiresIn: '1h',
})

console.log('\n=== JWT ===\n')
console.log(token)
