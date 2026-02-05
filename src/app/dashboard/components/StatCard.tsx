type StatCardProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

export default function StatCard({
  label,
  value,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${
        highlight
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="text-sm font-medium text-gray-600">
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-semibold ${
          highlight ? 'text-blue-700' : 'text-gray-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
