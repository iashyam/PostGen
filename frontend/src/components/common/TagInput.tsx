import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
}

export default function TagInput({ label, tags, onAdd, onRemove }: Props) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
        className="mb-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300"
          >
            {tag}
            <button
              onClick={() => onRemove(idx)}
              className="text-gray-500 hover:text-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
