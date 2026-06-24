import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import useAppStore from '../store/appStore';
import { useLinkedIn } from '../hooks/useLinkedIn';

export default function Settings() {
  const { user, setUser } = useAppStore();
  const { connect } = useLinkedIn();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback
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
        } catch {
          toast.error('Failed to connect LinkedIn');
        }
      };
      exchangeToken();
    }
  }, [searchParams, setUser]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-xl font-bold text-white">Settings</h2>

      {/* LinkedIn Connection */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">LinkedIn Account</h3>

        {user ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-200">{user.name}</p>
              <p className="text-xs text-gray-500">Connected</p>
            </div>
          </div>
        ) : (
          <button
            onClick={connect}
            className="flex items-center gap-2 rounded-lg bg-[#0077B5] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#006097]"
          >
            <Link2 className="h-4 w-4" />
            Connect LinkedIn
          </button>
        )}
      </div>

      {/* Default Preferences */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Default Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-gray-400">Default Tone</label>
            <select className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100">
              {['Professional', 'Casual', 'Inspirational', 'Educational', 'Storytelling'].map(
                (t) => (
                  <option key={t}>{t}</option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Default Length</label>
            <select className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100">
              {['Short', 'Medium', 'Long'].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800" />
            <label className="text-sm text-gray-300">Auto-generate hashtags</label>
          </div>
        </div>
      </div>
    </div>
  );
}
