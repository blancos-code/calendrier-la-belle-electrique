# Calendrier La Belle Électrique

Application web qui affiche les concerts et événements de La Belle Électrique dans un format calendrier interactif.

## 🎵 Fonctionnalités

- **Vue grille et calendrier** : Deux modes d'affichage pour explorer les événements
- **Recherche** : Trouver rapidement un artiste ou événement
- **Filtres** : Par genre musical et salle
- **Design moderne** : Interface sombre inspirée du site officiel
- **Responsive** : Fonctionne sur mobile, tablette et desktop

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build pour production

```bash
npm run build
```

### Générer les données

Pour scraper les concerts depuis le site officiel :

```bash
node scripts/generate-data.js
```

**Note** : Le site de La Belle Électrique utilise du JavaScript pour charger le contenu dynamiquement. Pour un scraping fonctionnel, il faudrait utiliser un outil comme Puppeteer ou Playwright au lieu de Cheerio. Le script actuel est une base à adapter.

## 📦 Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Cheerio** - Web scraping (à remplacer par Puppeteer pour sites JS)
- **date-fns** - Manipulation des dates

## 🌐 Déploiement GitHub Pages

Le site est configuré pour se déployer automatiquement sur GitHub Pages :

1. Activez GitHub Pages dans les paramètres du repository
2. Source : GitHub Actions
3. Le workflow se déclenchera automatiquement à chaque push sur `main`
4. Mise à jour automatique toutes les 6 heures

URL du site : `https://[votre-username].github.io/calendrier-la-belle-electrique/`

## 📝 Structure du projet

```
├── app/
│   ├── page.tsx              # Page principale
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Styles globaux
├── components/
│   ├── ConcertCard.tsx       # Carte de concert
│   ├── CalendarView.tsx      # Vue calendrier
│   └── SearchAndFilter.tsx   # Recherche et filtres
├── lib/
│   └── scraper.ts            # Logique de scraping
├── types/
│   └── concert.ts            # Types TypeScript
├── scripts/
│   └── generate-data.js      # Script de génération de données
└── public/
    └── concerts.json         # Données des concerts

```

## ⚠️ Note importante sur le scraping

Le script de scraping actuel utilise Cheerio, qui ne peut pas exécuter JavaScript. Le site de La Belle Électrique charge probablement son contenu dynamiquement via JavaScript.

Pour un scraping fonctionnel, il faudrait :

1. Utiliser **Puppeteer** ou **Playwright** pour charger le JavaScript
2. Ou trouver l'API backend utilisée par le site (via l'onglet Network des DevTools)

Exemple avec Puppeteer :

```bash
npm install puppeteer
```

Puis adapter le script pour utiliser un navigateur headless.

## 📄 Licence

Projet non officiel créé à des fins éducatives. Les données appartiennent à La Belle Électrique.

## 🔗 Liens

- [Site officiel La Belle Électrique](https://www.la-belle-electrique.com)
- [Programmation officielle](https://www.la-belle-electrique.com/fr/programmation)
