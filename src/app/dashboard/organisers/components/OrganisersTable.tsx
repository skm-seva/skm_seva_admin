'use client';

type Organiser = {
  id: string;
  name: string;
  type: string;
  district: string;
  contact_name: string;
  phone: string;
  email: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  total_events: number;
};

export default function OrganisersTable({
  organisers,
}: {
  organisers: Organiser[];
}) {
  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">
              Organisation
            </th>
            <th className="px-4 py-3">
              Type
            </th>
            <th className="px-4 py-3">
              District
            </th>
            <th className="px-4 py-3">
              Contact
            </th>
            <th className="px-4 py-3">
              Status
            </th>
            <th className="px-4 py-3 text-center">
              Events
            </th>
          </tr>
        </thead>

        <tbody>
          {organisers.map((o) => (
            <tr
              key={o.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 font-medium">
                {o.name}
              </td>

              <td className="px-4 py-3">
                {o.type}
              </td>

              <td className="px-4 py-3">
                {o.district}
              </td>

              <td className="px-4 py-3">
                <div>
                  <div className="font-medium">
                    {o.contact_name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {o.phone}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    o.verification_status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : o.verification_status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {o.verification_status}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                {o.total_events}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
