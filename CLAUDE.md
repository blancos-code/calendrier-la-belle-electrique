# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a calendar application for La Belle Électrique, a French cultural venue in Grenoble. The official website displays concerts in a list format without a proper calendar view. This project scrapes concert data in real-time and displays it in a beautiful, user-friendly calendar format with search and filtering capabilities.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web Scraping**: Puppeteer (server-side)
- **Date Handling**: date-fns
- **Deployment**: Vercel (free tier with serverless functions)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

The development server runs on http://localhost:3000

## Project Structure

- `/app` - Next.js app router pages and API routes
  - `/app/page.tsx` - Main page with concert grid/calendar view
  - `/app/api/concerts/route.ts` - API endpoint that scrapes and returns concert data
- `/components` - React components
  - `ConcertCard.tsx` - Individual concert card display
  - `CalendarView.tsx` - Calendar grid view with concerts by date
  - `SearchAndFilter.tsx` - Search and filter controls
- `/lib` - Utility functions (deprecated scraper.ts, now in API route)
- `/types` - TypeScript type definitions
  - `concert.ts` - Concert data interface

## Key Features

1. **Real-time Web Scraping**: Uses Puppeteer in serverless API route to scrape data on-demand
2. **Server-Side Scraping**: Scraping happens on Vercel's backend, not client-side
3. **Caching**: API responses cached for 1 hour to reduce load
4. **Dual View Modes**: Toggle between grid view (cards) and calendar view
5. **Search & Filters**: Search by artist name, filter by genre or venue
6. **Dark Theme**: Styled to match La Belle Électrique's dark aesthetic (zinc-900/950)
7. **Responsive Design**: Works on mobile, tablet, and desktop

## Data Flow

1. User visits the site → `app/page.tsx` fetches from `/api/concerts`
2. API route (`app/api/concerts/route.ts`) launches Puppeteer
3. Puppeteer scrapes https://www.la-belle-electrique.com/fr/programmation
4. Data is parsed and returned as JSON
5. Response cached for 1 hour (s-maxage=3600)
6. Client-side filtering and display in chosen view mode

## Concert Data Structure

```typescript
interface Concert {
  id: string;           // Unique identifier
  title: string;        // Artist/event name
  date: string;         // Format: DD.MM.YY
  time: string;         // Format: HHh or HHhMM
  genre: string;        // Musical genre
  venue: string;        // Concert venue (Grande Salle, Bar, Le Labo)
  imageUrl: string;     // Event image URL
  eventUrl: string;     // Link to official event page
  isSoldOut: boolean;   // Whether tickets are sold out
  eventType: string;    // Concert, Dressing Club, Formation, etc.
  startDate?: string;   // For multi-day events
  endDate?: string;     // For multi-day events
}
```

## Deployment on Vercel

### Initial Setup

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

Or use the Vercel dashboard:
1. Go to https://vercel.com
2. Import the GitHub repository
3. Vercel will auto-detect Next.js and deploy

### Important Notes

- **Puppeteer on Vercel**: Vercel supports Puppeteer in serverless functions
- **Cold Starts**: First request may be slow (3-5s) as Puppeteer initializes
- **Caching**: Responses are cached for 1 hour to improve performance
- **Free Tier Limits**: 100GB bandwidth/month, sufficient for this use case

### Environment Variables

No environment variables required for basic functionality.

## Scraping Notes

The scraper in `app/api/concerts/route.ts`:
- Uses Puppeteer in headless mode
- Scrolls the page to load lazy content
- Tries multiple selectors to find event elements
- Looks for dates in format DD.MM.YY
- Extracts genre, venue, sold-out status from text content

**Known Issue**: The La Belle Électrique website may load content dynamically. The current scraper might not find events if the HTML structure has changed. To debug:
1. Check the website structure in browser DevTools
2. Update the selectors in the `page.evaluate()` function
3. Consider finding their API endpoint (check Network tab)
