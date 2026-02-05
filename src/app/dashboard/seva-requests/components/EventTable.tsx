'use client';

type Event = {
  id: string;
  title: string;
  category: string;
  district: string;
  approval_status: string;
  organiser_name?: string | null;
};

export default function EventTable({
  events,
  onApprove,
  onReject,
}: {
  events: Event[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Organiser</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">District</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {events.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-gray-500"
              >
                No events found.
              </td>
            </tr>
          ) : (
            events.map((e) => (
              <tr
                key={e.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">
                  {e.title}
                </td>

                {/* 👇 ORGANISER NAME IS HERE */}
                <td className="px-4 py-3">
                  {e.organiser_name ?? '—'}
                </td>

                <td className="px-4 py-3">
                  {e.category}
                </td>

                <td className="px-4 py-3">
                  {e.district}
                </td>

                <td className="px-4 py-3">
                  <span className="capitalize">
                    {e.approval_status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                  {e.approval_status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(e.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-600 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(e.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-600 text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
