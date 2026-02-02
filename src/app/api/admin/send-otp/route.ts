export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Invalid login attempt" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("admin_users")
      .select("id, is_active");

    if (email) {
      query = query.eq("email", email.trim().toLowerCase());
    }

    if (phone) {
      query = query.eq("phone", phone.trim());
    }

    const { data: admin, error } = await query.single();

    if (error || !admin || !admin.is_active) {
      return NextResponse.json(
        { error: "Invalid login attempt" },
        { status: 401 }
      );
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await supabase.from("admin_otp_sessions").insert({
      admin_id: admin.id,
      otp_hash: otpHash,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });

    console.log("ADMIN OTP:", otp); // dev only

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid login attempt" },
      { status: 500 }
    );
  }
}
