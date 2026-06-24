import useAppStore from '../../store/appStore';

export default function TopicInput() {
  const { topic, setTopic } = useAppStore();

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-300">
        Topic / What is this post about?
      </label>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="How we reduced model training time by 60% using better data pipelines"
        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <div className="mt-1 text-right text-xs text-gray-500">
        {topic.length}/300
      </div>
    </div>
  );
}
