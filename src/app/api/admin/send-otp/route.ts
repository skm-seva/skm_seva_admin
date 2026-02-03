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
    const { email, phone, otp } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Invalid login attempt" },
        { status: 400 }
      );
    }

    // 🔹 Find admin
    let query = supabase
      .from("admin_users")
      .select("id, is_active");

    if (email) query = query.eq("email", email.trim().toLowerCase());
    if (phone) query = query.eq("phone", phone.trim());

    const { data: admin, error } = await query.single();

    if (error || !admin || !admin.is_active) {
      return NextResponse.json(
        { error: "Invalid login attempt" },
        { status: 401 }
      );
    }

    /**
     * ============================
     * VERIFY OTP (when provided)
     * ============================
     */
    if (otp) {
      const { data: session } = await supabase
        .from("admin_otp_sessions")
        .select("*")
        .eq("admin_id", admin.id)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!session) {
        return NextResponse.json(
          { error: "OTP expired or invalid" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(otp, session.otp_hash);

      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid OTP" },
          { status: 401 }
        );
      }

      await supabase
        .from("admin_otp_sessions")
        .update({ used: true })
        .eq("id", session.id);

      return NextResponse.json({
        success: true,
        verified: true,
        adminId: admin.id,
      });
    }

    /**
     * ============================
     * SEND OTP (when otp missing)
     * ============================
     */
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpHash = await bcrypt.hash(generatedOtp, 10);

    await supabase.from("admin_otp_sessions").insert({
      admin_id: admin.id,
      otp_hash: otpHash,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });

    console.log("ADMIN OTP:", generatedOtp); // dev/terminal only

    return NextResponse.json({
      success: true,
      otp: generatedOtp, // shows generated otp
    });

    // return NextResponse.json({
    //   success: true,
    //   otpSent: true,
    // });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid login attempt" },
      { status: 500 }
    );
  }
}
