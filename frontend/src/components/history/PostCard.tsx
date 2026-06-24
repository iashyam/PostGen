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
    <div className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex-1">
        <p className="mb-1 text-xs text-gray-500">{date}</p>
        <p className="whitespace-pre-line text-sm text-gray-300">{post.content}</p>
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" />
            {post.engagement?.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {post.engagement?.comments || 0}
          </span>
        </div>
      </div>
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="h-24 w-36 shrink-0 rounded-lg object-cover"
        />
      )}
    </div>
  );
}
