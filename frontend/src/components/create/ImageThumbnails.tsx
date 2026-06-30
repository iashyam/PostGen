'use client';

import useAppStore from '../../store/appStore';

export default function ImageThumbnails() {
  const { generatedImages, selectedImageIndex, setSelectedImageIndex } = useAppStore();

  return (
    <div className="mt-4 flex gap-2">
      {generatedImages.map((img, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedImageIndex(idx)}
          className={`overflow-hidden rounded-lg transition-all duration-200 ${
            idx === selectedImageIndex
              ? 'ring-2 ring-primary-400/50 ring-offset-2 ring-offset-[#0c0d12]'
              : 'opacity-50 hover:opacity-80'
          }`}
        >
          <img
            src={img.thumbnail_url}
            alt={`Variant ${idx + 1}`}
            className="h-16 w-24 object-cover"
          />
        </button>
      ))}
    </div>
  );
}
