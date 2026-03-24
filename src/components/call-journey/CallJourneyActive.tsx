import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mic, Volume2 } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

export default function CallJourneyActive({ config, onNext }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Active call UI */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium tracking-wider">LIVE CALL</span>
        </div>

        <h3 className="text-white text-xl font-semibold mb-1">{config.companyName}</h3>
        <p className="text-gray-400 text-sm mb-8">Sarah Johnson → Sales Team</p>

        <div className="text-4xl font-mono text-white mb-10">{timeDisplay}</div>

        {/* Audio visualizer */}
        <div className="flex items-end justify-center gap-1 h-12 mb-10">
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

        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-gray-500">Mute</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] text-gray-500">Speaker</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 text-white rotate-[135deg]" />
            </button>
            <span className="text-[10px] text-gray-500">End</span>
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4 text-xs text-muted-foreground"
      >
        Invoca captures call signals in real-time as the conversation happens…
      </motion.p>
    </motion.div>
  );
}
