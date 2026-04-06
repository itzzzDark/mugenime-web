import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false, error: "Not authenticated" }, { status: 401 });
    }

    // Check user role from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ isAdmin: false, error: "User not found" }, { status: 404 });
    }

    const isAdmin = userData.role === "admin" || userData.role === "editor";

    return NextResponse.json({
      isAdmin,
      role: userData.role,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("[Admin Auth Error]", error);
    return NextResponse.json({ isAdmin: false, error: "Internal server error" }, { status: 500 });
  }
}
