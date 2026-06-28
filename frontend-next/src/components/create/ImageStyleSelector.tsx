'use client';

import useAppStore from '../../store/appStore';
import { IMAGE_STYLES } from '../../types';

export default function ImageStyleSelector() {
  const { imageStyle, setImageStyle } = useAppStore();

  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white/40">Image Style</label>
      <div className="grid grid-cols-4 gap-2">
        {IMAGE_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setImageStyle(s.id)}
            className={`rounded-lg py-2 px-1 text-xs font-medium transition-all duration-200 ${
              imageStyle === s.id
                ? 'bg-white/12 text-white ring-1 ring-primary-400/30'
                : 'text-white/30 hover:bg-white/[0.04] hover:text-white/50'
            }`}
            style={{ border: imageStyle === s.id ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.06)' }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
