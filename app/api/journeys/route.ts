import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "true";
    
    const journeys = await getSheetData("Website_Journeys");
    
    // Map to consistent format - matching your exact column names
    const formattedJourneys = journeys
      .filter((j: any) => {
        if (includeHidden) return true; // Return all journeys when includeHidden is true
        const pub = String(j.Published || "").toLowerCase().trim();
        return pub === "true" || pub === "yes" || pub === "1";
      })
      .map((j: any) => {
        const pub = String(j.Published || "").toLowerCase().trim();
        const isPublished = pub === "true" || pub === "yes" || pub === "1";
        
        return {
          slug: j.Slug || "",
          title: j.Title || "",
          duration: j.Duration_Days ? `${j.Duration_Days}-Day` : "",
          durationDays: parseInt(j.Duration_Days) || 0,
          description: j.Short_Description || "",
          shortDescription: j.Short_Description || "",
          arcDescription: j.Arc_Description || "",
          heroImage: convertDriveUrl(j.Hero_Image_URL || ""),
          price: parseInt(j.Price_EUR) || 0,
          startCity: j.Start_City || "",
          focus: j.Focus_Type || "",
          category: j.Category || "",
          journeyId: j.Journey_ID || "",
          destinations: j.Destinations || "",
          journeyType: j.Journey_Type || "regular",
          epicPrice: j.Epic_Price_EUR ? parseInt(j.Epic_Price_EUR) : null,
          hidden: !isPublished, // Flag to indicate if journey is hidden
        };
      });

    return NextResponse.json({
      success: true,
      journeys: formattedJourneys,
    });
  } catch (error: any) {
    console.error("Journeys fetch error:", error);
    return NextResponse.json(
      { success: false, journeys: [], error: error.message },
      { status: 500 }
    );
  }
}
