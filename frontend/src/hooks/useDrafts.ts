import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import type { Draft } from '../types';

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/drafts');
      setDrafts(res.data);
    } catch (err) {
      console.error('Failed to fetch drafts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDraft = useCallback(async (id: string) => {
    try {
      await api.delete(`/drafts/${id}`);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Failed to delete draft', err);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  return { drafts, loading, fetchDrafts, deleteDraft };
}
