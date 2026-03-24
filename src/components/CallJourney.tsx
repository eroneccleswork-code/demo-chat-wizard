import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import JourneyGoogleAd from './journey/JourneyGoogleAd';
import JourneyWebsite from './journey/JourneyWebsite';
import CallJourneyDialing from './call-journey/CallJourneyDialing';
import CallJourneyActive from './call-journey/CallJourneyActive';
import ScreenRecorder from './ScreenRecorder';

type CallStep = 'google-ad' | 'website' | 'dialing' | 'active-call';

interface Props {
  config: BusinessConfig;
  enableRecording?: boolean;
}

const STEP_LABELS: Record<CallStep, string> = {
  'google-ad': 'Customer searches Google',
  'website': 'Lands on your website',
  'dialing': 'Customer calls the business',
  'active-call': 'Invoca captures the call',
};

const STEPS: CallStep[] = ['google-ad', 'website', 'dialing', 'active-call'];

export default function CallJourney({ config, enableRecording }: Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CallStep>('google-ad');
  const [started, setStarted] = useState(false);

  const stepIndex = STEPS.indexOf(currentStep);

  const goNext = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  }, [currentStep, started]);

  const goPrev = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
    }
  }, [currentStep]);

  // Arrow key navigation only
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {enableRecording && <ScreenRecorder />}

      {/* Top bar — minimal */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-foreground">{config.companyName} — Call Journey</span>
        <div />
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => (
            <div key={step} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            </div>
          ))}
        </div>
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground mt-2 text-center"
        >
          {STEP_LABELS[currentStep]}
        </motion.p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {currentStep === 'google-ad' && (
            <JourneyGoogleAd key="ad" config={config} onNext={goNext} started={started} />
          )}
          {currentStep === 'website' && (
            <JourneyWebsite key="web" config={config} onNext={goNext} variant="call" />
          )}
          {currentStep === 'dialing' && (
            <CallJourneyDialing key="dial" config={config} onNext={goNext} />
          )}
          {currentStep === 'active-call' && (
            <CallJourneyActive key="call" config={config} onNext={goNext} />
          )}
          {currentStep === 'invoca-dashboard' && (
            <CallJourneyInvocaDashboard key="dash" config={config} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
