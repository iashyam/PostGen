'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Copy, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useAppStore from '../../store/appStore';
import RichToolbar from './RichToolbar';

export default function PostEditor() {
  const { generatedPost, setGeneratedPost } = useAppStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
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
    <div className="flex flex-1 flex-col rounded-xl border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-300">Generated Post</h2>
      </div>

      <RichToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 px-4 py-3">
        <span className={`text-xs ${charCount > 3000 ? 'text-red-400' : 'text-gray-500'}`}>
          {charCount}/3000
        </span>
        <div className="flex gap-2">
          <button
            onClick={saveDraft}
            className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
