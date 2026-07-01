'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Copy, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useAppStore from '../../store/appStore';
import { useLinkedIn } from '../../hooks/useLinkedIn';
import RichToolbar from './RichToolbar';

export default function PostEditor() {
  const { generatedPost, setGeneratedPost, user } = useAppStore();
  const { postToLinkedIn } = useLinkedIn();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: true,
    content: '',
    onUpdate: ({ editor }) => {
      setGeneratedPost(editor.getText());
    },
  });

  useEffect(() => {
    if (editor && generatedPost && !editor.isFocused) {
      const currentText = editor.getText();
      if (currentText !== generatedPost) {
        editor.commands.setContent(`<p>${generatedPost.replace(/\n/g, '</p><p>')}</p>`);
      }
    }
  }, [generatedPost, editor]);

  const charCount = generatedPost.length;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const saveDraft = async () => {
    const { topic, keyPoints, tone, length: len, generatedImages, selectedImageIndex } =
      useAppStore.getState();
    try {
      await api.post('/drafts', {
        title: topic.slice(0, 100),
        content: editor?.getHTML() || '',
        plain_text: generatedPost,
        topic,
        key_points: keyPoints,
        tone,
        length: len,
        image_urls: generatedImages.map((i) => i.url),
        selected_image_url: generatedImages[selectedImageIndex]?.url || null,
      });
      toast.success('Draft saved!');
    } catch {
      toast.error('Failed to save draft');
    }
  };

  return (
    <div className="glass-card flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/30">Generated Post</h2>
      </div>

      <RichToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className={`text-xs font-medium ${charCount > 3000 ? 'text-red-400' : 'text-white/25'}`}>
          {charCount.toLocaleString()}/3,000
        </span>
        <div className="flex gap-2">
          {user && (
            <button onClick={postToLinkedIn} className="btn-primary !py-2 !px-4 !text-[13px] !rounded-md">
              <Send className="h-3.5 w-3.5" />
              Post to LinkedIn
            </button>
          )}
          <button onClick={saveDraft} className="btn-primary !py-2 !px-4 !text-[13px] !rounded-md">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>
          <button
            onClick={copyToClipboard}
            className="btn-secondary !py-2 !px-3 !rounded-md"
            title="Copy to clipboard"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
