'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type SevaRequest = {
  id: number;
  organizer_name: string;
  contact_number: string;
  organizer_email: string;
  event_title: string;
  category: string;
  event_type: string;
  seats_required: number;
  event_date: string;
  event_time: string;
  event_location: string;
  district: string;
  status: string;
  created_at: string;
};

export default function SevaRequests() {
  const [requests, setRequests] = useState<SevaRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SevaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // ✅ FIXED: Proper dependency array
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seva_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Error:', error);
        setRequests([]);
      } else {
        setRequests(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ FIXED: Empty dependency array

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ✅ SUPABASE REALTIME SUBSCRIPTION
  useEffect(() => {
    const subscription = supabase
      .channel('seva_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'seva_requests' },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchRequests]);

  // ✅ FIXED: Filter logic
  useEffect(() => {
    const results = requests.filter((req) => {
      const matchesSearch = 
        req.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.contact_number?.includes(searchTerm) ||
        req.organizer_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredRequests(results);
  }, [requests, searchTerm, filterStatus]);

  // ✅ SUPABASE UPDATE ACTION
  const handleAction = async (id: number, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('seva_requests')
        .update({ status: action })
        .eq('id', id);

      if (error) {
        console.error('Update Error:', error);
        alert(`Failed to ${action}: ${error.message}`);
        return;
      }
      console.log('Status updated:', action);
    } catch (err) {
      console.error('Action error:', err);
      alert('Failed to update status');
    }
  };

  // ✅ FIXED: Filter counts from FULL data
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-lg text-gray-500 animate-pulse">Loading Seva Requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seva Requests</h1>
          <p className="text-sm text-gray-600">
            Total: {requests.length} | Filtered: {filteredRequests.length}
          </p>
        </div>
        <Link 
          href="/dashboard/create-event"
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
        >
          + Create Event
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search name, event, phone, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-44 shadow-sm"
        >
          <option value="all">All Status ({requests.length})</option>
          <option value="pending">Pending ({pendingCount})</option>
          <option value="approved">Approved ({approvedCount})</option>
          <option value="rejected">Rejected ({rejectedCount})</option>
        </select>
      </div>

      {/* Table - SAME JSX (no changes needed) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-14">ID</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-28">Name</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-32">Phone</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-36">Email</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800">Event</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-20">Category</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-28">Date/Time</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-28">Location</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-16 text-center">Seats</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-20">Status</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 w-32">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                    <div className="space-y-2">
                      <div className="text-lg font-medium">No requests found</div>
                      <div className="text-sm">Try adjusting search or filter</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900 border-r border-gray-100">
                      {request.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">
                      {request.organizer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                      {request.contact_number}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100 truncate max-w-[160px]">
                      {request.organizer_email}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100 max-w-[180px] truncate">
                      {request.event_title}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-100">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                        {request.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                      <div className="font-medium">{new Date(request.event_date).toLocaleDateString('en-IN')}</div>
                      <div>{request.event_time}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100">
                      <div className="font-medium">{request.event_location}</div>
                      <div className="text-xs text-gray-500">{request.district}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600 border-r border-gray-100 text-center text-sm">
                      {request.seats_required}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(request.id, 'approved')}
                            className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg border border-green-700 hover:bg-green-700 transition-all shadow-sm whitespace-nowrap"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'rejected')}
                            className="px-4 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg border border-red-700 hover:bg-red-700 transition-all shadow-sm whitespace-nowrap"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <span className="text-xs text-gray-500 font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center pt-4">
        Powered by Supabase • Real-time updates enabled
      </div>
    </div>
  );
}
