import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const placesData = await getSheetData("places");
    
    // Filter published and featured places, sort by order
    const places = placesData
      .filter((p: any) => p.published === true || p.published === "TRUE")
      .map((p: any) => ({
        slug: p.slug || "",
        title: p.title || "",
        destination: p.destination || "",
        category: p.category || "",
        heroImage: p.heroImage || "",
        excerpt: p.excerpt || "",
        featured: p.featured === true || p.featured === "TRUE",
        order: parseInt(p.order) || 999,
      }))
      .sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ 
      success: true,
      places 
    });
  } catch (error: any) {
    console.error("GET /api/places error:", error);
    return NextResponse.json(
      { success: false, error: error.message, places: [] },
      { status: 500 }
    );
  }
}
