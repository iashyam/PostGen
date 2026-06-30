'use client';

import { Sparkles, Loader2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useGeneratePost } from '../../hooks/useGeneratePost';

export default function GenerateButton() {
  const { topic, isGenerating, generationStep } = useAppStore();
  const { generate } = useGeneratePost();

  const stepLabels: Record<string, string> = {
    researching: 'Researching...',
    drafting: 'Writing draft...',
    refining: 'Refining...',
    complete: 'Done!',
  };

  return (
    <button
      onClick={generate}
      disabled={!topic.trim() || isGenerating}
      className="btn-primary w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {stepLabels[generationStep] || 'Generating...'}
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Post
        </>
      )}
    </button>
  );
}
