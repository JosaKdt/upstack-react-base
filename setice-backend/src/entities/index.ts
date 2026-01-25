// src/entities/index.ts

// ✅ 1. Entités sans dépendances en premier
export { User, Role } from './User'

// ✅ 2. Entités avec peu de dépendances
export { Promotion } from './Promotion'
export { Matiere } from './Matiere'
export { Formateur } from './Formateur'

// ✅ 3. Entités avec plus de dépendances
export { Etudiant } from './Etudiant'
export { EspacePedagogique } from './EspacePedagogique'
export { Travail } from './Travail'

// ✅ 4. Entités de relations
export { Assignation, StatutAssignation } from './Assignation'
export { Livraison } from './Livraison'
export { Evaluation } from './Evaluation'