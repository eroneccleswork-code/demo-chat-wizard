import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ScreenRecorder from '@/components/ScreenRecorder';

type Step = 'google' | 'website';

interface LocState {
  websiteUrl?: string;
  companyName?: string;
  enableRecording?: boolean;
  scrapedAd?: any;
}

export default function VoiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const st = (location.state as LocState) || {};
  const { websiteUrl, companyName, enableRecording, scrapedAd } = st;

  const [step, setStep] = useState<Step>('google');
  const [callActive, setCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => { if (!websiteUrl) navigate('/voice-setup'); }, [websiteUrl, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (callActive) { setCallActive(false); return; }
        if (step === 'website') setStep('google');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, callActive]);

  if (!websiteUrl) return null;

  const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayName = companyName || domain.replace(/^www\./, '').split('.')[0];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">
      {enableRecording && !isRecording && (
        <button onClick={() => setIsRecording(true)}
          className="absolute top-4 right-4 z-50 w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
          title="Start recording" />
      )}
      {isRecording && <ScreenRecorder />}

      <AnimatePresence mode="wait">
        {step === 'google' && (
          <HomeServiceGoogle key="google" domain={domain} companyName={displayName}
            onClickAd={() => setStep('website')} scrapedAd={scrapedAd} />
        )}
        {step === 'website' && (
          <HomeServiceWebsite key="website" websiteUrl={websiteUrl} domain={domain}
            onNext={() => setCallActive(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {callActive && (
          <motion.button
            key="call-pill"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={() => setCallActive(false)}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 transition-colors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <Phone className="w-4 h-4" fill="currentColor" />
            <span className="text-sm font-medium">Call in progress</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
