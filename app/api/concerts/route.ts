import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

const BASE_URL = 'https://www.la-belle-electrique.com';

interface Concert {
  id: string;
  title: string;
  date: string;
  time: string;
  genre: string;
  venue: string;
  imageUrl: string;
  eventUrl: string;
  isSoldOut: boolean;
  eventType: string;
  startDate: string;
  endDate: string;
}

async function scrapeConcerts(): Promise<Concert[]> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    console.log('Navigating to La Belle Électrique...');
    await page.goto(`${BASE_URL}/fr/programmation`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Waiting for content...');

    // Wait for any element that might indicate content is loaded
    try {
      await page.waitForSelector('a, article, div', { timeout: 10000 });
    } catch (e) {
      console.log('No selector found, continuing anyway');
    }

    // Scroll to load lazy content
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve(null);
          }
        }, 100);
      });
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const concerts = await page.evaluate((baseUrl) => {
      const concertElements: Concert[] = [];

      // Debug: log what we find
      console.log('Total links on page:', document.querySelectorAll('a').length);
      console.log('Total articles on page:', document.querySelectorAll('article').length);
      console.log('Total divs on page:', document.querySelectorAll('div').length);

      // Try to find ALL links with text that has dates
      const allLinks = Array.from(document.querySelectorAll('a'));
      console.log('Checking', allLinks.length, 'links for date patterns');

      let elements: Element[] = allLinks.filter(a => {
        const text = a.textContent || '';
        const hasDate = /\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}/.test(text) ||
                       text.match(/\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i);
        if (hasDate) {
          console.log('Found link with date:', a.href, text.substring(0, 100));
        }
        return hasDate;
      });

      console.log('Found', elements.length, 'links with dates');

      // If still nothing, try to find common event card patterns
      if (elements.length === 0) {
        const possibleContainers = Array.from(document.querySelectorAll('article, [class*="card"], [class*="event"], li'));
        elements = possibleContainers.filter(el => {
          const text = el.textContent || '';
          const hasDate = /\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}/.test(text);
          const hasLink = el.querySelector('a') !== null;
          return hasDate && hasLink;
        });
        console.log('Found', elements.length, 'container elements with dates');
      }

      elements.forEach((element, index) => {
        try {
          const eventUrl = (element as HTMLAnchorElement).href || element.querySelector('a')?.href || '';

          if (!eventUrl || !eventUrl.includes(baseUrl)) return;

          const img = element.querySelector('img');
          const imageUrl = img?.src || img?.getAttribute('data-src') || '';

          const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
          const title = titleElement?.textContent?.trim() || '';

          if (!title) return;

          const allText = element.textContent || '';

          let date = '';
          let time = '';
          let startDate = '';
          let endDate = '';

          const multiDayMatch = allText.match(/Du (\d{2}\.\d{2}\.\d{2})\s*\/\s*(\d{2}h\d{0,2})\s*au\s*(\d{2}\.\d{2}\.\d{2})\s*\/\s*(\d{2}h\d{0,2})/i);
          if (multiDayMatch) {
            startDate = multiDayMatch[1];
            endDate = multiDayMatch[3];
            date = startDate;
            time = multiDayMatch[2];
          } else {
            const singleDayMatch = allText.match(/(\d{2}\.\d{2}\.\d{2})\s*\/\s*(\d{2}h\d{0,2})/);
            if (singleDayMatch) {
              date = singleDayMatch[1];
              time = singleDayMatch[2];
            }
          }

          if (!date) return;

          const genres = ['Pop', 'Metal', 'Techno', 'Rap', 'Rock', 'Électro', 'Electro',
                         'Hip-hop', 'Hip hop', 'Jazz', 'Indie', 'Punk', 'Folk', 'Blues',
                         'Reggae', 'Soul', 'Funk', 'House', 'Drum', 'Bass'];
          let genre = '';
          for (const g of genres) {
            if (allText.includes(g)) {
              genre = g;
              break;
            }
          }

          let venue = '';
          const venues = ['Grande Salle', 'Bar', 'Le Labo de La Belle', 'Labo'];
          for (const v of venues) {
            if (allText.includes(v)) {
              venue = v;
              break;
            }
          }

          let eventType = 'Concert';
          const types = ['Dressing Club', 'Formation', 'Projection', 'Concert'];
          for (const t of types) {
            if (allText.includes(t)) {
              eventType = t;
              break;
            }
          }

          const isSoldOut = allText.includes('COMPLET') || allText.includes('complet') ||
                           allText.includes('Sold out') || allText.includes('sold out');

          concertElements.push({
            id: `${date}-${index}`,
            title,
            date,
            time,
            genre,
            venue,
            imageUrl,
            eventUrl,
            isSoldOut,
            eventType,
            startDate,
            endDate,
          });
        } catch (error) {
          console.error('Error extracting concert data:', error);
        }
      });

      return concertElements;
    }, BASE_URL);

    // Sort by date
    concerts.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    return concerts;
  } catch (error) {
    console.error('Error scraping concerts:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(2000 + year, month - 1, day);
}

export async function GET() {
  try {
    const concerts = await scrapeConcerts();
    console.log(`API: Found ${concerts.length} concerts`);

    // Cache for 1 hour
    return NextResponse.json(concerts, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concerts' },
      { status: 500 }
    );
  }
}
