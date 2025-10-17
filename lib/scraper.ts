import axios from 'axios';
import * as cheerio from 'cheerio';
import { Concert } from '@/types/concert';

const BASE_URL = 'https://www.la-belle-electrique.com';

export async function scrapeConcerts(): Promise<Concert[]> {
  try {
    const response = await axios.get(`${BASE_URL}/fr/programmation`);
    const $ = cheerio.load(response.data);
    const concerts: Concert[] = [];

    // Find all event cards
    $('a[href*="/fr/programmation/"]').each((index, element) => {
      const $element = $(element);

      // Extract event URL
      const eventUrl = BASE_URL + $element.attr('href');

      // Extract image
      const imageUrl = $element.find('img').attr('src') || '';

      // Extract title
      const title = $element.find('h3, h2').first().text().trim();

      // Extract date and time
      const dateTimeText = $element.find('time, .date, p').filter((_, el) => {
        const text = $(el).text();
        return /\d{2}\.\d{2}\.\d{2}/.test(text);
      }).first().text().trim();

      // Parse date and time (format: "17.10.25 / 20h" or "Du 17.10.25 / 20h au 19.10.25 / 23h")
      let date = '';
      let time = '';
      let startDate = '';
      let endDate = '';

      if (dateTimeText.includes('Du ') && dateTimeText.includes(' au ')) {
        const matches = dateTimeText.match(/Du (\d{2}\.\d{2}\.\d{2}) \/ (\d{2}h\d{0,2}) au (\d{2}\.\d{2}\.\d{2}) \/ (\d{2}h\d{0,2})/);
        if (matches) {
          startDate = matches[1];
          endDate = matches[3];
          date = startDate;
          time = matches[2];
        }
      } else {
        const matches = dateTimeText.match(/(\d{2}\.\d{2}\.\d{2}) \/ (\d{2}h\d{0,2})/);
        if (matches) {
          date = matches[1];
          time = matches[2];
        }
      }

      // Extract genre and venue from text
      let genre = '';
      let venue = '';
      let eventType = 'Concert';

      $element.find('p, span, div').each((_, el) => {
        const text = $(el).text().trim();

        // Check for event type
        if (text.includes('Concert') || text.includes('Dressing Club') ||
            text.includes('Formation') || text.includes('Projection')) {
          eventType = text;
        }

        // Check for venue
        if (text.includes('Grande Salle') || text.includes('Bar') ||
            text.includes('Le Labo de La Belle')) {
          venue = text;
        }

        // Check for genre
        const genres = ['Pop', 'Metal', 'Techno', 'Rap', 'Rock', 'Électro',
                       'Hip-hop', 'Jazz', 'Indie', 'Punk'];
        genres.forEach(g => {
          if (text.includes(g)) {
            genre = g;
          }
        });
      });

      // Check if sold out
      const isSoldOut = $element.text().includes('COMPLET');

      // Only add if we have essential information
      if (title && date) {
        concerts.push({
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
      }
    });

    return concerts;
  } catch (error) {
    console.error('Error scraping concerts:', error);
    return [];
  }
}

// API route helper
export async function getConcertsData() {
  const concerts = await scrapeConcerts();

  // Sort by date
  concerts.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return concerts;
}

// Helper to parse date format DD.MM.YY
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(2000 + year, month - 1, day);
}
