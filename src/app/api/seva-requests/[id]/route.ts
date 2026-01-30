import { NextRequest, NextResponse } from 'next/server';

const fakeRequests = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'approved' }
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  // Fake approve (always approves)
  const updated = fakeRequests.map(req => 
    req.id === id ? { ...req, status: 'approved' } : req
  );
  
  return NextResponse.json({ success: true });
}
