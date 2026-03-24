import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mic, Volume2, Shield } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';
import InvocaLogo from '../InvocaLogo';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

const LIVE_SIGNALS = [
  { label: 'Call Source', value: 'Google Ads — Search', delay: 0.5 },
  { label: 'Campaign', value: `${'{industry}'} — Brand`, delay: 1.0 },
  { label: 'Keyword', value: `${'{industry}'} near me`, delay: 1.5 },
  { label: 'Caller Intent', value: 'High — Ready to buy', delay: 2.5 },
  { label: 'Caller Sentiment', value: 'Positive', delay: 3.5 },
  { label: 'IVR Outcome', value: 'Routed to Sales', delay: 4.5 },
];

export default function CallJourneyActive({ config, onNext }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [visibleSignals, setVisibleSignals] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSignals(v => Math.min(v + 1, LIVE_SIGNALS.length));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;

  const signals = LIVE_SIGNALS.map(s => ({
    ...s,
    value: s.value
      .replace('{industry}', config.industry)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: active call UI */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">LIVE CALL</span>
          </div>

          <h3 className="text-white text-lg font-medium mb-1">{config.companyName}</h3>
          <p className="text-gray-400 text-sm mb-6">Sarah Johnson → Sales Team</p>

          <div className="text-3xl font-mono text-white mb-8">{timeDisplay}</div>

          {/* Audio visualizer */}
          <div className="flex items-end justify-center gap-1 h-12 mb-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [4, Math.random() * 40 + 4, 4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.5,
                  delay: i * 0.05,
                }}
                className="w-1 rounded-full bg-green-400/60"
                style={{ minHeight: 4 }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-500">Mute</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-500">Speaker</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onNext}
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-white rotate-[135deg]" />
              </button>
              <span className="text-[10px] text-gray-500">End</span>
            </div>
          </div>
        </div>

        {/* Right: Invoca live signal capture */}
        <div className="glass-surface rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <InvocaLogo size="sm" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Live Signal Capture</span>
            </div>
          </div>

          <div className="space-y-3">
            {signals.map((signal, i) => (
              <motion.div
                key={signal.label}
                initial={{ opacity: 0, x: 10 }}
                animate={i < visibleSignals ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-xs text-muted-foreground">{signal.label}</span>
                <span className="text-sm font-medium text-foreground">{signal.value}</span>
              </motion.div>
            ))}
          </div>

          {visibleSignals >= LIVE_SIGNALS.length && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center"
            >
              <p className="text-xs font-medium text-primary">
                ✓ All signals captured in real-time
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Invoca captures call signals in real-time as the conversation happens…
        </span>
      </motion.div>
    </motion.div>
  );
}
