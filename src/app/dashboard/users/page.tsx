'use client';

import { useEffect, useState } from 'react';
import LoadingState from '@/components/ui/LoadingState';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import UsersTable from './components/UsersTable';

type User = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  area: string;
  participation_count: number;
};

const DISTRICTS = [
  'Gangtok',
  'Namchi',
  'Mangan',
  'Gyalshing',
  'Pakyong',
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');

  async function loadUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (district) params.set('district', district);
      if (search) params.set('search', search);

      const res = await fetch(
        `/api/admin/users?${params.toString()}`
      );

      if (!res.ok) {
        setUsers([]);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [district]);

  return (
    <div className="p-8 space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Users
      </h1>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users' },
        ]}
      />

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-4">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') loadUsers();
            }}
            placeholder="Name, phone, or email"
            className="border rounded-lg px-3 py-2 text-sm w-64"
          />
        </div>

        {/* District */}
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

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            onClick={loadUsers}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Search
          </button>

          {(district || search) && (
            <button
              onClick={() => {
                setDistrict('');
                setSearch('');
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState label="Loading users…" />
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
