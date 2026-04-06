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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("users")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("[Update User Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
