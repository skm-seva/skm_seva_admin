// src/app/api/admin/events/[id]/reject/route.ts
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
  const { reason } = await req.json();

  if (!reason) {
    return NextResponse.json(
      { error: 'Rejection reason is required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('events')
    .update({
      approval_status: 'rejected',
      rejection_reason: reason,
      is_submitted: false
    })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    adminId: admin.id,
    actionType: 'reject_event',
    targetType: 'event',
    targetId: params.id,
    reason
  });

  return NextResponse.json({ success: true });
}
