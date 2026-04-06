import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAdminAuth(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, status: 401, message: "Unauthorized" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || (userData.role !== "admin" && userData.role !== "editor" && userData.role !== "viewer")) {
    return { authorized: false, status: 403, message: "Forbidden" };
  }

  return { authorized: true, userId: user.id };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabase = createServerClient();

    // Get total views
    const { data: analyticsData } = await supabase
      .from("analytics")
      .select("views");

    const totalViews = analyticsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;

    // Get top animes by views
    const { data: topAnimesData } = await supabase
      .from("analytics")
      .select("anime_id, views, animes(title)")
      .order("views", { ascending: false })
      .limit(10);

    const topAnimes = topAnimesData?.map((item: any) => ({
      title: item.animes?.title || "Unknown",
      views: item.views,
    })) || [];

    // Generate mock daily views (last 30 days)
    const dailyViews = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(Math.random() * 1000) + 100,
      };
    });

    return NextResponse.json({
      totalViews,
      topAnimes,
      dailyViews,
      viewsByAnime: topAnimes,
    });
  } catch (error) {
    console.error("[Analytics API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
