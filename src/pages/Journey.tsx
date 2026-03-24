import { useLocation, Navigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import CustomerJourney from '@/components/CustomerJourney';

export default function Journey() {
  const location = useLocation();
  const config = (location.state as { config?: BusinessConfig })?.config;

  if (!config) return <Navigate to="/" replace />;

  return <CustomerJourney config={config} />;
}
