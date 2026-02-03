

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, phone, otp, pin } = await req.json();

    // 1️⃣ Find admin
    let q = supabase
      .from("admin_users")
      .select("id, email, pin_hash, is_active");

    if (email) q = q.eq("email", email.toLowerCase().trim());
    if (phone) q = q.eq("phone", phone.trim());

    const { data: admin } = await q.single();

    if (!admin || !admin.is_active) {
      return NextResponse.json({ error: "Invalid" }, { status: 401 });
    }

    // 2️⃣ Verify OTP
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
      return NextResponse.json({ error: "Invalid" }, { status: 401 });
    }

    // 3️⃣ Verify PIN
    if (!(await bcrypt.compare(pin, admin.pin_hash))) {
      return NextResponse.json({ error: "Invalid" }, { status: 401 });
    }

    // 4️⃣ Mark OTP used
    await supabase
      .from("admin_otp_sessions")
      .update({ used: true })
      .eq("id", otpRow.id);

    // 🔐 5️⃣ CREATE SECURE ADMIN SESSION (JWT)
    const token = jwt.sign(
      { admin_id: admin.id },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: "8h" }
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("seva_admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    console.log("ADMIN SESSION COOKIE SET");

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
