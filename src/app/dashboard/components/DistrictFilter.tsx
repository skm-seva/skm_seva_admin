// src/app/dashboard/components/DistrictFilter.tsx
'use client';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DISTRICTS = [
  'All',
  'Gangtok',
  'Mangan',
  'Namchi',
  'Gyalshing',
  'Pakyong',
  'Soreng'
];

export default function DistrictFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
    >
      {DISTRICTS.map((d) => (
        <option key={d} value={d === 'All' ? '' : d}>
          {d}
        </option>
      ))}
    </select>
  );
}
