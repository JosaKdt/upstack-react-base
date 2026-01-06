# 🐛 BUGS CONNUS & PROBLÈMES TECHNIQUES - SETICE Backend

**Dernière mise à jour** : 06 janvier 2026  
**Sprint** : Sprint 1  
**Status** : En attente de correction

---

## 📊 RÉSUMÉ RAPIDE

| Catégorie | Nombre | Priorité |
|-----------|--------|----------|
| Tests échoués | 21/40 | 🔴 Haute |
| Routes fonctionnelles | 9/9 | ✅ OK |
| Documentation manquante | 3 items | 🟡 Moyenne |
| Optimisations | 5 items | 🟢 Basse |

---

## 🔴 BUGS CRITIQUES (À corriger avant production)

### **Bug #1 : Middleware d'authentification ne bloque pas correctement**

**Symptôme :**
```
Requête sans token → Status 400 au lieu de 401
Requête avec mauvais rôle → Status 400 au lieu de 403
```

**Tests concernés :**
- ❌ Créer formateur sans auth → 400 (attendu: 401)
- ❌ Créer promotion sans auth → 400 (attendu: 401)
- ❌ Créer étudiant sans auth → 400 (attendu: 401)
- ❌ Créer espace sans auth → 400 (attendu: 401)

**Cause probable :**
Le middleware `requireRole()` n'est pas appelé EN PREMIER dans les routes, ou ne retourne pas le bon status code.

**Impact :** 🔴 Critique - Sécurité compromise

**Solution proposée :**
```typescript
// Dans chaque route protégée, TOUJOURS vérifier l'auth EN PREMIER
export async function POST(req: Request) {
  try {
    // ✅ AUTH EN PREMIER !
    const user = requireRole(req, ['DIRECTEUR_ETUDES'])
    
    // Ensuite validation
    const body = await req.json()
    const data = schema.parse(body)
    
    // ... reste
  } catch (e: any) {
    // Gérer les erreurs d'auth avec les bons status codes
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ success: false }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ success: false }, { status: 403 })
    return NextResponse.json({ success: false, error: e.message }, { status: 400 })
  }
}
```

**Fichiers à modifier :**
- `app/api/v1/formateurs/create/route.ts`
- `app/api/v1/promotions/create/route.ts`
- `app/api/v1/etudiants/create/route.ts`
- `app/api/v1/matieres/create/route.ts`
- `app/api/v1/espaces-pedagogique/create/route.ts`
- `app/api/v1/espaces-pedagogique/assign-formateur/route.ts`
- `app/api/v1/espaces-pedagogique/add-etudiants/route.ts`

**Effort estimé :** 30 minutes

---

### **Bug #2 : Validation Zod rejette certaines créations**

**Symptôme :**
```
POST /formateurs/create → 400 avec données valides
POST /promotions/create → 400 avec données valides
POST /etudiants/create → 400 avec données valides
```

**Tests concernés :**
- ❌ Créer formateur (avec auth) → 400 (attendu: 201)
- ❌ Créer promotion (avec auth) → 400 (attendu: 201)
- ❌ Créer étudiant (avec auth) → 400 (attendu: 201)

**Cause probable :**
Les schémas Zod définissent des champs requis qui ne correspondent pas aux données envoyées, ou ont des validations trop strictes.

**Impact :** 🔴 Critique - Fonctionnalité bloquée

**Solution proposée :**
1. Logger les erreurs Zod pour voir exactement ce qui est rejeté
2. Ajuster les schémas pour accepter les données des tests
3. Documenter les champs requis dans l'API Contract

**Fichiers à vérifier :**
- `src/schemas/formateur.schema.ts`
- `src/schemas/promotion.schema.ts`
- `src/schemas/etudiant.schema.ts`
- `src/schemas/matiere.schema.ts`
- `src/schemas/espace-pedagogique.schema.ts`

**Effort estimé :** 1 heure

---

### **Bug #3 : Structure de réponse incohérente**

**Symptôme :**
```
Tests attendent: data.data.nom
Réponse réelle: data.nom (ou autre structure)
```

**Tests concernés :**
- ❌ Vérification data.data.nom → undefined
- ❌ Vérification data.data.id → undefined

**Cause probable :**
Les services/routes ne retournent pas tous la même structure de réponse.

**Impact :** 🟡 Moyen - Tests échouent mais API fonctionne

**Solution proposée :**
Unifier TOUTES les réponses au format :
```typescript
// ✅ Format standard
{
  success: true,
  data: { /* objet retourné */ }
}
```

**Fichiers à vérifier :**
- Tous les services dans `src/services/`
- Toutes les routes dans `app/api/v1/`

