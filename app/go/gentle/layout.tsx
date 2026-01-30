import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gentle Journeys | Morocco at Your Pace | Slow Morocco",
  description: "Private journeys through Morocco designed for travellers with mobility challenges. Accessible routes, shorter drives, ground-floor accommodations, and a team that understands your needs.",
  openGraph: {
    title: "Gentle Journeys | Morocco at Your Pace",
    description: "Private journeys through Morocco designed for travellers with mobility challenges.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200",
        width: 1200,
        height: 630,
        alt: "Gentle Journeys - Morocco at Your Pace",
      },
    ],
  },
};

export default function GentleLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
