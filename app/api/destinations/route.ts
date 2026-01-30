import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const destinationsData = await getSheetData("destinations");
    
    const destinations = destinationsData
      .filter((d: any) => d.published === true || d.published === "TRUE")
      .map((d: any) => ({
        slug: d.slug || "",
        title: d.title || "",
        subtitle: d.subtitle || "",
        region: d.region || "",
        heroImage: d.heroImage || "",
        excerpt: d.excerpt || "",
        featured: d.featured === true || d.featured === "TRUE",
        order: parseInt(d.order) || 999,
      }))
      .sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ 
      success: true,
      destinations 
    });
  } catch (error: any) {
    console.error("GET /api/destinations error:", error);
    return NextResponse.json(
      { success: false, error: error.message, destinations: [] },
      { status: 500 }
    );
  }
}
