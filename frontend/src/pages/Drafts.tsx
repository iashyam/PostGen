import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDrafts } from '../hooks/useDrafts';
import DraftCard from '../components/drafts/DraftCard';
import useAppStore from '../store/appStore';
import type { Draft } from '../types';

export default function Drafts() {
  const { drafts, loading, deleteDraft } = useDrafts();
  const navigate = useNavigate();

  const loadDraft = (draft: Draft) => {
    const store = useAppStore.getState();
    store.setTopic(draft.topic);
    draft.key_points.forEach((kp) => store.addKeyPoint(kp));
    store.setTone(draft.tone);
    store.setLength(draft.length);
    store.setGeneratedPost(draft.plain_text);
    if (draft.image_urls.length > 0) {
      store.setGeneratedImages(
        draft.image_urls.map((url) => ({ url, thumbnail_url: url }))
      );
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p className="text-lg">No drafts yet</p>
        <p className="mt-1 text-sm">Generate a post and save it as a draft</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <DraftCard
          key={draft._id}
          draft={draft}
          onDelete={deleteDraft}
          onLoad={loadDraft}
        />
      ))}
    </div>
  );
}
