import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Journey {
  id: string;
  title: string;
  slug: string;
  image_prompt: string | null;
  hero_image_url: string | null;
  short_description: string | null;
  arc_description: string | null;
  duration_days: number | null;
  price_eur: number | null;
  epic_price_eur: number | null;
  start_city: string | null;
  focus_type: string | null;
  route_sequence: string | null;
  category: string | null;
  destinations: string | null;
  journey_type: string | null;
  marketing_priority: string | null;
  published: boolean;
  show_on_journeys_page: boolean;
  featured_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  route_narrative: string | null;
  route_description: string | null;
  image_prompt: string | null;
  image_url: string | null;
  from_city: string | null;
  to_city: string | null;
  via_cities: string | null;
  region: string | null;
  route_type: string | null;
  travel_time_hours: number | null;
  day_duration_hours: number | null;
  difficulty_level: string | null;
  activities: string | null;
  meals: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// JOURNEY QUERIES
// =============================================

export async function getJourneys(options?: {
  published?: boolean;
  showOnJourneysPage?: boolean;
  featuredOnHomepage?: boolean;
  category?: string;
  includeHidden?: boolean;
}) {
  let query = supabase.from("journeys").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  } else if (!options?.includeHidden) {
    query = query.eq("published", true);
  }

  if (options?.showOnJourneysPage !== undefined) {
    query = query.eq("show_on_journeys_page", options.showOnJourneysPage);
  }

  if (options?.featuredOnHomepage !== undefined) {
    query = query.eq("featured_on_homepage", options.featuredOnHomepage);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query.order("duration_days", { ascending: true });

  if (error) {
    console.error("Error fetching journeys:", error);
    return [];
  }

  return data as Journey[];
}

export async function getJourneyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching journey:", error);
    return null;
  }

  return data as Journey;
}

// =============================================
// ROUTE QUERIES
// =============================================

export async function getRoutes(options?: {
  region?: string;
  routeType?: string;
  fromCity?: string;
  toCity?: string;
}) {
  let query = supabase.from("routes").select("*");

  if (options?.region) {
    query = query.eq("region", options.region);
  }

  if (options?.routeType) {
    query = query.eq("route_type", options.routeType);
  }

  if (options?.fromCity) {
    query = query.eq("from_city", options.fromCity);
  }

  if (options?.toCity) {
    query = query.eq("to_city", options.toCity);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching routes:", error);
    return [];
  }

  return data as Route[];
}

export async function getRouteById(id: string) {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching route:", error);
    return null;
  }

  return data as Route;
}

export async function getRoutesByIds(ids: string[]) {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching routes:", error);
    return [];
  }

  // Return in the same order as requested
  const routeMap = new Map(data.map((r) => [r.id, r]));
  return ids.map((id) => routeMap.get(id)).filter(Boolean) as Route[];
}

// =============================================
// HELPER: Transform to API format (matches existing API shape)
// =============================================

export function transformJourneyForAPI(journey: Journey) {
  return {
    slug: journey.slug,
    title: journey.title,
    heroImage: journey.hero_image_url,
    shortDescription: journey.short_description,
    description: journey.arc_description,
    durationDays: journey.duration_days,
    price: journey.price_eur,
    epicPrice: journey.epic_price_eur,
    startCity: journey.start_city,
    focus: journey.focus_type,
    category: journey.category,
    destinations: journey.destinations,
    routeSequence: journey.route_sequence,
    journeyType: journey.journey_type,
    marketingPriority: journey.marketing_priority,
    published: journey.published,
    showOnJourneysPage: journey.show_on_journeys_page,
    featuredOnHomepage: journey.featured_on_homepage,
    hidden: !journey.show_on_journeys_page,
  };
}

export function transformRouteForAPI(route: Route) {
  return {
    id: route.id,
    narrative: route.route_narrative,
    description: route.route_description,
    imagePrompt: route.image_prompt,
    imageUrl: route.image_url,
    fromCity: route.from_city,
    toCity: route.to_city,
    viaCities: route.via_cities,
    region: route.region,
    routeType: route.route_type,
    travelTimeHours: route.travel_time_hours,
    dayDurationHours: route.day_duration_hours,
    difficultyLevel: route.difficulty_level,
    activities: route.activities,
    meals: route.meals,
  };
}
