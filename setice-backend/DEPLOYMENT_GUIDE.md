# 🚀 DÉPLOIEMENT DES TESTS D'ACCEPTATION - SPRINT 1

## 📦 FICHIERS À COPIER DANS SETICE-BACKEND

### Structure cible
```
C:\Users\folaw\upstack-react-base\setice-backend\
├── __tests__/
│   ├── setup/
│   │   ├── global-setup.ts          ← NOUVEAU
│   │   └── global-teardown.ts       ← NOUVEAU
│   ├── reports/                     ← NOUVEAU (créé automatiquement)
│   └── sprint1.acceptance.test.ts   ← NOUVEAU
├── jest.acceptance.config.ts        ← NOUVEAU
├── TESTS_ACCEPTANCE_README.md       ← NOUVEAU
└── package.json                     ← MODIFIER (ajouter scripts)
```

---

## 📋 CHECKLIST DE DÉPLOIEMENT

### ✅ Étape 1 : Copier les fichiers

```powershell
# Naviguer vers le dossier de téléchargement des fichiers
cd C:\Users\folaw\Downloads  # Ou là où sont les fichiers

# Copier vers setice-backend
copy sprint1.acceptance.test.ts C:\Users\folaw\upstack-react-base\setice-backend\__tests__\
copy jest.acceptance.config.ts C:\Users\folaw\upstack-react-base\setice-backend\
copy TESTS_ACCEPTANCE_README.md C:\Users\folaw\upstack-react-base\setice-backend\

# Créer le dossier setup s'il n'existe pas
mkdir C:\Users\folaw\upstack-react-base\setice-backend\__tests__\setup

# Copier les fichiers de setup
copy __tests__\setup\global-setup.ts C:\Users\folaw\upstack-react-base\setice-backend\__tests__\setup\
copy __tests__\setup\global-teardown.ts C:\Users\folaw\upstack-react-base\setice-backend\__tests__\setup\
```

### ✅ Étape 2 : Installer les dépendances

```powershell
cd C:\Users\folaw\upstack-react-base\setice-backend

npm install --save-dev jest-html-reporter
```

### ✅ Étape 3 : Ajouter les scripts npm

Ouvrir `package.json` dans VS Code et ajouter ces scripts dans la section `"scripts"` :

```json
"test:acceptance": "jest --config jest.acceptance.config.ts",
"test:sprint1": "jest sprint1.acceptance.test.ts --config jest.acceptance.config.ts",
"test:acceptance:watch": "jest --config jest.acceptance.config.ts --watch",
"test:acceptance:verbose": "jest --config jest.acceptance.config.ts --verbose"
```

### ✅ Étape 4 : Vérifier la configuration

```powershell
# Vérifier que les fichiers sont bien copiés
dir __tests__\sprint1.acceptance.test.ts
dir jest.acceptance.config.ts
dir __tests__\setup\
```

---

## ▶️ EXÉCUTION

### Terminal 1 : Lancer le serveur
```powershell
cd C:\Users\folaw\upstack-react-base\setice-backend
npm run dev
```

### Terminal 2 : Exécuter les tests
```powershell
cd C:\Users\folaw\upstack-react-base\setice-backend
npm run test:sprint1
```

---

## 📊 RÉSULTAT ATTENDU

