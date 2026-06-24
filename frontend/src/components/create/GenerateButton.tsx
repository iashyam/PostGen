import { Sparkles, Loader2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useGeneratePost } from '../../hooks/useGeneratePost';

export default function GenerateButton() {
  const { topic, isGenerating, generationStep } = useAppStore();
  const { generate } = useGeneratePost();

  const stepLabels: Record<string, string> = {
    researching: 'Researching topic...',
    drafting: 'Writing draft...',
    refining: 'Refining post...',
    complete: 'Done!',
  };

  return (
    <div>
      <button
        onClick={generate}
        disabled={!topic.trim() || isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}
