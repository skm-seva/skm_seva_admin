// src/app/api/admin/_lib/adminAuth.ts
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabaseAdmin';

export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('seva_admin_token')?.value;

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('session_token', token)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new Error('UNAUTHORIZED');
  }

  return data; // admin row
}
