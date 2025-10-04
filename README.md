# Vlille Live 🚲

Une PWA pour consulter en temps réel la disponibilité des vélos et stations V'lille à Lille.

## 📱 Aperçu

Vlille Live permet aux utilisateurs de :
- Visualiser sur une carte interactive toutes les stations V'lille
- Consulter en temps réel le nombre de vélos et de places disponibles
- Rechercher une station spécifique
- Localiser les stations les plus proches
- Marquer des stations en favoris
- Accéder aux détails de chaque station

## 🛠️ Technologies utilisées

### Framework et plateforme
- **Ionic Vue 8** - Framework hybride pour le développement mobile
- **Capacitor 7** - Runtime natif pour applications web
- **Vue.js 3** - Framework JavaScript progressif avec Composition API
- **TypeScript** - Superset typé de JavaScript

### Interface utilisateur
- **Ionic Components** - Composants UI natifs cross-platform
- **Leaflet** - Bibliothèque de cartes interactives
- **Leaflet MarkerCluster** - Regroupement de marqueurs pour les cartes
- **Ionicons** - Icônes officielles Ionic

### Outils de développement
- **Vite** - Build tool moderne et rapide
- **Vue Router 4** - Routage pour applications Vue.js
- **Axios** - Client HTTP pour les appels API
- **ESLint** - Linter pour la qualité du code

### Stockage et données
- **Ionic Storage** - Solution de stockage cross-platform
- **API V'lille** - Données en temps réel des stations

### PWA et déploiement
- **Vite PWA Plugin** - Support Progressive Web App
- **Capacitor iOS** - Déploiement sur iOS

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Ionic CLI** (optionnel mais recommandé)
- Pour le développement iOS : **Xcode** (macOS uniquement)

## 🚀 Installation et lancement

### 1. Cloner le repository
```bash
git clone https://github.com/valentinpx/vlille-live.git
cd vlille-live
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer en mode développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### 4. Build pour la production
```bash
npm run build
```

## 📱 Développement mobile

### Préparer la plateforme iOS
```bash
npm install -g @ionic/cli @capacitor/cli
ionic capacitor add ios
ionic capacitor sync ios
```

### Lancer sur iOS
```bash
ionic capacitor run ios
```

## 🧪 Tests

### Tests unitaires
```bash
npm run test:unit
```

### Tests end-to-end
```bash
npm run test:e2e
```

### Linting
```bash
npm run lint
```

## 📂 Structure du projet

```
src/
├── components/         # Composants réutilisables
│   ├── SearchBar.vue   # Barre de recherche
│   ├── StationModal.vue # Modal d'informations station
│   └── ExploreContainer.vue
├── views/              # Pages de l'application
│   ├── MapPage.vue     # Page principale avec carte
│   ├── FavPage.vue     # Page des favoris
│   ├── SettingsPage.vue # Page des paramètres
│   └── TabsPage.vue    # Navigation par onglets
├── plugins/            # Plugins et services
│   ├── api.ts          # Service API V'lille
│   └── storage.ts      # Service de stockage
├── router/             # Configuration du routage
├── theme/              # Styles et thèmes
└── types.ts            # Définitions TypeScript
```

## 🎯 Fonctionnalités principales

- **Carte interactive** : Visualisation en temps réel des stations V'lille
- **Géolocalisation** : Localisation automatique de l'utilisateur
- **Recherche** : Recherche de stations par nom
- **Favoris** : Sauvegarde des stations préférées
- **Détails station** : Informations complètes sur chaque station

## 🔧 Configuration

L'application peut être configurée via les fichiers :
- `capacitor.config.ts` - Configuration Capacitor
- `ionic.config.json` - Configuration Ionic
- `vite.config.ts` - Configuration Vite

## 📄 Licence

Ce projet est sous licence [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Vous êtes libre de :
- **Partager** — copier, distribuer et communiquer le matériel par tous moyens et sous tous formats
- **Adapter** — remixer, transformer et créer à partir du matériel

Selon les conditions suivantes :
- **Attribution** — Vous devez créditer l'œuvre, intégrer un lien vers la licence et indiquer si des modifications ont été effectuées
- **Pas d'Utilisation Commerciale** — Vous n'êtes pas autorisé à faire un usage commercial sans autorisation de ma part
- **Partage dans les Mêmes Conditions** — Dans le cas où vous effectuez un remix, que vous transformez, ou créez à partir du matériel composant l'œuvre originale, vous devez diffuser l'œuvre modifiée dans les même conditions 

---

Développé avec ❤️ à Lille