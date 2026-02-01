'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  last_login: string;
  created_at: string;
};

export default function Admins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching admins from Supabase...');
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      // ✅ BETTER ERROR CHECKING
      if (error) {
        console.error('❌ Supabase Error Details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Most common errors
        if (error.code === '42P01') {
          setError('Table "admin_users" not found. Run SQL setup first.');
        } else if (error.message.includes('relation')) {
          setError('Database table missing. Check SQL setup.');
        } else {
          setError(`Failed to load admins: ${error.message}`);
        }
        setAdmins([]);
      } else if (!data || data.length === 0) {
        console.log('ℹ️ No admin users found');
        setAdmins([]);
      } else {
        console.log('✅ Loaded', data.length, 'admins');
        const formattedData = (data as AdminUser[]).map(admin => ({
          ...admin,
          last_login: admin.last_login 
            ? new Date(admin.last_login as string).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            : 'Never'
        }));
        setAdmins(formattedData);
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      setError('Connection failed. Check Supabase URL/key.');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Filter logic
  useEffect(() => {
    const results = admins.filter(admin => 
      (filterRole === 'all' || admin.role === filterRole) &&
      (!searchTerm || 
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone.includes(searchTerm))
    );
    setFilteredAdmins(results);
  }, [admins, filterRole, searchTerm]);

  const handleStatusChange = async (id: number, newStatus: AdminUser['status']) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert(`Failed: ${error.message}`);
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-lg text-blue-600 animate-pulse">Loading Admin Users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={fetchAdmins}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Retry
            </button>
            <button 
              onClick={() => window.open('https://supabase.com/dashboard/project/_/sql', '_blank')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              🛠️ Setup SQL
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Rest of your JSX stays exactly the same */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-sm text-gray-600">
            Total: {admins.length} | Filtered: {filteredAdmins.length}
          </p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
          + Add Admin
        </button>
      </div>

      {/* Filters + Table - SAME as before */}
      {/* ... rest of your JSX ... */}
      
      <div className="text-xs text-gray-500 text-center pt-4">
        Powered by Supabase
      </div>
    </div>
  );
}
