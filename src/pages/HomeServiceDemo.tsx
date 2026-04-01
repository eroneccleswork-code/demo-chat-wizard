import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ScreenRecorder from '@/components/ScreenRecorder';

type Step = 'google' | 'website';

export default function HomeServiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchKeyword, websiteUrl, companyName: passedName, enableRecording, scrapedAd } = (location.state as any) || {};

  const [step, setStep] = useState<Step>('google');
  const [started, setStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!searchKeyword || !websiteUrl) {
      navigate('/home-service-setup');
    }
  }, [searchKeyword, websiteUrl, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      if (!started) {
        setStarted(true);
      }
    }
    if (e.key === 'ArrowLeft') {
      if (step === 'website') setStep('google');
    }
  }, [step, started]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!searchKeyword || !websiteUrl) return null;

  // Extract domain from URL
  const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayName = passedName || domain.replace(/^www\./, '').split('.')[0];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">
      {/* Recording indicator */}
      {enableRecording && !isRecording && (
        <button
          onClick={() => setIsRecording(true)}
          className="absolute top-4 right-4 z-50 w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
          title="Start recording"
        />
      )}
      {isRecording && <ScreenRecorder />}

      <AnimatePresence mode="wait">
        {step === 'google' && (
          <HomeServiceGoogle
            key="google"
            searchKeyword={searchKeyword}
            domain={domain}
            companyName={displayName}
            started={started}
            onClickAd={() => setStep('website')}
            scrapedAd={scrapedAd}
          />
        )}
        {step === 'website' && (
          <HomeServiceWebsite
            key="website"
            websiteUrl={websiteUrl}
            domain={domain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
