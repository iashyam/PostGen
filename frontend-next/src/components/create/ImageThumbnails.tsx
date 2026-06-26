'use client';

import useAppStore from '../../store/appStore';

export default function ImageThumbnails() {
  const { generatedImages, selectedImageIndex, setSelectedImageIndex } = useAppStore();

  return (
    <div className="mt-3 flex gap-2">
      {generatedImages.map((img, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedImageIndex(idx)}
          className={`overflow-hidden rounded-md border-2 transition-colors ${
            idx === selectedImageIndex
              ? 'border-primary-500'
              : 'border-gray-700 hover:border-gray-500'
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
