'use client';

import { useState } from 'react';
import { RefreshCw, Loader2, Expand, X } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useGenerateImage } from '../../hooks/useGenerateImage';
import ImageThumbnails from './ImageThumbnails';

export default function ImagePanel() {
  const { generatedImages, selectedImageIndex, isGeneratingImage } = useAppStore();
  const { generate } = useGenerateImage();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selectedImage = generatedImages[selectedImageIndex];

  return (
    <>
      <div className="glass-card flex w-96 shrink-0 flex-col overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/30">Generated Image</h2>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {isGeneratingImage ? (
              <div className="flex flex-col items-center gap-3 text-white/30">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm font-medium">Generating...</span>
              </div>
            ) : selectedImage ? (
              <>
                <img
                  src={selectedImage.url}
                  alt="Generated"
                  className="h-full w-full object-cover cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-2 right-2 rounded-lg p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                  title="Expand image"
                >
                  <Expand className="h-4 w-4 text-white/80" />
                </button>
              </>
            ) : (
              <div className="text-center px-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <RefreshCw className="h-5 w-5 text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/25">No image yet</p>
                <p className="mt-1 text-xs text-white/15">Generate a post first</p>
              </div>
            )}
          </div>

          {generatedImages.length > 0 && <ImageThumbnails />}

          <button
            onClick={generate}
            disabled={isGeneratingImage}
            className="btn-secondary mt-5 w-full"
          >
            <RefreshCw className={`h-4 w-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
            {generatedImages.length > 0 ? 'Regenerate Image' : 'Generate Image'}
          </button>
        </div>
      </div>

      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 rounded-lg p-2 transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
          <img
            src={selectedImage.url}
            alt="Generated — expanded"
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
