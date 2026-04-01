import { useState, useEffect, useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ChatUI from '@/components/ChatUI';
import ScreenRecorder from '@/components/ScreenRecorder';

type Step = 'google' | 'website' | 'chat';

export default function Demo() {
  const location = useLocation();
  const state = location.state as { config?: BusinessConfig; scrapedAd?: any } | null;
  const config = state?.config;
  const scrapedAd = state?.scrapedAd;

  const [step, setStep] = useState<Step>(config?.websiteUrl ? 'google' : 'chat');

  const domain = config?.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || '';
  const websiteUrl = config?.websiteUrl?.startsWith('http') ? config.websiteUrl : `https://${config?.websiteUrl}`;

  // Arrow key nav for website step only
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (step === 'website' && e.key === 'ArrowRight') {
        setStep('chat');
      }
      if (step === 'chat' && e.key === 'ArrowLeft') {
        setStep('website');
      }
      if (step === 'website' && e.key === 'ArrowLeft') {
        setStep('google');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step]);

  if (!config) return <Navigate to="/" replace />;

  // If no website URL, go straight to chat
  if (!config.websiteUrl) {
    return <ChatUI config={config} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {config.enableRecording && <ScreenRecorder />}

      <AnimatePresence mode="wait">
        {step === 'google' && (
          <HomeServiceGoogle
            key="google"
            domain={domain}
            companyName={config.companyName}
            onClickAd={() => setStep('website')}
            scrapedAd={scrapedAd}
          />
        )}
        {step === 'website' && (
          <HomeServiceWebsite
            key="website"
            websiteUrl={websiteUrl}
            domain={domain}
            onNext={() => setStep('chat')}
            onBack={() => setStep('google')}
          />
        )}
        {step === 'chat' && (
          <div key="chat" className="flex-1 min-h-screen">
            <ChatUI config={config} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
