'use client';

import { useEffect, useState } from 'react';
import StatCard from './components/StatCard';
import LoadingState from '@/components/ui/LoadingState';

type DashboardStats = {
  totalEvents: number;
  pendingEvents: number;
  totalUsers: number;
  totalOrganisers: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [events, pending, users, organisers] =
          await Promise.all([
            fetch('/api/admin/events').then((r) =>
              r.ok ? r.json() : []
            ),
            fetch(
              '/api/admin/events?approval_status=pending'
            ).then((r) => (r.ok ? r.json() : [])),
            fetch('/api/admin/users').then((r) =>
              r.ok ? r.json() : []
            ),
            fetch('/api/admin/organisers').then((r) =>
              r.ok ? r.json() : []
            ),
          ]);

        setStats({
          totalEvents: events.length,
          pendingEvents: pending.length,
          totalUsers: users.length,
          totalOrganisers: organisers.length,
        });
      } catch {
        setStats({
          totalEvents: 0,
          pendingEvents: 0,
          totalUsers: 0,
          totalOrganisers: 0,
        });
      }
    }

    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="p-8">
        <LoadingState label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Pending Approvals"
          value={stats.pendingEvents}
          highlight
        />
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          label="Total Organisers"
          value={stats.totalOrganisers}
        />
      </div>
    </div>
  );
}
