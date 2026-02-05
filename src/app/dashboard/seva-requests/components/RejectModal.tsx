// src/app/dashboard/seva-requests/components/RejectModal.tsx
'use client';

import { useState } from 'react';

type Props = {
  eventId: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export default function RejectModal({ eventId, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Reject Event
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason (mandatory)"
          className="w-full border rounded-lg p-3 text-sm"
          rows={4}
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>
          <button
            disabled={!reason}
            onClick={() => onSubmit(reason)}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
