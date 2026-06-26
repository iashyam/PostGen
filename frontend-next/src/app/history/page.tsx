'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p className="text-lg">No post history</p>
        <p className="mt-1 text-sm">Posts you publish to LinkedIn will appear here</p>
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
