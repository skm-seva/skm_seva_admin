// src/app/dashboard/seva-requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import EventTable from './components/EventTable';
import RejectModal from './components/RejectModal';

export default function SevaRequestsPage() {
  const [status, setStatus] = useState('pending');
  const [events, setEvents] = useState<any[]>([]);
  const [rejectId, setRejectId] = useState<string | null>(null);

  async function loadEvents() {
  const res = await fetch(
    `/api/admin/events?approval_status=${status}`
  );

  if (!res.ok) {
    console.error('Events API failed:', res.status);
    setEvents([]);
    return;
  }

  const text = await res.text();

  if (!text) {
    setEvents([]);
    return;
  }

  const data = JSON.parse(text);
  setEvents(data);
}


  useEffect(() => {
    loadEvents();
  }, [status]);

  async function approveEvent(id: string) {
    await fetch(`/api/admin/events/${id}/approve`, {
      method: 'POST'
    });
    loadEvents();
  }

  async function rejectEvent(reason: string) {
    if (!rejectId) return;

    await fetch(`/api/admin/events/${rejectId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });

    setRejectId(null);
    loadEvents();
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Seva Requests
      </h1>

      {/* Tabs */}
      <div className="flex space-x-2">
        {['pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 text-sm rounded-lg font-medium ${
              status === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <EventTable
        events={events}
        onApprove={approveEvent}
        onReject={(id) => setRejectId(id)}
      />

      {rejectId && (
        <RejectModal
          eventId={rejectId}
          onClose={() => setRejectId(null)}
          onSubmit={rejectEvent}
        />
      )}
    </div>
  );
}
