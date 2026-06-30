'use client';

import useAppStore from '../../store/appStore';
import Dropdown from '../common/Dropdown';
import TagInput from '../common/TagInput';
import TopicInput from './TopicInput';
import ImageStyleSelector from './ImageStyleSelector';
import GenerateButton from './GenerateButton';

const TONES = ['Professional', 'Casual', 'Inspirational', 'Educational', 'Storytelling'];
const LENGTHS = ['Short', 'Medium', 'Long'];

export default function InputPanel() {
  const { tone, length, keyPoints, setTone, setLength, addKeyPoint, removeKeyPoint } =
    useAppStore();

  return (
    <div className="glass-card flex w-80 shrink-0 flex-col overflow-hidden">
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/30">Post Settings</h2>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
      <TopicInput />

      <TagInput
        label="Key Points"
        tags={keyPoints}
        onAdd={addKeyPoint}
        onRemove={removeKeyPoint}
      />

      <div className="grid grid-cols-2 gap-3">
        <Dropdown label="Tone" value={tone} options={TONES} onChange={setTone} />
        <Dropdown label="Length" value={length} options={LENGTHS} onChange={setLength} />
      </div>

      <ImageStyleSelector />

      <div className="mt-auto pt-2">
        <GenerateButton />
      </div>
      </div>
    </div>
  );
}
