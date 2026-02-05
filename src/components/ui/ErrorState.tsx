export default function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
      {message}
    </div>
  );
}
