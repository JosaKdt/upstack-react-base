# 🎨 SPÉCIFICATIONS FRONTEND - SETICE MVP

**Pour** : Développement avec v0.dev ou Claude Artifacts  
**Objectif** : MVP visualisable en 1 semaine  
**Date** : 06 janvier 2026

---

## 🎯 OBJECTIF DU MVP

> **"Créer une interface minimaliste et élégante permettant au Directeur des Études de gérer les entités principales"**

### **Principes de design (Alex Hormozi)**
1. **Clarté > Créativité** - L'utilisateur doit comprendre en 3 secondes
2. **Action > Information** - Boutons visibles, calls-to-action clairs
3. **Preuve > Promesse** - Montrer des résultats, pas des features
4. **Simplicité > Sophistication** - Moins de clics = plus de valeur

---

## 🎨 DESIGN SYSTEM

### **Palette de couleurs**

#### **Couleurs principales**
```css
/* Primary - Bleu académique */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-500: #3b82f6  /* Couleur principale */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-900: #1e3a8a

/* Secondary - Gris moderne */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-500: #6b7280
--gray-700: #374151
--gray-900: #111827

/* Accent - Vert succès */
--success-50: #f0fdf4
--success-500: #22c55e
--success-600: #16a34a

/* Warning - Jaune attention */
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-600: #d97706

/* Error - Rouge erreur */
--error-50: #fef2f2
--error-500: #ef4444
--error-600: #dc2626
```

#### **Usage**
- **Primary** : Boutons principaux, liens, focus states
- **Gray** : Texte, bordures, backgrounds
- **Success** : Confirmations, succès
- **Warning** : Alertes non critiques
- **Error** : Erreurs, validations échouées

---

### **Typographie**

```css
/* Font Family */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'Fira Code', 'Courier New', monospace

/* Font Sizes */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

/* Line Heights */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

---

### **Spacing**

```css
--spacing-1: 0.25rem  /* 4px */
--spacing-2: 0.5rem   /* 8px */
--spacing-3: 0.75rem  /* 12px */
--spacing-4: 1rem     /* 16px */
--spacing-5: 1.25rem  /* 20px */
--spacing-6: 1.5rem   /* 24px */
--spacing-8: 2rem     /* 32px */
--spacing-10: 2.5rem  /* 40px */
--spacing-12: 3rem    /* 48px */
--spacing-16: 4rem    /* 64px */
```

---

### **Border Radius**

```css
--radius-sm: 0.25rem  /* 4px */
--radius-md: 0.375rem /* 6px */
--radius-lg: 0.5rem   /* 8px */
--radius-xl: 0.75rem  /* 12px */
--radius-2xl: 1rem    /* 16px */
--radius-full: 9999px /* Pills/Rounded */
```

---

### **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## 🧩 COMPOSANTS DE BASE

### **Button**

```tsx
// Variantes
<Button variant="primary">Créer</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="outline">Filtrer</Button>
<Button variant="ghost">Supprimer</Button>
<Button variant="danger">Supprimer définitivement</Button>

// Tailles
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// États
<Button loading>Chargement...</Button>
<Button disabled>Désactivé</Button>
<Button icon={<PlusIcon />}>Avec icône</Button>
```

**Specs** :
- Primary : bg-primary-600, text-white, hover:bg-primary-700
- Height : sm=32px, md=40px, lg=48px
- Padding : sm=12px, md=16px, lg=20px
- Font weight : 500
- Transition : all 150ms ease

---

### **Input**

```tsx
<Input 
  label="Email" 
  placeholder="directeur@setice.edu"
  type="email"
  required
  error="Email invalide"
  helperText="Utilisé pour la connexion"
/>
```

**Specs** :
- Height : 40px
- Border : 1px solid gray-300
- Border-radius : 8px
- Focus : border-primary-500, ring-2 ring-primary-200
- Error : border-error-500, text-error-600

---

### **Card**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenu */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Specs** :
- Background : white
- Border : 1px solid gray-200
- Border-radius : 12px
- Shadow : shadow-sm, hover:shadow-md
- Padding : 20px

---

### **Modal / Dialog**

```tsx
<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  <DialogTitle>Créer un formateur</DialogTitle>
  <DialogContent>
    {/* Formulaire */}
  </DialogContent>
  <DialogFooter>
    <Button variant="secondary">Annuler</Button>
    <Button variant="primary">Créer</Button>
  </DialogFooter>
