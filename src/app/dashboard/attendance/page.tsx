'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type AttendanceRecord = {
  id: number;
  event_title: string;
  attendee_name: string;
  phone: string;
  checkin_time: string;
  checkout_time: string | null;
  status: 'present' | 'absent' | 'late';
  created_at: string;
};

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ SUPABASE FETCH
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('checkin_time', { ascending: false });

      if (error) {
        console.error('Supabase Error:', error);
        setRecords([]);
      } else {
        // Transform Supabase timestamps to string format
        const formattedData = (data || []).map(record => ({
          ...record,
          checkin_time: new Date(record.checkin_time).toLocaleString('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short'
          }),
          checkout_time: record.checkout_time 
            ? new Date(record.checkout_time).toLocaleString('en-IN', {
                dateStyle: 'short',
                timeStyle: 'short'
              })
            : null
        }));
        setRecords(formattedData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ✅ SUPABASE REALTIME SUBSCRIPTION
  useEffect(() => {
    const subscription = supabase
      .channel('attendance_records')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_records' },
        () => fetchRecords()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchRecords]);

  // Filter logic
  useEffect(() => {
    const results = records.filter(record => 
      (!filterDate || record.checkin_time.startsWith(filterDate)) &&
      (!searchTerm || 
        record.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.phone.includes(searchTerm) ||
        record.event_title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRecords(results);
  }, [records, filterDate, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-lg text-gray-500 animate-pulse">Loading Attendance Records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-sm text-gray-600">
            Total Records: {records.length} | Filtered: {filteredRecords.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
        <input
          type="text"
          placeholder="Search name, phone, event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-12">ID</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Event</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Attendee</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Phone</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Check-in</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Check-out</th>
                <th className="px-4 py-3.5 text-left font-semibold text-gray-800 border-b border-gray-300 w-20">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="space-y-2">
                      <div className="text-lg font-medium">No attendance records found</div>
                      <div className="text-sm">Try adjusting date filter or search</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900 border-r border-gray-100">
                      #{record.id}
                    </td>
                    <td className="px-4 py-3 text-gray-900 border-r border-gray-100 max-w-[200px] truncate">
                      {record.event_title}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-100">
                      {record.attendee_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-100">
                      {record.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-100">
                      {record.checkin_time}
                    </td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-100">
                      {record.checkout_time || 'Pending'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'present' ? 'bg-green-100 text-green-800 border border-green-200' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
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
