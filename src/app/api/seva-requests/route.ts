import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json([

    {
      id: 1,
      organizer_name: 'Ram Bahadur Tamang',
      organizer_phone: '9876543210',
      organizer_email: 'ram.tamang@sikkimseva.com',
      event_title: 'Gangtok Monastery Cleanup',
      category: 'religious' as const,
      event_type: 'volunteering',
      seats_required: 30,
      volunteers_required: 15,
      event_date: '2026-02-15',
      event_time: '09:00 AM',
      event_location: 'Rumtek Monastery',
      district: 'East Sikkim',
      status: 'pending' as const,
      created_at: '2026-01-28'
    },
    {
      id: 2,
      organizer_name: 'Sita Rai Foundation',
      organizer_phone: '9876543211',
      organizer_email: 'sita.rai@foundation.org',
      event_title: 'Tree Plantation Drive - Pelling',
      category: 'environmental' as const,
      event_type: 'participation',
      seats_required: 100,
      volunteers_required: 20,
      event_date: '2026-03-01',
      event_time: '07:00 AM',
      event_location: 'Khecheopalri Lake',
      district: 'West Sikkim',
      status: 'approved' as const,
      created_at: '2026-01-25'
    },
    {
      id: 3,
      organizer_name: 'Dr. Prem Sharma',
      organizer_phone: '9876543212',
      organizer_email: 'prem.sharma@health.gov',
      event_title: 'Free Health Camp Namchi',
      category: 'health' as const,
      event_type: 'volunteering',
      seats_required: 0,
      volunteers_required: 25,
      event_date: '2026-02-20',
      event_time: '10:00 AM',
      event_location: 'Namchi PHC',
      district: 'South Sikkim',
      status: 'pending' as const,
      created_at: '2026-01-27'
    }
  ]);
  
}
