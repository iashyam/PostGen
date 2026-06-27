'use client';

import { useRouter } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { useDrafts } from '../../hooks/useDrafts';
import DraftCard from '../../components/drafts/DraftCard';
import useAppStore from '../../store/appStore';
import type { Draft } from '../../types';

export default function Drafts() {
  const { drafts, loading, deleteDraft } = useDrafts();
  const router = useRouter();

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
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <FileText className="h-6 w-6 text-white/15" />
        </div>
        <p className="text-sm font-medium text-white/30">No drafts yet</p>
        <p className="mt-1 text-xs text-white/15">Generate a post and save it as a draft</p>
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
