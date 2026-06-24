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
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">
            {draft.title || draft.topic || 'Untitled Draft'}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{date}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onLoad(draft)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(draft._id)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-red-900/30 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-gray-400">
        {draft.plain_text || 'No content'}
      </p>

      <div className="mt-3 flex gap-2">
        {draft.tone && (
          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
            {draft.tone}
          </span>
        )}
        {draft.length && (
          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
            {draft.length}
          </span>
        )}
      </div>
    </div>
  );
}
