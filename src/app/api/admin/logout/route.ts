import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../_lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST() {
  // ✅ FIX: await cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get("seva_admin_token")?.value;

  if (token) {
    await supabaseAdmin
      .from("admin_sessions")
      .delete()
      .eq("id", token);
  }

  const res = NextResponse.json({ success: true });

  // ✅ clear cookie
 res.cookies.set("seva_admin_token", "", {
  expires: new Date(0),
  path: "/",
});


  return res;
}
