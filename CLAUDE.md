# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a calendar application for La Belle Électrique, a French cultural venue in Grenoble. The official website (https://www.la-belle-electrique.com/fr/programmation) displays concerts in a list format without a proper calendar view, which is not very practical. This project scrapes the concert data and displays it in a beautiful, user-friendly calendar format with search and filtering capabilities.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web Scraping**: Cheerio + Axios
- **Date Handling**: date-fns

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
  - `/app/api/concerts/route.ts` - API endpoint that returns scraped concert data
- `/components` - React components
  - `ConcertCard.tsx` - Individual concert card display
  - `CalendarView.tsx` - Calendar grid view with concerts by date
  - `SearchAndFilter.tsx` - Search and filter controls
- `/lib` - Utility functions
  - `scraper.ts` - Web scraper for La Belle Électrique website
- `/types` - TypeScript type definitions
  - `concert.ts` - Concert data interface

## Key Features

1. **Web Scraping**: Scrapes concert data from La Belle Électrique's website including title, date, time, genre, venue, images, and sold-out status
2. **Dual View Modes**: Toggle between grid view (cards) and calendar view
3. **Search & Filters**: Search by artist name, filter by genre or venue
4. **Dark Theme**: Styled to match La Belle Électrique's dark aesthetic (zinc-900/950 color scheme)
5. **Responsive Design**: Works on mobile, tablet, and desktop

## Data Flow

1. User visits the site → `app/page.tsx` fetches from `/api/concerts`
2. API route → calls `getConcertsData()` from `lib/scraper.ts`
3. Scraper fetches and parses HTML from La Belle Électrique's website
4. Data is transformed into `Concert[]` objects and returned to the client
5. Client-side filtering and display in chosen view mode

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

## Important Notes

- The scraper parses dates in French format (DD.MM.YY)
- API route has revalidation set to 3600 seconds (1 hour)
- Image URLs come directly from La Belle Électrique's CDN
- The scraper is designed to be resilient to HTML structure changes but may need updates if the source website changes significantly
