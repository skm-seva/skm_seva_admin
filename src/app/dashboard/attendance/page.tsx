'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Participant = {
  id: string;
  name: string;
  district: string;
  status: 'present' | 'absent';
  markedBy: 'organiser' | 'admin';
};

// Temporary mock data (safe to remove later)
const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    district: 'Gangtok',
    status: 'present',
    markedBy: 'organiser',
  },
  {
    id: '2',
    name: 'Pema Bhutia',
    district: 'Namchi',
    status: 'absent',
    markedBy: 'organiser',
  },
];

export default function AttendancePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API load
    const timer = setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  function toggleAttendance(id: string) {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'present' ? 'absent' : 'present',
              markedBy: 'admin',
            }
          : p
      )
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Attendance
      </h1>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Attendance' },
        ]}
      />

      {/* Event selector */}
      <div className="bg-white border rounded-xl p-4 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Select Event:
        </label>
        <select className="border rounded-lg px-3 py-2 text-sm bg-white">
          <option>Tree Plantation Drive</option>
          <option>Clean Gangtok Campaign</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState label="Loading attendance…" />
      ) : participants.length === 0 ? (
        <EmptyState
          title="No attendance data"
          description="Participants will appear once attendance is recorded."
        />
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Marked By</th>
                <th className="px-4 py-3 text-right">
                  Admin Override
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    {p.district}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        p.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        p.markedBy === 'admin'
                          ? 'text-blue-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {p.markedBy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleAttendance(p.id)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg border hover:bg-gray-50"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
