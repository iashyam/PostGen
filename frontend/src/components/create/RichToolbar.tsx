import type { Editor } from '@tiptap/react';
import { Bold, Italic, List, Quote, Link } from 'lucide-react';
import IconButton from '../common/IconButton';

interface Props {
  editor: Editor | null;
}

export default function RichToolbar({ editor }: Props) {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex gap-1 border-b border-gray-700 p-2">
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </IconButton>
      <IconButton onClick={addLink} active={editor.isActive('link')} title="Link">
        <Link className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
