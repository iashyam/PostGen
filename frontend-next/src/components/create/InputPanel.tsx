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
    <div className="flex w-80 shrink-0 flex-col gap-5 rounded-xl border border-gray-800 bg-gray-900 p-5">
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

      <GenerateButton />
    </div>
  );
}
