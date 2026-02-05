import { NextResponse } from 'next/server';
import { requireAdmin } from '../_lib/adminAuth';
import { supabaseAdmin } from '../_lib/supabaseAdmin';

export const runtime = 'nodejs';

type EventRow = {
  id: string;
  title: string;
  category: string;
  district: string;
  approval_status: string;
  event_status: string;
  start_time: string | null;
  end_time: string | null;
  organiser_id: string | null;
  created_at: string;
};

type OrganiserRow = {
  id: string;
  name: string;
};

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const approvalStatus = searchParams.get('approval_status');

    // 1️⃣ Fetch events (NO JOINS)
    let eventsQuery = supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        category,
        district,
        approval_status,
        event_status,
        start_time,
        end_time,
        organiser_id,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (approvalStatus) {
      eventsQuery = eventsQuery.eq(
        'approval_status',
        approvalStatus
      );
    }

    const { data: events, error: eventsError } =
      await eventsQuery;

    if (eventsError || !events) {
      console.error('Events fetch error:', eventsError);
      return NextResponse.json([], { status: 200 });
    }

    // 2️⃣ Collect organiser IDs
    const organiserIds = Array.from(
      new Set(
        events
          .map((e: EventRow) => e.organiser_id)
          .filter(Boolean)
      )
    ) as string[];

    // 3️⃣ Fetch organisers (once)
    let organisersMap: Record<string, string> = {};

    if (organiserIds.length > 0) {
      const { data: organisers, error: orgError } =
        await supabaseAdmin
          .from('organisers')
          .select('id, name')
          .in('id', organiserIds);

      if (!orgError && organisers) {
        organisersMap = organisers.reduce(
          (acc: Record<string, string>, o: OrganiserRow) => {
            acc[o.id] = o.name;
            return acc;
          },
          {}
        );
      }
    }

    // 4️⃣ Attach organiser_name safely
    const response = events.map((e: EventRow) => ({
      ...e,
      organiser_name: e.organiser_id
        ? organisersMap[e.organiser_id] || null
        : null,
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error('Events API fatal error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