</Dialog>
```

**Specs** :
- Backdrop : bg-black/50
- Modal : max-width 500px, centered
- Animation : fade in + slide up
- Close on backdrop click

---

### **Toast / Notification**

```tsx
toast.success("Formateur créé avec succès!")
toast.error("Erreur lors de la création")
toast.info("Synchronisation en cours...")
```

**Specs** :
- Position : top-right
- Duration : 3000ms
- Icon : success=check, error=x, info=i
- Auto-dismiss : true

---

## 📱 PAGES PRINCIPALES

### **1. Page de connexion** (`/login`)

#### **Layout**
```
┌────────────────────────────────────┐
│                                    │
│       [LOGO SETICE]                │
│                                    │
│   ┌────────────────────────┐      │
│   │  Email                 │      │
│   │  ┌──────────────────┐ │      │
│   │  │                  │ │      │
│   │  └──────────────────┘ │      │
│   │                        │      │
│   │  Mot de passe          │      │
│   │  ┌──────────────────┐ │      │
│   │  │                  │ │      │
│   │  └──────────────────┘ │      │
│   │                        │      │
│   │  [ Se connecter ]      │      │
│   │                        │      │
│   │  Mot de passe oublié ? │      │
│   └────────────────────────┘      │
│                                    │
└────────────────────────────────────┘
```

#### **Comportement**
1. Focus automatique sur l'email
2. Enter pour soumettre
3. Loader sur le bouton pendant l'auth
4. Erreur affichée en rouge sous les champs
5. Redirection vers /dashboard après succès

---

### **2. Dashboard** (`/dashboard`)

#### **Layout**
```
┌──────────────────────────────────────────────────┐
│ [LOGO] SETICE              [Profile ▼] [Logout] │
├──────────────────────────────────────────────────┤
│                                                  │
│  Bienvenue, Jean DUPONT                          │
│  Directeur des Études                            │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │    42    │ │    15    │ │    128   │        │
│  │ Espaces  │ │Formateurs│ │Étudiants │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  Actions rapides                                 │
│  ┌────────────────────────────────────┐         │
│  │ [+] Créer un espace pédagogique   │         │
│  │ [+] Créer une promotion           │         │
│  │ [+] Créer un formateur            │         │
│  │ [+] Créer un étudiant             │         │
│  └────────────────────────────────────┘         │
│                                                  │
│  Espaces récents                                 │
│  [Liste des 5 derniers espaces créés]           │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### **3. Liste des espaces** (`/espaces`)

#### **Layout**
```
┌──────────────────────────────────────────────────┐
│ Espaces Pédagogiques           [+ Créer]         │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Recherche...] [Filtre: Promotion ▼] [Année ▼] │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │ Génie Logiciel                         │     │
│  │ L3-SIL-2025 • 2024-2025                │     │
│  │ Formateur: Jean DUPONT                 │     │
│  │ 31 étudiants inscrits                  │     │
│  │                                        │     │
│  │ [Voir] [Modifier] [Supprimer]         │     │
│  └────────────────────────────────────────┘     │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │ Bases de Données                       │     │
│  │ M1-IA-2025 • 2024-2025                 │     │
│  │ Formateur: Sophie MARTIN               │     │
│  │ 24 étudiants inscrits                  │     │
│  │                                        │     │
│  │ [Voir] [Modifier] [Supprimer]         │     │
│  └────────────────────────────────────────┘     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### **4. Créer un espace** (`/espaces/create`)

#### **Layout**
```
┌──────────────────────────────────────────────────┐
│ Créer un espace pédagogique                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Étape 1/3 - Informations générales              │
│                                                  │
│  Promotion *                                     │
│  [Sélectionner une promotion ▼]                 │
│                                                  │
│  Matière *                                       │
│  [Sélectionner une matière ▼]                   │
│                                                  │
│  Formateur *                                     │
│  [Sélectionner un formateur ▼]                  │
│                                                  │
│  Année académique *                              │
│  [2024-2025 ▼]                                   │
│                                                  │
│  [Annuler]              [Suivant →]              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🔄 USER FLOWS PRIORITAIRES

### **Flow 1 : Connexion → Dashboard**

```
1. Utilisateur arrive sur /login
2. Entre email + password
3. Clique "Se connecter"
4. → Loading state
5. → Si succès : Redirect /dashboard
6. → Si erreur : Afficher message d'erreur
```

---

### **Flow 2 : Créer un formateur**

```
1. Dashboard → Clic "Créer un formateur"
2. Modal s'ouvre
3. Formulaire : Nom, Prénom, Email, Spécialité
4. Validation en temps réel (email format)
5. Clic "Créer"
6. → Loading state
7. → Si succès : Toast + fermeture modal + refresh liste
8. → Si erreur : Message d'erreur sous le champ concerné
```

---

### **Flow 3 : Créer un espace pédagogique**

```
1. Dashboard ou /espaces → Clic "Créer un espace"
2. Page /espaces/create
3. Step 1/3 : Sélection Promotion, Matière, Formateur, Année
4. Clic "Suivant"
5. Step 2/3 : Confirmation des choix
6. Clic "Suivant"
7. Step 3/3 : Inscrire les étudiants de la promotion ?
8. Clic "Créer l'espace"
9. → Loading state
10. → Si succès : Redirect /espaces + Toast succès
11. → Si erreur : Afficher erreur + rester sur la page
```

---

## 🎯 PROMPTS POUR V0.DEV

### **Prompt 1 : Design System de base**

