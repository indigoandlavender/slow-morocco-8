import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const stories = await getSheetData('Stories');
    
    // Filter published stories and convert <br> to newlines
    const publishedStories = stories
      .filter((story: any) => {
        const pub = String(story.published || '').toLowerCase().trim();
        return pub === 'true' || pub === 'yes' || pub === '1';
      })
      .map((story: any) => ({
        ...story,
        body: story.body ? story.body.replace(/<br>/g, '\n') : '',
      }))
      .sort((a: any, b: any) => {
        const orderA = parseInt(a.order) || 999;
        const orderB = parseInt(b.order) || 999;
        return orderA - orderB;
      });

    return NextResponse.json({ stories: publishedStories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ stories: [], error: 'Failed to fetch stories' }, { status: 500 });
  }
}
