import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET() {
  try {
    const regionsData = await getSheetData("regions");
    
    const regions = regionsData
      .map((r: any) => ({
        slug: r.slug || "",
        title: r.title || "",
        subtitle: r.subtitle || "",
        heroImage: r.heroImage || "",
        order: parseInt(r.order) || 999,
      }))
      .sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ 
      success: true,
      regions 
    });
  } catch (error: any) {
    console.error("GET /api/regions error:", error);
    return NextResponse.json(
      { success: false, error: error.message, regions: [] },
      { status: 500 }
    );
  }
}
