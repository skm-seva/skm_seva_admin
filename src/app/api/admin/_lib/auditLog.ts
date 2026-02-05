// src/app/api/admin/_lib/auditLog.ts
import { supabaseAdmin } from './supabaseAdmin';

export async function logAdminAction({
  adminId,
  actionType,
  targetType,
  targetId,
  reason
}: {
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  reason?: string;
}) {
  await supabaseAdmin.from('admin_action_logs').insert({
    admin_id: adminId,
    action_type: actionType,
    target_type: targetType,
    target_id: targetId,
    reason
  });
}
