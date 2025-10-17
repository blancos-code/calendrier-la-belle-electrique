# Calendrier La Belle Électrique

Application web qui affiche les concerts et événements de La Belle Électrique dans un format calendrier interactif.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/blancos-code/calendrier-la-belle-electrique)

## 🎵 Fonctionnalités

- **Vue grille et calendrier** : Deux modes d'affichage pour explorer les événements
- **Recherche** : Trouver rapidement un artiste ou événement
- **Filtres** : Par genre musical et salle
- **Scraping en temps réel** : Données toujours à jour depuis le site officiel
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
npm start
```

## 📦 Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **Puppeteer** - Web scraping côté serveur
- **date-fns** - Manipulation des dates
- **Vercel** - Déploiement et hébergement

## 🌐 Déploiement sur Vercel

### Option 1 : Déploiement en un clic

Cliquez sur le bouton ci-dessous pour déployer sur Vercel :

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/blancos-code/calendrier-la-belle-electrique)

### Option 2 : Depuis GitHub

1. Poussez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur "New Project"
4. Importez votre repository GitHub
5. Vercel détectera automatiquement Next.js et déploiera

### Option 3 : Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Après le déploiement

Votre site sera disponible sur : `https://votre-projet.vercel.app`

**Notes importantes :**
- Le scraping se fait côté serveur (gratuit sur Vercel)
- Les réponses sont cachées pendant 1 heure
- Premier chargement peut prendre 3-5s (cold start de Puppeteer)
- Ensuite, les requêtes sont très rapides grâce au cache

## 📝 Structure du projet

```
├── app/
│   ├── page.tsx                  # Page principale
│   ├── layout.tsx                # Layout global
│   ├── globals.css               # Styles globaux
│   └── api/
│       └── concerts/
│           └── route.ts          # API route avec Puppeteer
├── components/
│   ├── ConcertCard.tsx           # Carte de concert
│   ├── CalendarView.tsx          # Vue calendrier
│   └── SearchAndFilter.tsx       # Recherche et filtres
├── types/
│   └── concert.ts                # Types TypeScript
└── lib/
    └── scraper.ts                # (Déprécié - code dans API route)
```

## ⚙️ Comment ça marche

1. L'utilisateur visite le site
2. Le frontend appelle `/api/concerts`
3. L'API route lance Puppeteer (côté serveur)
4. Puppeteer charge la page de La Belle Électrique
5. Les données sont extraites et parsées
6. JSON renvoyé au client et caché 1 heure
7. Affichage dans l'interface

## 🔧 Personnalisation du scraper

Si le site de La Belle Électrique change et que le scraper ne fonctionne plus :

1. Ouvrez `app/api/concerts/route.ts`
2. Modifiez les sélecteurs dans la fonction `page.evaluate()`
3. Testez localement avec `npm run dev`
4. Consultez la console pour les logs de debugging

Ou trouvez l'API backend du site :
1. Ouvrez les DevTools (F12)
2. Onglet Network
3. Filtrez par XHR/Fetch
4. Cherchez les appels qui chargent les événements
5. Utilisez cette API directement au lieu de scraper

## 📄 Licence

Projet non officiel créé à des fins éducatives. Les données appartiennent à La Belle Électrique.

## 🔗 Liens

- [Site officiel La Belle Électrique](https://www.la-belle-electrique.com)
- [Programmation officielle](https://www.la-belle-electrique.com/fr/programmation)
- [Déployer sur Vercel](https://vercel.com)
