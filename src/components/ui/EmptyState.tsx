export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-10 text-center">
      <div className="text-sm font-semibold text-gray-700">
        {title}
      </div>
      {description && (
        <div className="mt-2 text-sm text-gray-500">
          {description}
        </div>
      )}
    </div>
  );
}
