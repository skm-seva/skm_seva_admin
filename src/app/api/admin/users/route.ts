// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '../_lib/adminAuth';
import { supabaseAdmin } from '../_lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');
  const search = searchParams.get('search');

  let query = supabaseAdmin
    .from('users_profile')
    .select(`
      id,
      full_name,
      phone,
      email,
      district,
      area,
      created_at,
      event_participants (id)
    `)
    .order('created_at', { ascending: false });

  if (district) {
    query = query.eq('district', district);
  }

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Add participation count
  const users = data.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    phone: user.phone,
    email: user.email,
    district: user.district,
    area: user.area,
    created_at: user.created_at,
    participation_count: user.event_participants?.length || 0
  }));

  return NextResponse.json(users);
}
