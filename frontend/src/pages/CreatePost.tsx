import InputPanel from '../components/create/InputPanel';
import PostEditor from '../components/create/PostEditor';
import ImagePanel from '../components/create/ImagePanel';

export default function CreatePost() {
  return (
    <div className="flex gap-4">
      <InputPanel />
      <PostEditor />
      <ImagePanel />
    </div>
  );
}
