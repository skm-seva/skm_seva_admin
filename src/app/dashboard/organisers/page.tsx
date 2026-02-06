'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import OrganisersTable from './components/OrganisersTable';

type Organiser = {
  id: string;
  name: string;
  type: string;
  district: string;
  contact_name: string;
  phone: string;
  email: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  total_events: number;
};

const DISTRICTS = [
  'Gangtok',
  'Namchi',
  'Mangan',
  'Gyalshing',
  'Pakyong',
];

export default function OrganisersPage() {
  const [organisers, setOrganisers] = useState<Organiser[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState<
    '' | 'pending' | 'approved' | 'rejected'
  >('');

  async function loadOrganisers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (district) params.set('district', district);
      if (status) params.set('status', status);

      const res = await fetch(
        `/api/admin/organisers?${params.toString()}`
      );

      if (!res.ok) {
        setOrganisers([]);
        return;
      }

      const data = await res.json();
      setOrganisers(data);
    } catch {
      setOrganisers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrganisers();
  }, [district, status]);

  return (
    <div className="p-8 space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Organisers
      </h1>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Organisers' },
        ]}
      />

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as any)
            }
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {(district || status) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setDistrict('');
                setStatus('');
              }}
              className="px-3 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState label="Loading organisers…" />
      ) : organisers.length === 0 ? (
        <EmptyState
          title="No organisers found"
          description="Try adjusting filters or check back later."
        />
      ) : (
        <OrganisersTable organisers={organisers} />
      )}
    </div>
  );
}
