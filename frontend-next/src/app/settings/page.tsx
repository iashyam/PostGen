'use client';

import { CheckCircle, Link2 } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { useLinkedIn } from '../../hooks/useLinkedIn';

export default function Settings() {
  const { user } = useAppStore();
  const { connect } = useLinkedIn();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-lg font-semibold text-white/90">Settings</h2>

      <div className="glass-card p-6">
        <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-wider text-white/30">LinkedIn Account</h3>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{user.name}</p>
              <p className="text-[11px] font-medium text-emerald-400/60">Connected</p>
            </div>
          </div>
        ) : (
          <button
            onClick={connect}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0077B5 0%, #0066a0 100%)',
              boxShadow: '0 2px 12px rgba(0, 119, 181, 0.25)',
            }}
          >
            <Link2 className="h-4 w-4" />
            Connect LinkedIn
          </button>
        )}
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-wider text-white/30">Default Preferences</h3>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/40">Default Tone</label>
            <select className="input-field appearance-none cursor-pointer">
              {['Professional', 'Casual', 'Inspirational', 'Educational', 'Storytelling'].map(
                (t) => (
                  <option key={t} className="bg-[#1a1b23] text-white">{t}</option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/40">Default Length</label>
            <select className="input-field appearance-none cursor-pointer">
              {['Short', 'Medium', 'Long'].map((l) => (
                <option key={l} className="bg-[#1a1b23] text-white">{l}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/20 focus:ring-offset-0"
            />
            <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">Auto-generate hashtags</span>
          </label>
        </div>
      </div>
    </div>
  );
}
