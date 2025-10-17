import { NextResponse } from 'next/server';
import { getConcertsData } from '@/lib/scraper';

export async function GET() {
  try {
    const concerts = await getConcertsData();
    return NextResponse.json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concerts' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600; // Revalidate every hour
