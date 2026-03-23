import { useLocation, Navigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import ChatUI from '@/components/ChatUI';

export default function Demo() {
  const location = useLocation();
  const config = (location.state as { config?: BusinessConfig })?.config;

  if (!config) return <Navigate to="/" replace />;

  return <ChatUI config={config} />;
}
