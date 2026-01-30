import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    const rows = await getSheetData("Page_Banners");
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ banners: [], banner: null });
    }

    const banners = rows.map((row: any) => ({
      page_slug: row.page_slug || row.Page_Slug || "",
      hero_image_url: convertDriveUrl(row.hero_image_url || row.Hero_Image_URL || ""),
      midjourney: row.midjourney || row.Midjourney || "",
      title: row.title || row.Title || "",
      subtitle: row.subtitle || row.Subtitle || "",
      label_text: row.label_text || row.Label_Text || "",
    }));

    // If slug provided, return single banner
    if (slug) {
      const banner = banners.find((b: any) => b.page_slug === slug);
      return NextResponse.json({ banner: banner || null });
    }

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Page Banners API error:", error);
    return NextResponse.json({ error: "Failed to fetch page banners", banners: [], banner: null }, { status: 500 });
  }
}
