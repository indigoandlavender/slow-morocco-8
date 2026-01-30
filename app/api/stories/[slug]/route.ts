import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const stories = await getSheetData('Stories');
    
    const story = stories.find((s: any) => s.slug === params.slug);
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Convert <br> to newlines in body
    const processedStory = {
      ...story,
      body: story.body ? story.body.replace(/<br>/g, '\n') : '',
    };

    // Get story images
    const storyImages = await getSheetData('Story_Images');
    const images = storyImages
      .filter((img: any) => img.story_slug === params.slug && img.image_url)
      .sort((a: any, b: any) => (parseInt(a.image_order) || 0) - (parseInt(b.image_order) || 0));

    return NextResponse.json({ story: processedStory, images });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}
