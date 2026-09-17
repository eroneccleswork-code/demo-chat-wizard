import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceLsa from '@/components/home-service/HomeServiceLsa';
import HomeServiceTvAd from '@/components/home-service/HomeServiceTvAd';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ScreenRecorder from '@/components/ScreenRecorder';

type Step = 'google' | 'website';

export default function HomeServiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { websiteUrl, companyName: passedName, industry, enableRecording, scrapedAd, customSignals, channel, trackingNumber, originalNumber, branding } = (location.state as any) || {};
  const isTv = channel === 'tv';


  const [step, setStep] = useState<Step>('google');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!websiteUrl) {
      navigate('/home-service-setup');
    }
  }, [websiteUrl, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (step === 'website') setStep('google');
    }
  }, [step]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!websiteUrl) return null;

  const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayName = passedName || domain.replace(/^www\./, '').split('.')[0];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">
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
          isTv ? (
            <HomeServiceTvAd
              key="tv"
              companyName={displayName}
              domain={domain}
              industry={industry}
              trackingNumber={trackingNumber || '(833) 555-0142'}
              originalNumber={originalNumber || '(505) 555-0198'}
              tagline={scrapedAd?.description}
              branding={branding}
              onCall={() => setStep('website')}
            />
          ) : channel === 'lsa' ? (
            <HomeServiceLsa
              key="lsa"
              domain={domain}
              companyName={displayName}
              industry={industry}
              onClickAd={() => navigate('/lsa-leads', { state: { companyName: displayName, industry, customSignals } })}
              scrapedAd={scrapedAd}
            />
          ) : (
            <HomeServiceGoogle
              key="google"
              domain={domain}
              companyName={displayName}
              onClickAd={() => setStep('website')}
              scrapedAd={scrapedAd}
            />
          )
        )}

        {step === 'website' && (
          <HomeServiceWebsite
            key="website"
            websiteUrl={websiteUrl}
            domain={domain}
            companyName={displayName}
            industry={industry}
            customSignals={customSignals}
            onNext={channel === 'lsa'
              ? () => navigate('/lsa-leads', { state: { companyName: displayName, industry, customSignals } })
              : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}