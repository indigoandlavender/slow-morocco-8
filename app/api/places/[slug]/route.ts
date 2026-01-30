import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const placesData = await getSheetData("places");
    
    const place = placesData.find((p: any) => p.slug === slug);
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      place: {
        slug: place.slug || "",
        title: place.title || "",
        destination: place.destination || "",
        category: place.category || "",
        address: place.address || "",
        openingHours: place.opening_hours || "",
        fees: place.fees || "",
        notes: place.notes || "",
        heroImage: place.heroImage || "",
        heroCaption: place.heroCaption || "",
        excerpt: place.excerpt || "",
        body: place.body || "",
        sources: place.sources || "",
        tags: place.tags || "",
      },
    });
  } catch (error: any) {
    console.error("GET /api/places/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
