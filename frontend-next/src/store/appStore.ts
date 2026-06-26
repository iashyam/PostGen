import { create } from 'zustand';
import type { GeneratedImage, User } from '../types';

interface AppState {
  // Input
  topic: string;
  keyPoints: string[];
  tone: string;
  length: string;
  imageStyle: string;

  // Generated content
  generatedPost: string;
  isGenerating: boolean;
  generationStep: string;

  // Images
  generatedImages: GeneratedImage[];
  selectedImageIndex: number;
  isGeneratingImage: boolean;

  // User
  user: User | null;

  // Actions
  setTopic: (t: string) => void;
  addKeyPoint: (kp: string) => void;
  removeKeyPoint: (idx: number) => void;
  setTone: (t: string) => void;
  setLength: (l: string) => void;
  setImageStyle: (s: string) => void;
  setGeneratedPost: (p: string) => void;
  setIsGenerating: (v: boolean) => void;
  setGenerationStep: (s: string) => void;
  setGeneratedImages: (imgs: GeneratedImage[]) => void;
  setSelectedImageIndex: (i: number) => void;
  setIsGeneratingImage: (v: boolean) => void;
  setUser: (u: User | null) => void;
  resetForm: () => void;
}

const useAppStore = create<AppState>((set) => ({
  topic: '',
  keyPoints: [],
  tone: 'Professional',
  length: 'Medium',
  imageStyle: 'Modern 3D',
  generatedPost: '',
  isGenerating: false,
  generationStep: '',
  generatedImages: [],
  selectedImageIndex: 0,
  isGeneratingImage: false,
  user: null,

  setTopic: (topic) => set({ topic }),
  addKeyPoint: (kp) => set((s) => ({ keyPoints: [...s.keyPoints, kp] })),
  removeKeyPoint: (idx) => set((s) => ({ keyPoints: s.keyPoints.filter((_, i) => i !== idx) })),
  setTone: (tone) => set({ tone }),
  setLength: (length) => set({ length }),
  setImageStyle: (imageStyle) => set({ imageStyle }),
  setGeneratedPost: (generatedPost) => set({ generatedPost }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationStep: (generationStep) => set({ generationStep }),
  setGeneratedImages: (generatedImages) => set({ generatedImages }),
  setSelectedImageIndex: (selectedImageIndex) => set({ selectedImageIndex }),
  setIsGeneratingImage: (isGeneratingImage) => set({ isGeneratingImage }),
  setUser: (user) => set({ user }),
  resetForm: () =>
    set({
      topic: '',
      keyPoints: [],
      tone: 'Professional',
      length: 'Medium',
      imageStyle: 'Modern 3D',
      generatedPost: '',
      generationStep: '',
      generatedImages: [],
      selectedImageIndex: 0,
    }),
}));

export default useAppStore;
