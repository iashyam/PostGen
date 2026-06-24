import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppShell from './components/layout/AppShell';
import CreatePost from './pages/CreatePost';
import Drafts from './pages/Drafts';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' },
        }}
      />
      <AppShell>
        <Routes>
          <Route path="/" element={<CreatePost />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth/callback" element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
