import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || (userData.role !== "admin" && userData.role !== "editor")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get stats
    const [
      { count: totalAnimes },
      { count: totalEpisodes },
      { count: totalUsers },
      { count: totalGenres },
    ] = await Promise.all([
      supabase.from("animes").select("*", { count: "exact", head: true }),
      supabase.from("episodes").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("genres").select("*", { count: "exact", head: true }),
    ]);

    // Get analytics (views)
    const { data: analyticsData } = await supabase
      .from("analytics")
      .select("views")
      .limit(1000);

    const totalViews = analyticsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;

    // Get recent animes
    const { data: recentAnimes } = await supabase
      .from("animes")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // Get popular animes
    const { data: analyticsWithAnimes } = await supabase
      .from("analytics")
      .select("anime_id, views, animes(title)")
      .order("views", { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalAnimes: totalAnimes || 0,
        totalEpisodes: totalEpisodes || 0,
        totalUsers: totalUsers || 0,
        totalGenres: totalGenres || 0,
        totalViews,
      },
      recentAnimes: recentAnimes || [],
      popularAnimes: analyticsWithAnimes || [],
    });
  } catch (error) {
    console.error("[Admin Stats Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
