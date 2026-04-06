import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkAdminAuth(req: NextRequest) {
  const supabase = createServerClient();
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

  if (!userData || userData.role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden - Admin only" };
  }

  return { authorized: true, userId: user.id };
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const body = await request.json();

    // Settings would typically be stored in a settings table or cache
    // For now, we'll just validate and return success
    const { siteName, siteDescription, maintenanceMode, maxUploadSize } = body;

    if (!siteName || typeof siteName !== 'string') {
      return NextResponse.json({ error: "Invalid site name" }, { status: 400 });
    }

    return NextResponse.json({ success: true, settings: { siteName, siteDescription, maintenanceMode, maxUploadSize } });
  } catch (error) {
    console.error("[Settings API Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    // Return default settings
    return NextResponse.json({
      siteName: "Mugenime",
      siteDescription: "Free Anime Streaming Platform",
      maintenanceMode: false,
      maxUploadSize: 100,
    });
  } catch (error) {
    console.error("[Settings GET Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
