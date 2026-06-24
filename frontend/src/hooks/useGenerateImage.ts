import { useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import useAppStore from '../store/appStore';

export function useGenerateImage() {
  const generate = useCallback(async () => {
    const { topic, imageStyle, generatedPost, setIsGeneratingImage, setGeneratedImages } =
      useAppStore.getState();

    if (!topic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const response = await api.post('/generate-image', {
        topic,
        style: imageStyle,
        post_summary: generatedPost.slice(0, 200),
      });
      setGeneratedImages(response.data);
      toast.success('Images generated!');
    } catch (err) {
      toast.error('Failed to generate images');
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  return { generate };
}