**Effort estimé :** 45 minutes

---

## 🟡 PROBLÈMES MOYENS (Peuvent attendre Sprint 2)

### **Problème #1 : Pas de gestion des doublons sur tous les endpoints**

**Impact :** Données corrompues possibles

**Solution :** Ajouter des contraintes UNIQUE dans les entités TypeORM et gérer les erreurs

**Effort estimé :** 1 heure

---

### **Problème #2 : Token JWT sans refresh**

**Impact :** Utilisateur déconnecté après 24h

**Solution :** Implémenter un système de refresh tokens

**Effort estimé :** 2 heures

---

### **Problème #3 : Pas de pagination sur /list**

**Impact :** Performance dégradée avec beaucoup de données

**Solution :** Ajouter pagination, filtres, tri

**Effort estimé :** 3 heures

---

## 🟢 OPTIMISATIONS (Backlog)

### **Optimisation #1 : Logs structurés**
- Winston ou Pino pour des logs exploitables
- **Effort :** 2 heures

### **Optimisation #2 : Rate limiting**
- Protection contre les attaques DDoS
- **Effort :** 1 heure

### **Optimisation #3 : Cache Redis**
- Accélérer /list et requêtes fréquentes
- **Effort :** 4 heures

### **Optimisation #4 : Upload de fichiers**
- Pour avatars, documents, devoirs
- **Effort :** 6 heures

### **Optimisation #5 : Email service**
- Pour activation comptes, notifications
- **Effort :** 3 heures

---

## 🧪 TESTS

### **Tests d'acceptation**
- ✅ Suite créée (21 tests)
- ❌ 21/40 tests échouent
- **Action :** Corriger bugs #1, #2, #3

### **Tests unitaires**
- ❌ Non implémentés
- **Action :** Créer tests unitaires pour les services
- **Effort :** 8 heures

### **Tests d'intégration**
- ❌ Non implémentés
- **Action :** Tester les workflows complets
- **Effort :** 4 heures

---

## 📚 DOCUMENTATION MANQUANTE

### **Doc #1 : Swagger/OpenAPI**
- ❌ Non généré
- **Impact :** Développeurs frontend doivent lire le code
- **Effort :** 2 heures

### **Doc #2 : Architecture Decisions Records (ADR)**
- ❌ Non documenté
- **Impact :** Décisions techniques perdues
- **Effort :** 1 heure

### **Doc #3 : Guide de contribution**
- ❌ Non créé
- **Impact :** Onboarding difficile pour nouveaux devs
- **Effort :** 1 heure

---

## 🔧 DETTE TECHNIQUE

### **Dette #1 : Pas de migrations TypeORM**
- Actuellement : `synchronize: true` (dangereux en prod)
- **Action :** Créer migrations propres
- **Effort :** 3 heures

### **Dette #2 : Secrets en clair dans .env**
- **Action :** Utiliser un gestionnaire de secrets (AWS Secrets Manager, Vault)
- **Effort :** 2 heures

### **Dette #3 : Pas de monitoring**
- **Action :** Sentry, Datadog, ou New Relic
- **Effort :** 4 heures

---

## 📊 MÉTRIQUES

### **Santé du code**
- Tests réussis : 50% (19/40)
- Couverture : Non mesurée
- Bugs critiques : 3
- Dette technique : ~20 heures

### **Performance**
- Temps de réponse moyen : < 100ms ✅
- Requêtes par seconde : Non testé
- Utilisation mémoire : Non mesurée

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### **Sprint 1.1 (Correctifs critiques) - 3 heures**
1. Corriger Bug #1 (Auth middleware) - 30 min
2. Corriger Bug #2 (Validation Zod) - 1h
3. Corriger Bug #3 (Structure réponse) - 45 min
4. Relancer tests → Objectif: 38/40 tests passés ✅
5. Documentation Swagger - 45 min

### **Sprint 2 (Fonctionnalités manquantes) - 2 semaines**
- Gestion des absences/présences
- Dépôt et notation des devoirs
- Planning des cours
- Messagerie interne

### **Sprint 3 (Dette technique) - 1 semaine**
- Migrations TypeORM
- Tests unitaires
- Monitoring
- Optimisations

---

## 💬 NOTES

- **Priorité #1** : Frontend visualisable (MVP)
- **Priorité #2** : Corriger bugs critiques
- **Priorité #3** : Documentation complète

**Philosophie** : *"Si on ne peut rien voir, c'est comme si on a rien fait"*

---

**Dernière révision** : 06/01/2026  
**Prochaine révision** : Après Sprint 2
