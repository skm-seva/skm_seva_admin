import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, phone, otp, pin } = await req.json();

    /* 1️⃣ Find admin */
    let q = supabase
      .from("admin_users")
      .select("id, pin_hash, is_active");

    if (email) q = q.eq("email", email.toLowerCase().trim());
    if (phone) q = q.eq("phone", phone.trim());

    const { data: admin } = await q.single();

    if (!admin || !admin.is_active) {
      return NextResponse.json({ error: "Invalid" }, { status: 401 });
    }

    /* 2️⃣ Verify OTP */
    const { data: otpRow } = await supabase
      .from("admin_otp_sessions")
      .select("id, otp_hash")
      .eq("admin_id", admin.id)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!otpRow || !(await bcrypt.compare(otp, otpRow.otp_hash))) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    /* 3️⃣ Verify PIN */
    if (!(await bcrypt.compare(pin, admin.pin_hash))) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    /* 4️⃣ Mark OTP used */
    await supabase
      .from("admin_otp_sessions")
      .update({ used: true })
      .eq("id", otpRow.id);

    /* 5️⃣ CREATE ADMIN SESSION (DB) */
    const sessionId = crypto.randomUUID();

    await supabase.from("admin_sessions").insert({
      id: sessionId,
      admin_id: admin.id,
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    /* 6️⃣ SET COOKIE */
    const res = NextResponse.json({ success: true });

    res.cookies.set("seva_admin_token", sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 8, // 8 hours
});


    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
