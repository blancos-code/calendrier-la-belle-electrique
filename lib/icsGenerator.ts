import { Concert } from '@/types/concert';

export function generateICS(concert: Concert): string {
  // Parse concert date (format: dd.mm.yy)
  const [day, month, year] = concert.date.split('.').map(Number);
  const fullYear = 2000 + year;

  // Parse time if available (format: "20h" or "20h30")
  let hours = 20;
  let minutes = 0;
  if (concert.time) {
    const timeMatch = concert.time.match(/(\d+)h(\d+)?/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    }
  }

  const startDate = new Date(fullYear, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // +3 hours default duration

  // Format dates for ICS (YYYYMMDDTHHMMSS)
  const formatICSDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  };

  const startDateStr = formatICSDate(startDate);
  const endDateStr = formatICSDate(endDate);
  const now = formatICSDate(new Date());

  // Build description
  let description = concert.title;
  if (concert.genre) description += `\\nGenre: ${concert.genre}`;
  if (concert.venue) description += `\\nLieu: ${concert.venue}`;
  description += `\\n\\nPlus d'infos: ${concert.eventUrl}`;

  // Build ICS content
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendrier La Belle Électrique//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:La Belle Électrique',
    'X-WR-TIMEZONE:Europe/Paris',
    'BEGIN:VEVENT',
    `UID:${concert.id}@la-belle-electrique`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `SUMMARY:${concert.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:La Belle Électrique - ${concert.venue || 'Grenoble'}`,
    `URL:${concert.eventUrl}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

export function generateMultipleICS(concerts: Concert[]): string {
  const now = formatICSDate(new Date());

  const events = concerts.map(concert => {
    // Parse concert date
    const [day, month, year] = concert.date.split('.').map(Number);
    const fullYear = 2000 + year;

    // Parse time
    let hours = 20;
    let minutes = 0;
    if (concert.time) {
      const timeMatch = concert.time.match(/(\d+)h(\d+)?/);
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      }
    }

    const startDate = new Date(fullYear, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const startDateStr = formatICSDate(startDate);
    const endDateStr = formatICSDate(endDate);

    let description = concert.title;
    if (concert.genre) description += `\\nGenre: ${concert.genre}`;
    if (concert.venue) description += `\\nLieu: ${concert.venue}`;
    description += `\\n\\nPlus d'infos: ${concert.eventUrl}`;

    return [
      'BEGIN:VEVENT',
      `UID:${concert.id}@la-belle-electrique`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDateStr}`,
      `DTEND:${endDateStr}`,
      `SUMMARY:${concert.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:La Belle Électrique - ${concert.venue || 'Grenoble'}`,
      `URL:${concert.eventUrl}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT'
    ].join('\r\n');
  }).join('\r\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calendrier La Belle Électrique//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:La Belle Électrique - Concerts',
    'X-WR-TIMEZONE:Europe/Paris',
    events,
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

export function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
