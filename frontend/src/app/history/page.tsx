'use client';

import { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';
import api from '../../lib/api';
import PostCard from '../../components/history/PostCard';
import type { PostHistory } from '../../types';

export default function History() {
  const [posts, setPosts] = useState<PostHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Clock className="h-6 w-6 text-white/15" />
        </div>
        <p className="text-sm font-medium text-white/30">No post history</p>
        <p className="mt-1 text-xs text-white/15">Posts you publish to LinkedIn will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
