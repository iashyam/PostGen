import type { ReactNode } from 'react';
import TabNav from './TabNav';
import { Sparkles, Image, Send, FolderOpen, Lightbulb } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const features = [
  { icon: Sparkles, title: 'AI-Powered Content', desc: 'Generate engaging posts tailored to your audience' },
  { icon: Image, title: 'AI Image Generation', desc: 'Create custom images that stand out' },
  { icon: Send, title: 'Direct LinkedIn Posting', desc: 'Post directly to LinkedIn with one click' },
  { icon: FolderOpen, title: 'Draft Management', desc: 'Save, edit, and organize your posts' },
  { icon: Lightbulb, title: 'Smart Suggestions', desc: 'Get suggestions to make your posts better' },
];

export default function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-xl font-bold text-white">
            Post<span className="text-primary-500">Gen</span>
          </h1>
        </div>
        <TabNav />
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center">
              <f.icon className="h-6 w-6 text-primary-500" />
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
