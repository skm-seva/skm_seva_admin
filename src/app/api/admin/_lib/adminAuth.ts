import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabaseAdmin";

type AdminUser = {
  id: string;
  email: string;
  is_active: boolean;
};

type AdminSession = {
  id: string;
  expires_at: string;
  admin_users: AdminUser | null;
};

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seva_admin_token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const { data: session } = await supabaseAdmin
    .from("admin_sessions")
    .select(`
      id,
      expires_at,
      admin_users (
        id,
        email,
        is_active
      )
    `)
    .eq("id", token)
    .single<AdminSession>();

  if (
    !session ||
    new Date(session.expires_at) < new Date() ||
    !session.admin_users ||
    !session.admin_users.is_active
  ) {
    throw new Error("UNAUTHORIZED");
  }

  return session.admin_users;
}
