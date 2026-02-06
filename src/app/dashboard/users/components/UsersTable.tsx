'use client';

type User = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  area: string;
  participation_count: number;
};

export default function UsersTable({
  users,
}: {
  users: User[];
}) {
  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">District</th>
            <th className="px-4 py-3 text-center">
              Participation
            </th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-gray-500"
              >
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">
                  {u.full_name}
                </td>

                <td className="px-4 py-3">
                  {u.phone}
                </td>

                <td className="px-4 py-3">
                  {u.email}
                </td>

                <td className="px-4 py-3">
                  {u.district}
                </td>

                <td className="px-4 py-3 text-center">
                  {u.participation_count}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
