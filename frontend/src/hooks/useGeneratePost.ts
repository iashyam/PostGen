import { useCallback } from 'react';
import toast from 'react-hot-toast';
import useAppStore from '../store/appStore';

export function useGeneratePost() {
  const generate = useCallback(async () => {
    const { topic, keyPoints, tone, length, setIsGenerating, setGenerationStep, setGeneratedPost } =
      useAppStore.getState();

    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('researching');
    setGeneratedPost('');

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          key_points: keyPoints,
          tone,
          length,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              setGenerationStep(data.event);
              if (data.event === 'complete') {
                setGeneratedPost(data.content);
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }

      toast.success('Post generated!');
    } catch (err) {
      toast.error('Failed to generate post');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate };
}
