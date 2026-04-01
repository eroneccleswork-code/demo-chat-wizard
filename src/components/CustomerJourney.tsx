import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import HomeServiceGoogle from './home-service/HomeServiceGoogle';
import HomeServiceWebsite from './home-service/HomeServiceWebsite';
import JourneyWaiting from './journey/JourneyWaiting';
import JourneyIntegrations from './journey/JourneyIntegrations';
import ScreenRecorder from './ScreenRecorder';

type JourneyStep = 'google' | 'website' | 'waiting' | 'integrations';

interface Props {
  config: BusinessConfig;
  enableRecording?: boolean;
  scrapedAd?: { description?: string; metaTitle?: string; sitelinks?: string[] } | null;
}

const STEPS: JourneyStep[] = ['google', 'website', 'waiting', 'integrations'];

export default function CustomerJourney({ config, enableRecording, scrapedAd }: Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<JourneyStep>('google');

  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';
  const websiteUrl = config.websiteUrl?.startsWith('http') ? config.websiteUrl : `https://${config.websiteUrl}`;

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  }, [currentStep]);

  // Arrow key navigation — only for website step onward (google has its own keyboard handling)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (currentStep === 'google') return; // google step handles its own input
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, currentStep]);

  const handleStartDemo = () => {
    navigate('/demo', {
      state: {
        config: {
          ...config,
          presencePage: 'Contact Form',
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {enableRecording && <ScreenRecorder />}

      <AnimatePresence mode="wait">
        {currentStep === 'google' && (
          <HomeServiceGoogle
            key="google"
            domain={domain}
            companyName={config.companyName}
            onClickAd={() => setCurrentStep('website')}
            scrapedAd={scrapedAd}
          />
        )}
        {currentStep === 'website' && (
          <HomeServiceWebsite
            key="website"
            websiteUrl={websiteUrl}
            domain={domain}
          />
        )}
        {currentStep === 'waiting' && (
          <div key="waiting" className="flex-1 flex items-center justify-center p-6">
            <JourneyWaiting config={config} onStartDemo={handleStartDemo} />
          </div>
        )}
        {currentStep === 'integrations' && (
          <div key="integrations" className="flex-1 flex items-center justify-center p-6">
            <JourneyIntegrations config={config} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
