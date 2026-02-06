import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { findRelatedStories } from "@/lib/content-matcher";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return auth;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destinations = searchParams.get("destinations") || "";
  const focus = searchParams.get("focus") || "";
  const limit = parseInt(searchParams.get("limit") || "4");

  if (!destinations) {
    return NextResponse.json({ stories: [] });
  }

  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Fetch all stories
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Stories!A:Z",
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ stories: [] });
    }

    const headers = rows[0].map((h: string) => h.toLowerCase().replace(/\s+/g, "_"));
    const stories = rows.slice(1).map((row) => {
      const story: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        story[header] = row[index] || "";
      });
      return story;
    });

    // Filter to published stories only
    const publishedStories = stories.filter(
      (s) => s.published?.toLowerCase() === "true" || s.published === "TRUE"
    );

    // Find related stories
    const related = findRelatedStories(
      destinations,
      focus,
      publishedStories.map((s) => ({
        slug: s.slug,
        title: s.title,
        region: s.region,
        tags: s.tags,
        category: s.category,
        heroImage: s.heroimage || s.hero_image,
        excerpt: s.excerpt,
      })),
      limit
    );

    return NextResponse.json({ stories: related });
  } catch (error) {
    console.error("Error fetching related stories:", error);
    return NextResponse.json({ stories: [] });
  }
}
