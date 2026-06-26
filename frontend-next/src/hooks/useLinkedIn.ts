'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import useAppStore from '../store/appStore';

export function useLinkedIn() {
  const connect = useCallback(async () => {
    try {
      const res = await api.get('/auth/linkedin');
      window.location.href = res.data.auth_url;
    } catch {
      toast.error('Failed to initiate LinkedIn auth');
    }
  }, []);

  const postToLinkedIn = useCallback(async () => {
    const { generatedPost, generatedImages, selectedImageIndex, user } = useAppStore.getState();

    if (!user) {
      toast.error('Please connect LinkedIn first');
      return;
    }

    if (!generatedPost.trim()) {
      toast.error('No post content to publish');
      return;
    }

    try {
      const imageUrl = generatedImages[selectedImageIndex]?.url || null;
      const res = await api.post('/post/linkedin', {
        content: generatedPost,
        image_url: imageUrl,
        user_id: user.user_id,
      });
      toast.success('Posted to LinkedIn!');
      return res.data;
    } catch {
      toast.error('Failed to post to LinkedIn');
    }
  }, []);

  return { connect, postToLinkedIn };
}
