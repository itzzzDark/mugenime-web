/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serverId = searchParams.get("id");

  if (!serverId) {
    return NextResponse.json({ error: "Server ID wajib ada" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("streaming_links")
      .select("url")
      .eq("id", serverId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Link tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error("[API Server Proxy Error]", error);
    return NextResponse.json(
      { error: "Gagal mengambil URL video" },
      { status: error.status || 500 }
    );
  }
}