```
Create a modern design system for an educational platform using Next.js 15, Tailwind CSS, and shadcn/ui.

Requirements:
- Color palette: Primary blue (#3b82f6), gray scale, success green, warning yellow, error red
- Typography: Inter font, sizes from 12px to 36px
- Components: Button (4 variants), Input with label, Card with header/content/footer, Modal, Toast
- All components should be fully accessible (ARIA labels, keyboard navigation)
- Include hover states, focus states, and loading states
- Use Lucide React for icons

Make it clean, professional, and modern. The design should convey trust and simplicity.
```

---

### **Prompt 2 : Page de connexion**

```
Create a login page for an educational platform (SETICE) using the design system we created.

Requirements:
- Centered card with logo at top
- Email and password fields with validation
- "Remember me" checkbox
- "Forgot password?" link
- "Log in" button with loading state
- Display error messages below fields
- Responsive design (mobile-first)
- Background: subtle gradient (blue to purple)

Use React Hook Form + Zod for validation.
Call API: POST /api/v1/auth/login with { email, password }
On success: redirect to /dashboard
On error: display error message

Make it beautiful and trustworthy.
```

---

### **Prompt 3 : Dashboard**

```
Create a dashboard page for the Director of Studies role.

Requirements:
- Top navigation bar: Logo, user menu (dropdown), logout button
- Welcome message with user name and role
- 3 stat cards: Number of Spaces, Formateurs, Students (with icons)
- Quick actions section: 4 buttons to create entities
- Recent spaces section: List of 5 most recent spaces (card layout)
- Each space card shows: Subject, Promotion, Formateur, Number of students, Action buttons (View, Edit, Delete)
- Responsive grid layout

Use Lucide React icons.
Fetch data from GET /api/v1/espaces-pedagogique/list
Show loading skeleton while fetching.

Make it clean and actionable.
```

---

### **Prompt 4 : Modal de création de formateur**

```
Create a modal to create a formateur (teacher) account.

Requirements:
- Modal title: "Créer un compte formateur"
- Form fields: Nom (text), Prénom (text), Email (email), Spécialité (text)
- Real-time validation with Zod
- Submit button: "Créer" with loading state
- Cancel button: "Annuler"
- On success: show toast notification, close modal, refresh list
- On error: display error message below the relevant field

Use React Hook Form + Zod.
API: POST /api/v1/formateurs/create
Include auth token in header: Authorization: Bearer <token>

Make it user-friendly with clear error messages.
```

---

### **Prompt 5 : Liste des espaces pédagogiques**

```
Create a page to list all educational spaces (espaces pédagogiques).

Requirements:
- Page title: "Espaces Pédagogiques" with "+ Créer" button
- Search bar to filter by subject name
- Filters: Promotion (dropdown), Year (dropdown)
- Grid of space cards (3 columns on desktop, 1 on mobile)
- Each card shows: Subject name, Promotion code, Year, Formateur name, Number of students
- Action buttons on each card: View, Edit, Delete
- Empty state if no spaces: "Aucun espace pédagogique. Créez-en un !"
- Loading state: skeleton cards

Fetch from GET /api/v1/espaces-pedagogique/list
Implement client-side search and filtering.

Make it visually appealing with hover effects.
```

---

## 📦 PACKAGE COMPLET POUR V0

### **Ce qu'il faut fournir à v0.dev**

1. **Design System** (Prompt 1) → Base de tous les composants
2. **Page Login** (Prompt 2) → Point d'entrée
3. **Dashboard** (Prompt 3) → Vue d'ensemble
4. **Modal Formateur** (Prompt 4) → Exemple de création
5. **Liste Espaces** (Prompt 5) → Liste avec filtres

### **Ordre de développement**

1. **Jour 1** : Design System + Login
2. **Jour 2** : Dashboard + Navigation
3. **Jour 3** : Liste Espaces + Filtres
4. **Jour 4** : Modals de création (Formateur, Promotion, etc.)
5. **Jour 5** : Polish + Responsive + Tests

---

## ✅ CHECKLIST FINALE

### **Avant de lancer v0**
- [ ] API Backend tourne sur localhost:3000
- [ ] Token JWT généré (login fonctionne)
- [ ] Compte Directeur existe dans la DB
- [ ] Documentation API lue

### **Pendant le développement**
- [ ] Tester sur mobile + desktop
- [ ] Vérifier les états de loading
- [ ] Gérer les erreurs gracieusement
- [ ] Ajouter des animations subtiles

### **Avant la démo**
- [ ] Seed des données de test
- [ ] Screenshots pour portfolio
- [ ] Vidéo de démo (1-2 min)

---

## 🎯 RÉSULTAT ATTENDU

Un **MVP fonctionnel et élégant** permettant de :
1. ✅ Se connecter
2. ✅ Voir son dashboard
3. ✅ Créer des formateurs, promotions, étudiants
4. ✅ Créer des espaces pédagogiques
5. ✅ Lister et filtrer les espaces

**Temps estimé** : 5 jours (35 heures)  
**Valeur perçue** : 🚀🚀🚀 (Immédiatement démo-able)

---

**Prêt à lancer v0.dev ! 🎨✨**