```
🚀 Initialisation des tests d'acceptation...

🔍 Vérification de la disponibilité du serveur...
📡 URL: http://localhost:3000
✅ Serveur Next.js disponible

 PASS  __tests__/sprint1.acceptance.test.ts (8.325 s)
  US U2.1 — Création compte Formateur
    Scenario: Création réussie d'un Formateur non actif
      ✓ GIVEN le Directeur des Études est authentifié (5 ms)
      ✓ WHEN il saisit les informations obligatoires... (142 ms)
    Scenario: Email déjà existant
      ✓ WHEN il saisit un email déjà utilisé THEN... (87 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (52 ms)
  
  US U2.2 — Création promotion
    Scenario: Création réussie
      ✓ WHEN il saisit l'année académique... (98 ms)
    Scenario: Promotion déjà existante
      ✓ WHEN il tente de créer une promotion identique... (76 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (48 ms)
  
  US U2.3 — Création étudiant
    Scenario: Création réussie
      ✓ GIVEN une promotion existe WHEN... (115 ms)
    Scenario: Promotion inexistante
      ✓ WHEN il sélectionne une promotion inexistante... (82 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (51 ms)
  
  US U3.1 — Création espace pédagogique
    Scenario: Création manuelle réussie
      ✓ WHEN il sélectionne une promotion, une matière... (132 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (55 ms)
  
  US U3.2 — Affectation Formateur
    Scenario: Affectation réussie
      ✓ GIVEN l'espace pédagogique existe... (89 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (47 ms)
  
  US U3.3 — Ajout étudiants
    Scenario: Ajout réussi
      ✓ WHEN il sélectionne une promotion THEN... (156 ms)
    Scenario: Étudiant déjà inscrit
      ✓ WHEN il tente une inscription existante... (92 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (49 ms)
  
  US U3.5 — Consultation espaces pédagogiques
    Scenario: Consultation réussie
      ✓ WHEN il accède à la liste des espaces... (78 ms)
    Scenario: Accès non autorisé
      ✓ GIVEN un utilisateur non Directeur... (44 ms)
  
  📊 RÉSUMÉ SPRINT 1
    ✓ Toutes les User Stories sont couvertes (1 ms)

╔════════════════════════════════════════════════════╗
║  ✅ SPRINT 1 — TESTS D'ACCEPTATION COMPLÉTÉS      ║
╠════════════════════════════════════════════════════╣
║  US U2.1 — Création Formateur              ✅      ║
║  US U2.2 — Création Promotion              ✅      ║
║  US U2.3 — Création Étudiant               ✅      ║
║  US U3.1 — Création Espace Pédagogique     ✅      ║
║  US U3.2 — Affectation Formateur           ✅      ║
║  US U3.3 — Ajout Étudiants                 ✅      ║
║  US U3.5 — Consultation Espaces            ✅      ║
╚════════════════════════════════════════════════════╝

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        8.325 s

✅ Tests d'acceptation terminés

📊 Résumé:
   • Toutes les User Stories Sprint 1 ont été testées
   • Les critères d'acceptation Gherkin sont validés
   • Le système est prêt pour la phase suivante

🎯 Prochaine étape: Documentation API (Phase C)
```

---

## 🔧 DÉPANNAGE

### ❌ Erreur : "Serveur non disponible"
**Solution** : Le serveur Next.js n'est pas démarré
```powershell
# Terminal 1
npm run dev
```

### ❌ Erreur : "INVALID_CREDENTIALS"
**Solution** : Le compte Directeur n'existe pas ou mot de passe incorrect
```powershell
# Vérifier dans la base de données
psql -U postgres -d setice_db
SELECT * FROM users WHERE role = 'DIRECTEUR_ETUDES';
```

### ❌ Erreur : "Cannot find module 'jest-html-reporter'"
**Solution** : Installer la dépendance
```powershell
npm install --save-dev jest-html-reporter
```

### ❌ Tests échouent avec timeout
**Solution** : Augmenter le timeout dans `jest.acceptance.config.ts`
```typescript
testTimeout: 60000, // 60 secondes
```

---

## 📈 MÉTRIQUES DE SUCCÈS

Une fois les tests exécutés avec succès, vous aurez :

✅ **21 tests passés** (7 US × ~3 scénarios)
✅ **Rapport HTML généré** dans `__tests__/reports/acceptance-report.html`
✅ **100% des critères d'acceptation validés**
✅ **Conformité Gherkin vérifiée**
✅ **Base solide pour la Phase C (Documentation)**

---

## 🎯 PROCHAINES ÉTAPES

### Phase B ✅ : Tests d'acceptation (TERMINÉ)
- Suite de tests créée
- Critères Gherkin matérialisés
- Tous les scénarios couverts

### Phase C 🚀 : Documentation API (SUIVANT)
- Générer Swagger/OpenAPI
- Documenter chaque endpoint
- Exemples de requêtes/réponses

### Phase E ⚡ : Dette technique
- Optimiser les requêtes
- Pagination sur /list
- Refresh tokens
- Rate limiting

### Phase Frontend 🎨 : Interface utilisateur
- Design system
- Composants React
- Offre irrésistible (Alex Hormozi style)

---

## 💡 RAPPEL : PHILOSOPHIE

> **Ces tests ne sont pas du code en plus, ce sont des spécifications vivantes qui prouvent que tu tiens tes promesses.**

**Alignement avec tes principes business** :
- Tests = Preuve de qualité → Augmente LTV
- Tests = Confiance → Réduit friction
- Tests = Scalabilité → Permet de tenir la promesse à grande échelle
- Tests = Monopole de l'attention → Expertise indéniable

---

**🎉 Ready to deploy! Let's go! 🚀**
