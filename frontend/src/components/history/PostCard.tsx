'use client';

import { ThumbsUp, MessageCircle } from 'lucide-react';
import type { PostHistory } from '../../types';

interface Props {
  post: PostHistory;
}

export default function PostCard({ post }: Props) {
  const date = new Date(post.posted_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-card glass-card-hover flex gap-5 p-5">
      <div className="flex-1">
        <p className="mb-2 text-[11px] font-medium text-white/25">{date}</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">{post.content}</p>
        <div className="mt-4 flex gap-5 text-xs font-medium text-white/25">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-3 w-3" />
            {post.engagement?.likes || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3 w-3" />
            {post.engagement?.comments || 0}
          </span>
        </div>
      </div>
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="h-24 w-36 shrink-0 rounded-xl object-cover"
        />
      )}
    </div>
  );
}
