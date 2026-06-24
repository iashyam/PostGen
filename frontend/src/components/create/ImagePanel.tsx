import { RefreshCw, Loader2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useGenerateImage } from '../../hooks/useGenerateImage';
import ImageThumbnails from './ImageThumbnails';

export default function ImagePanel() {
  const { generatedImages, selectedImageIndex, isGeneratingImage } = useAppStore();
  const { generate } = useGenerateImage();

  const selectedImage = generatedImages[selectedImageIndex];

  return (
    <div className="flex w-96 shrink-0 flex-col rounded-xl border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-300">Generated Image</h2>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Main image display */}
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-800">
          {isGeneratingImage ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">Generating image...</span>
            </div>
          ) : selectedImage ? (
            <img
              src={selectedImage.url}
              alt="Generated"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-sm text-gray-500">
              <p>No image generated yet</p>
              <p className="mt-1 text-xs">Generate a post first, then create an image</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {generatedImages.length > 0 && <ImageThumbnails />}

        {/* Regenerate button */}
        <button
          onClick={generate}
          disabled={isGeneratingImage}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
          Regenerate Image
        </button>
      </div>
    </div>
  );
}
