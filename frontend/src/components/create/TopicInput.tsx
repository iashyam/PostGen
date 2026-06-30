'use client';

import useAppStore from '../../store/appStore';

export default function TopicInput() {
  const { topic, setTopic } = useAppStore();

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/40">
        Topic
      </label>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="How we reduced model training time by 60% using better data pipelines"
        className="input-field resize-none"
      />
      <div className="mt-1.5 text-right text-[11px] font-medium text-white/20">
        {topic.length}/300
      </div>
    </div>
  );
}
