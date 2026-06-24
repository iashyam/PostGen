interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Dropdown({ label, value, options, onChange }: Props) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
