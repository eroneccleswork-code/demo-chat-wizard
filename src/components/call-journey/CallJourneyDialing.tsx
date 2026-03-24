import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

export default function CallJourneyDialing({ config, onNext }: Props) {
  const [ringCount, setRingCount] = useState(0);
  const phoneNumber = config.customContext?.replace('Phone: ', '') || '(800) 555-0199';

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
      className="w-full max-w-sm"
    >
      {/* iPhone call screen */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[44px] border-[3px] border-gray-700 p-8 pt-16 pb-12 text-center shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full" />

        <p className="text-gray-400 text-sm mb-2">calling…</p>
        <h2 className="text-white text-2xl font-light mb-1">{config.companyName}</h2>
        <p className="text-gray-400 text-sm mb-10">{phoneNumber}</p>

        {/* Ringing indicator */}
        <div className="flex justify-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 0.7 }}
            >
              <Phone className="w-10 h-10 text-green-400" />
            </motion.div>
          </motion.div>
        </div>

        {/* Ring dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: ringCount % 3 >= i ? 1 : 0.2 }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
          ))}
        </div>

        {/* End call button */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
          >
            <Phone className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Customer calls the number from the website…
        </span>
      </motion.div>
    </motion.div>
  );
}
