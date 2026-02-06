import { Metadata } from "next";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

interface PlaceData {
  Slug: string;
  Title: string;
  Destination?: string;
  Category?: string;
  HeroImage?: string;
  Body?: string;
}

async function getPlace(slug: string): Promise<PlaceData | null> {
  try {
    const places = await getSheetData("Places");
    const place = places.find(
      (p: any) => p.Slug === slug && p.Published?.toLowerCase() === "true"
    );
    return place || null;
  } catch (error) {
    console.error("Error fetching place for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place) {
    return {
      title: "Place Not Found",
      description: "The requested place could not be found.",
    };
  }

  const title = place.Title;
  // Strip HTML and get first 160 chars from body
  const bodyText = place.Body?.replace(/<[^>]*>/g, '') || '';
  const description = bodyText.slice(0, 160) || 
    `Discover ${place.Title} in ${place.Destination || 'Morocco'} - a guide from Slow Morocco.`;
  const heroImage = place.HeroImage ? convertDriveUrl(place.HeroImage) : null;

  return {
    title: `${title} | ${place.Destination || 'Morocco'}`,
    description: description,
    keywords: [
      place.Title?.toLowerCase(),
      place.Destination?.toLowerCase(),
      place.Category?.toLowerCase(),
      "morocco places",
      "morocco guide",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://slowmorocco.com/places/${slug}`,
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
      canonical: `https://slowmorocco.com/places/${slug}`,
    },
  };
}

export default function PlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
