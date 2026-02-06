import { Metadata } from "next";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

interface StoryData {
  Slug: string;
  Title: string;
  Subtitle?: string;
  Excerpt?: string;
  HeroImage?: string;
  Category?: string;
  PublishedAt?: string;
}

async function getStory(slug: string): Promise<StoryData | null> {
  try {
    const stories = await getSheetData("Stories");
    const story = stories.find(
      (s: any) => s.Slug === slug && s.Published?.toLowerCase() === "true"
    );
    return story || null;
  } catch (error) {
    console.error("Error fetching story for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);

  if (!story) {
    return {
      title: "Story Not Found",
      description: "The requested story could not be found.",
    };
  }

  const title = story.Title;
  const description = story.Excerpt?.slice(0, 160) || 
    story.Subtitle ||
    `Read ${story.Title} - a story from Slow Morocco about travel, culture, and discovery in Morocco.`;
  const heroImage = story.HeroImage ? convertDriveUrl(story.HeroImage) : null;

  return {
    title: title,
    description: description,
    keywords: [
      "morocco travel",
      "morocco stories",
      "morocco culture",
      story.Category?.toLowerCase(),
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://slowmorocco.com/story/${slug}`,
      type: "article",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      ...(story.PublishedAt && {
        publishedTime: story.PublishedAt,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Slow Morocco`,
      description: description,
      images: heroImage ? [heroImage] : undefined,
    },
    alternates: {
      canonical: `https://slowmorocco.com/story/${slug}`,
    },
  };
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
