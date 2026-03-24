import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig } from '@/lib/types';
import JourneyGoogleAd from './journey/JourneyGoogleAd';
import JourneyWebsite from './journey/JourneyWebsite';
import JourneyFormFill from './journey/JourneyFormFill';
import JourneyWaiting from './journey/JourneyWaiting';

type JourneyStep = 'google-ad' | 'website' | 'form-fill' | 'waiting';

interface Props {
  config: BusinessConfig;
}

const STEP_LABELS: Record<JourneyStep, string> = {
  'google-ad': 'Customer searches Google',
  'website': 'Lands on your website',
  'form-fill': 'Fills out a form',
  'waiting': 'Waiting for a response…',
};

const STEPS: JourneyStep[] = ['google-ad', 'website', 'form-fill', 'waiting'];

export default function CustomerJourney({ config }: Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<JourneyStep>('google-ad');
  const [autoPlay, setAutoPlay] = useState(true);

  const stepIndex = STEPS.indexOf(currentStep);

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  }, [currentStep]);

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

  // Auto-advance timers
  useEffect(() => {
    if (!autoPlay) return;

    const durations: Record<JourneyStep, number> = {
      'google-ad': 4000,
      'website': 3500,
      'form-fill': 6000,
      'waiting': 0, // stays here — final stop
    };

    const duration = durations[currentStep];
    if (duration === 0) return;

    const timer = setTimeout(goNext, duration);
    return () => clearTimeout(timer);
  }, [currentStep, autoPlay, goNext]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-medium text-foreground">{config.companyName} — Customer Journey</span>
        <button
          onClick={() => setAutoPlay(v => !v)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            autoPlay ? 'border-primary text-primary' : 'border-border text-muted-foreground'
          }`}
        >
          {autoPlay ? 'Auto-playing' : 'Paused'}
        </button>
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
            <JourneyGoogleAd key="ad" config={config} onNext={goNext} />
          )}
          {currentStep === 'website' && (
            <JourneyWebsite key="web" config={config} onNext={goNext} />
          )}
          {currentStep === 'form-fill' && (
            <JourneyFormFill key="form" config={config} onNext={goNext} />
          )}
          {currentStep === 'waiting' && (
            <JourneyWaiting key="wait" config={config} onStartDemo={handleStartDemo} />
          )}
        </AnimatePresence>
      </div>

      {/* Manual controls */}
      <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-border">
        <button
          onClick={() => stepIndex > 0 && setCurrentStep(STEPS[stepIndex - 1])}
          disabled={stepIndex === 0}
          className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
        >
          Previous
        </button>
        {currentStep !== 'waiting' ? (
          <button
            onClick={goNext}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium transition-all"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleStartDemo}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium transition-all glow-primary"
          >
            Start SMS Demo →
          </button>
        )}
      </div>
    </div>
  );
}
