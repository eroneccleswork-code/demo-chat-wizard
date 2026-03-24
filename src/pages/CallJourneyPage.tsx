import { useLocation, Navigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import CallJourney from '@/components/CallJourney';

export default function CallJourneyPage() {
  const location = useLocation();
  const config = (location.state as { config?: BusinessConfig })?.config;

  if (!config) return <Navigate to="/" replace />;

  return <CallJourney config={config} />;
}
