'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type User = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  area: string;
  participation_count: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users');

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

    loadUsers();
  }, []);

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

      {/* Content */}
      {loading ? (
        <LoadingState label="Loading users…" />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No registered citizens are available at this time."
        />
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3 text-center">
                  Participation
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    {u.full_name}
                  </td>
                  <td className="px-4 py-3">
                    {u.phone}
                  </td>
                  <td className="px-4 py-3">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    {u.district}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.participation_count}
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
