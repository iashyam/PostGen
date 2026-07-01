'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import useAppStore from '../../../store/appStore';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAppStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (code && state) {
      const exchangeToken = async () => {
        try {
          const res = await api.get(`/auth/linkedin/callback?code=${code}&state=${state}`);
          localStorage.setItem('token', res.data.token);
          setUser({
            name: res.data.user.name,
            avatar_url: res.data.user.avatar_url,
            token: res.data.token,
            user_id: res.data.user_id || '',
          });
          toast.success('LinkedIn connected!');
          router.push('/settings');
        } catch {
          toast.error('Failed to connect LinkedIn');
          router.push('/settings');
        }
      };
      exchangeToken();
    }
  }, [searchParams, setUser, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <span className="ml-3 text-gray-400">Connecting LinkedIn...</span>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
