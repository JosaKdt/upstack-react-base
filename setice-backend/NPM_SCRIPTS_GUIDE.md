# 📦 Scripts NPM à ajouter au package.json

Ajouter ces scripts dans la section `"scripts"` de votre `package.json` :

```json
{
  "scripts": {
    "test:acceptance": "jest --config jest.acceptance.config.ts",
    "test:acceptance:watch": "jest --config jest.acceptance.config.ts --watch",
    "test:acceptance:coverage": "jest --config jest.acceptance.config.ts --coverage",
    "test:acceptance:verbose": "jest --config jest.acceptance.config.ts --verbose",
    "test:sprint1": "jest sprint1.acceptance.test.ts --config jest.acceptance.config.ts",
    "test:all": "npm run test:acceptance && npm test"
  }
}
```

## 🚀 Utilisation

### Tester Sprint 1 uniquement
```powershell
npm run test:sprint1
```

### Tous les tests d'acceptation
```powershell
npm run test:acceptance
```

### Mode watch (re-exécute automatiquement)
```powershell
npm run test:acceptance:watch
```

### Avec couverture de code
```powershell
npm run test:acceptance:coverage
```

### Logs détaillés
```powershell
npm run test:acceptance:verbose
```

### Tous les tests (acceptation + unitaires)
```powershell
npm run test:all
```

---

## 📋 Dépendances à installer

Si vous n'avez pas déjà ces dépendances, installez-les :

```powershell
npm install --save-dev jest-html-reporter
npm install --save-dev @types/jest
npm install --save-dev ts-jest
```

---

## 🎯 Workflow recommandé

### Terminal 1 : Serveur
```powershell
cd C:\Users\folaw\upstack-react-base\setice-backend
npm run dev
```

### Terminal 2 : Tests
```powershell
cd C:\Users\folaw\upstack-react-base\setice-backend
npm run test:sprint1
```

---

## 📊 Rapport HTML

Un rapport HTML sera généré automatiquement dans :
```
__tests__/reports/acceptance-report.html
```

Ouvrez-le dans un navigateur pour voir :
- ✅ Tests réussis vs échoués
- ⏱️ Temps d'exécution par test
- 📝 Logs console
- 🔍 Détails des erreurs
