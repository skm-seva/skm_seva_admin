'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
};

export default function SevaRequests() {
  const [requests, setRequests] = useState<SevaRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SevaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // ✅ FIXED: Safe data fetch
  useEffect(() => {
    fetch('/api/seva-requests')
      .then(res => res.json())
      .then((data: any) => {
        // ✅ SAFE GUARD - Ensure data is array
        const safeData = Array.isArray(data) ? data : [];
        setRequests(safeData);
        setFilteredRequests(safeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setRequests([]);
        setFilteredRequests([]);
        setLoading(false);
      });
  }, []);

  // ✅ FIXED: Safe filter function with null checks
  const filterRequests = useCallback((requests: SevaRequest[], search: string, status: string) => {
    if (!Array.isArray(requests) || requests.length === 0) {
      return [];
    }

    return requests.filter((req) => {
      // ✅ NULL SAFE SEARCH
      const nameMatch = req.organizer_name?.toLowerCase().includes(search.toLowerCase()) || false;
      const eventMatch = req.event_title?.toLowerCase().includes(search.toLowerCase()) || false;
      const phoneMatch = req.contact_number?.includes(search) || false;
      const emailMatch = req.organizer_email?.toLowerCase().includes(search.toLowerCase()) || false;
      
      const searchMatches = nameMatch || eventMatch || phoneMatch || emailMatch;
      const statusMatches = status === 'all' || req.status === status;
      
      return searchMatches && statusMatches;
    });
  }, []);

  // ✅ FIXED: Safe useEffect for filtering
  useEffect(() => {
    const results = filterRequests(requests, searchTerm, filterStatus);
    setFilteredRequests(results);
  }, [requests, searchTerm, filterStatus, filterRequests]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await fetch(`/api/seva-requests/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: action } : req
      ) as SevaRequest[]);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-lg text-gray-500">Loading Seva Requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seva Requests</h1>
          <p className="text-sm text-gray-600">
            Total: {requests.length} | Showing: {filteredRequests.length}
          </p>
        </div>
        <Link 
          href="/dashboard/create-event"
          className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
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
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-40"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-12">ID</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-24">Name</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Phone</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Email</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">Event</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-20">Category</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-24">Date/Time</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-24">Location</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-16">Seats</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-16">Status</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500 border-t border-gray-200">
                    No requests match your search or filter
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <td className="px-3 py-2 font-medium text-gray-900 border-r border-gray-200">#{request.id}</td>
                    <td className="px-3 py-2 font-medium text-gray-900 border-r border-gray-200">{request.organizer_name}</td>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-200">{request.contact_number}</td>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-200 truncate max-w-[120px]">{request.organizer_email}</td>
                    <td className="px-3 py-2 text-gray-900 border-r border-gray-200 max-w-[160px] truncate">{request.event_title}</td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">{request.category}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-200">
                      <div>{new Date(request.event_date).toLocaleDateString('en-IN')}</div>
                      <div className="font-medium">{request.event_time}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-200">
                      <div>{request.event_location}</div>
                      <div className="text-gray-500 text-xs">{request.district}</div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 border-r border-gray-200 text-center">{request.seats_required}</td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {request.status === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAction(request.id, 'approve')}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded border border-green-700 hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'reject')}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded border border-red-700 hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status !== 'pending' && <span className="text-xs text-gray-500">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
