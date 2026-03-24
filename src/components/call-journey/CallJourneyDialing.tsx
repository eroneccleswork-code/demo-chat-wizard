import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, Mic, Volume2, Plus, User } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

export default function CallJourneyDialing({ config, onNext }: Props) {
  const [ringCount, setRingCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRingCount(r => r + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center"
    >
      {/* iPhone frame */}
      <div className="relative w-[300px] h-[620px] bg-black rounded-[50px] border-[4px] border-gray-800 shadow-2xl overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-20 border border-gray-800" />

        {/* Screen */}
        <div className="absolute inset-[2px] rounded-[46px] overflow-hidden bg-gradient-to-b from-[#1c1c1e] to-[#000000] flex flex-col items-center pt-20 pb-10 px-6">
          {/* Calling status */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-green-400 text-sm font-medium mb-4 tracking-wide"
          >
            calling...
          </motion.p>

          {/* Contact name */}
          <h2 className="text-white text-[28px] font-light tracking-tight mb-1">
            {config.companyName}
          </h2>

          {/* Ring dots */}
          <div className="flex justify-center gap-1.5 mt-6 mb-auto">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: ringCount % 3 >= i ? 1 : 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-gray-400"
              />
            ))}
          </div>

          {/* Action buttons grid — iOS style */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-5 mb-8">
            {[
              { icon: Mic, label: 'mute' },
              { icon: Plus, label: 'keypad' },
              { icon: Volume2, label: 'audio' },
              { icon: Plus, label: 'add call' },
              { icon: Video, label: 'FaceTime' },
              { icon: User, label: 'contacts' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-[#2c2c2e] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          {/* End call button */}
          <button
            onClick={onNext}
            className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg"
          >
            <Phone className="w-7 h-7 text-white rotate-[135deg]" />
          </button>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-gray-600 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <span className="text-xs text-muted-foreground">
          Customer calls the number from the website…
        </span>
      </motion.div>
    </motion.div>
  );
}
