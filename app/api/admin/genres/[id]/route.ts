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

  if (!userData || (userData.role !== "admin" && userData.role !== "editor")) {
    return { authorized: false, status: 403, message: "Forbidden" };
  }

  return { authorized: true, userId: user.id };
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("genres").delete().eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Genre Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
