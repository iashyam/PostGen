'use client';

import { Trash2, Edit3 } from 'lucide-react';
import type { Draft } from '../../types';

interface Props {
  draft: Draft;
  onDelete: (id: string) => void;
  onLoad: (draft: Draft) => void;
}

export default function DraftCard({ draft, onDelete, onLoad }: Props) {
  const date = new Date(draft.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/85">
            {draft.title || draft.topic || 'Untitled Draft'}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-white/25">{date}</p>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => onLoad(draft)}
            className="rounded-lg p-2 text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/60"
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(draft._id)}
            className="rounded-lg p-2 text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-white/40">
        {draft.plain_text || 'No content'}
      </p>

      <div className="mt-4 flex gap-2">
        {draft.tone && (
          <span className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-white/35" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {draft.tone}
          </span>
        )}
        {draft.length && (
          <span className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-white/35" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {draft.length}
          </span>
        )}
      </div>
    </div>
  );
}
