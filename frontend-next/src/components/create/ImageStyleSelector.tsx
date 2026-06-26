'use client';

import useAppStore from '../../store/appStore';

const STYLES = [
  { id: 'Modern 3D', label: 'Modern 3D' },
  { id: 'Minimal', label: 'Minimal' },
  { id: 'Isometric', label: 'Isometric' },
  { id: 'Realistic', label: 'Realistic' },
];

export default function ImageStyleSelector() {
  const { imageStyle, setImageStyle } = useAppStore();

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">Image Style</label>
      <div className="grid grid-cols-4 gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setImageStyle(s.id)}
            className={`rounded-lg border p-2 text-xs transition-colors ${
              imageStyle === s.id
                ? 'border-primary-500 bg-primary-600/20 text-primary-300'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
