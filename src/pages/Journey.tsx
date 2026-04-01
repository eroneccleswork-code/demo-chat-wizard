import { useLocation, Navigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import CustomerJourney from '@/components/CustomerJourney';

export default function Journey() {
  const location = useLocation();
  const state = location.state as { config?: BusinessConfig; enableRecording?: boolean; scrapedAd?: any } | null;
  const config = state?.config;
  const enableRecording = state?.enableRecording;
  const scrapedAd = state?.scrapedAd;

  if (!config) return <Navigate to="/" replace />;

  return <CustomerJourney config={config} enableRecording={enableRecording} scrapedAd={scrapedAd} />;
}
