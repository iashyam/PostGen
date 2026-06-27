'use client';

interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Dropdown({ label, value, options, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/40">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#1a1b23] text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
