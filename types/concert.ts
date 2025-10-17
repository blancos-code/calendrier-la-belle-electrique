export interface Concert {
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
  startDate?: string;
  endDate?: string;
}
