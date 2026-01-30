import { Metadata } from "next";
import FAQSchema from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Explore our curated Morocco journeys — from Sahara desert expeditions to Atlas Mountain treks, Imperial Cities tours to coastal escapes. Private, customizable itineraries designed around what matters to you.",
  openGraph: {
    title: "Morocco Journeys | Slow Morocco",
    description: "Explore our curated Morocco journeys — from Sahara desert expeditions to Atlas Mountain treks.",
    url: "https://slowmorocco.com/journeys",
  },
  alternates: {
    canonical: "https://slowmorocco.com/journeys",
  },
};

const journeysFAQs = [
  {
    question: "Are Slow Morocco tours private?",
    answer: "Yes, all journeys are private. You travel only with your group, never with strangers.",
  },
  {
    question: "Can I customize my Morocco itinerary?",
    answer: "Absolutely. Every journey bends to your interests. Add days, skip cities, stay longer anywhere.",
  },
  {
    question: "What is included in the tour price?",
    answer: "Private transport, handpicked accommodations, local guides, and curated experiences throughout.",
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend 2-3 months ahead, especially for peak season (March-May, September-November).",
  },
  {
    question: "What makes Slow Morocco different?",
    answer: "We offer access to people and places others miss. A 20-year network of artisans, musicians, and guides.",
  },
];

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQSchema faqs={journeysFAQs} />
      {children}
    </>
  );
}
