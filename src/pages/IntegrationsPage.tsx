import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BusinessConfig } from '@/lib/types';
import JourneyIntegrations from '@/components/journey/JourneyIntegrations';

export default function IntegrationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = (location.state as { config?: BusinessConfig })?.config;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  if (!config) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-foreground">{config.companyName} — Integrations</span>
        <div />
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <JourneyIntegrations config={config} />
      </div>
    </div>
  );
}
