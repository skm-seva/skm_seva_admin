// src/app/api/admin/events/[id]/approve/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../_lib/adminAuth';
import { supabaseAdmin } from '../../../_lib/supabaseAdmin';
import { logAdminAction } from '../../../_lib/auditLog';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();

  const { error } = await supabaseAdmin
    .from('events')
    .update({
      approval_status: 'approved',
      approved_by: admin.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    adminId: admin.id,
    actionType: 'approve_event',
    targetType: 'event',
    targetId: params.id
  });

  return NextResponse.json({ success: true });
}
