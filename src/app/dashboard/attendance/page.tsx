'use client';
import { useState, useEffect } from 'react';

type AttendanceRecord = {
  id: number;
  event_title: string;
  attendee_name: string;
  phone: string;
  checkin_time: string;
  checkout_time: string | null;
  status: 'present' | 'absent' | 'late';
};

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data
    setRecords([
      {
        id: 1,
        event_title: 'Gangtok Cleanup Drive',
        attendee_name: 'Ram Bahadur Tamang',
        phone: '9876543210',
        checkin_time: '2026-01-30 09:15 AM',
        checkout_time: '2026-01-30 01:30 PM',
        status: 'present'
      },
      {
        id: 2,
        event_title: 'Namchi Health Camp',
        attendee_name: 'Sita Rai',
        phone: '9876543211',
        checkin_time: '2026-01-30 10:00 AM',
        checkout_time: null,
        status: 'late'
      }
    ]);
  }, []);

  const filteredRecords = records.filter(record => 
    (!filterDate || record.checkin_time.startsWith(filterDate)) &&
    (!searchTerm || 
      record.attendee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phone.includes(searchTerm) ||
      record.event_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-sm text-gray-600">Total Records: {records.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input
          type="text"
          placeholder="Search name, phone, event..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Event</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Attendee</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-28">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Check-in</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-32">Check-out</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300 w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">#{record.id}</td>
                  <td className="px-4 py-3 text-gray-900 border-r border-gray-200 max-w-[200px] truncate">{record.event_title}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">{record.attendee_name}</td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{record.phone}</td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{record.checkin_time}</td>
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">
                    {record.checkout_time || 'Pending'}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status.toUpperCase()}
                    </span>
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
  