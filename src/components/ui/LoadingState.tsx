export default function LoadingState({ label }: { label?: string }) {
  return (
    <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
      {label || 'Loading…'}
    </div>
  );
}
