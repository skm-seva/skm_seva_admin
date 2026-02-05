// src/app/api/admin/organisers/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '../_lib/adminAuth';
import { supabaseAdmin } from '../_lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');
  const status = searchParams.get('status'); // pending / approved / rejected
  const search = searchParams.get('search');

  let query = supabaseAdmin
    .from('organisers')
    .select(`
      id,
      name,
      type,
      district,
      contact_name,
      phone,
      email,
      verification_status,
      is_active,
      created_at,
      events (id)
    `)
    .order('created_at', { ascending: false });

  if (district) {
    query = query.eq('district', district);
  }

  if (status) {
    query = query.eq('verification_status', status);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const organisers = data.map((org) => ({
    id: org.id,
    name: org.name,
    type: org.type,
    district: org.district,
    contact_name: org.contact_name,
    phone: org.phone,
    email: org.email,
    verification_status: org.verification_status,
    is_active: org.is_active,
    created_at: org.created_at,
    total_events: org.events?.length || 0
  }));

  return NextResponse.json(organisers);
}
