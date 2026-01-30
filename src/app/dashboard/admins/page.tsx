'use client';
import { useState } from 'react';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
};

export default function Admins() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 1,
      name: 'Admin Master',
      email: 'admin@sikkimseva.com',
      phone: '9876543210',
      role: 'super-admin',
      status: 'active',
      last_login: '2026-01-30 14:25 PM'
    },
    {
      id: 2,
      name: 'Event Moderator',
      email: 'moderator@sikkimseva.com',
      phone: '9876543211',
      role: 'moderator',
      status: 'active',
      last_login: '2026-01-29 10:15 AM'
    },
    {
      id: 3,
      name: 'Suspended User',
      email: 'suspended@sikkimseva.com',
      phone: '9876543212',
      role: 'admin',
      status: 'suspended',
      last_login: '2026-01-25 09:30 AM'
    }
  ]);

  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmins = admins.filter(admin => 
    (filterRole === 'all' || admin.role === filterRole) &&
    (!searchTerm || 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm))
  );

  const handleStatusChange = (id: number, newStatus: AdminUser['status']) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === id ? { ...admin, status: newStatus } : admin
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-sm text-gray-600">Total Admins: {admins.length}</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          + Add Admin
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
        >
          <option value="all">All Roles</option>
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        <input
          type="text"
          placeholder="Search name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-12">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-36">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-24">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-24">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Last Login</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">#{admin.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">{admin.name}</td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200 truncate max-w-[200px]">{admin.email}</td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{admin.phone}</td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                      admin.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {admin.role.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      admin.status === 'active' ? 'bg-green-100 text-green-800' :
                      admin.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{admin.last_login}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded border border-blue-700 hover:bg-blue-700 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded border border-gray-700 hover:bg-gray-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
