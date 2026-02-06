import { Metadata } from "next";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

interface JourneyData {
  Slug: string;
  Title: string;
  Description: string;
  HeroImage?: string;
  Duration?: string;
  DurationDays?: string;
  StartCity?: string;
  Destinations?: string;
  Price?: string;
  EpicPrice?: string;
  JourneyType?: string;
}

async function getJourney(slug: string): Promise<JourneyData | null> {
  try {
    const journeys = await getSheetData("Journeys");
    const journey = journeys.find(
      (j: any) => j.Slug === slug && j.Published?.toLowerCase() === "true"
    );
    return journey || null;
  } catch (error) {
    console.error("Error fetching journey for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourney(slug);

  if (!journey) {
    return {
      title: "Journey Not Found",
      description: "The requested journey could not be found.",
    };
  }

  const title = journey.Title;
  const description = journey.Description?.slice(0, 160) || 
    `Discover ${journey.Title} - a ${journey.Duration || "multi-day"} private journey through Morocco with Slow Morocco.`;
  const heroImage = journey.HeroImage ? convertDriveUrl(journey.HeroImage) : null;
  const isEpic = journey.JourneyType?.toLowerCase() === "epic";

  return {
    title: title,
    description: description,
    keywords: [
      "morocco tour",
      "private morocco journey",
      journey.StartCity?.toLowerCase(),
      ...(journey.Destinations?.split(",").map((d: string) => d.trim().toLowerCase()) || []),
      isEpic ? "epic morocco journey" : "morocco itinerary",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://slowmorocco.com/journeys/${slug}`,
      type: "website",
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Slow Morocco`,
      description: description,
      images: heroImage ? [heroImage] : undefined,
    },
    alternates: {
      canonical: `https://slowmorocco.com/journeys/${slug}`,
    },
  };
}

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
