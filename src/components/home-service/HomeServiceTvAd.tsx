import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Tv } from 'lucide-react';

interface Props {
  companyName: string;
  domain: string;
  industry?: string;
  trackingNumber: string;
  tagline?: string;
  onCall: () => void;
}

export default function HomeServiceTvAd({ companyName, domain, industry, trackingNumber, tagline, onCall }: Props) {
  const [scene, setScene] = useState(0);
  const isHealthcare = (industry || '').toLowerCase().includes('health');

  const scenes = isHealthcare
    ? [
        'Care that puts you first.',
        'Same-day appointments. Board-certified specialists.',
        'Most insurance plans accepted.',
      ]
    : [
        'Your home deserves better.',
        'Free in-home estimate. Lifetime warranty.',
        'Financing available on approved credit.',
      ];

  useEffect(() => {
    const t = setInterval(() => setScene(s => (s + 1) % scenes.length), 2600);
    return () => clearInterval(t);
  }, [scenes.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') onCall();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCall]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-[#0b0f14] flex flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-5xl">
        {/* TV bezel */}
        <div className="rounded-[22px] bg-[#15191f] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10">
          <div className="relative aspect-video w-full overflow-hidden rounded-[14px] bg-gradient-to-br from-[#123047] via-[#0f4d5c] to-[#0b2233]">
            {/* soft light sweep */}
            <motion.div
              animate={{ x: ['-30%', '130%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/3 bg-white/5 blur-2xl"
            />

            {/* Broadcast chrome */}
            <div className="absolute top-4 left-5 flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase">
              <Tv className="w-4 h-4" />
              Paid Advertisement
            </div>
            <div className="absolute top-4 right-5 text-white/50 text-xs">:30</div>

            {/* Center brand */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
              <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight drop-shadow">
                {companyName}
              </h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={scene}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-white/85 text-lg md:text-xl max-w-2xl"
                >
                  {tagline && scene === 0 ? tagline : scenes[scene]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Lower third with Invoca tracking number */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-gradient-to-t from-black/80 to-transparent pt-16 pb-5 px-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-1">Call now</p>
                    <motion.button
                      onClick={onCall}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center gap-3 text-white"
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00A0A0]">
                        <Phone className="w-5 h-5 text-white" />
                      </span>
                      <span className="text-3xl md:text-4xl font-black tracking-wider tabular-nums">
                        {trackingNumber}
                      </span>
                    </motion.button>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm font-medium">{domain}</p>
                    <p className="text-white/45 text-[11px] mt-1">Invoca tracking number · TV attribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-5">
          Viewer sees the spot and dials the on-screen number — click it (or press →) to place the call.
        </p>
      </div>
    </motion.div>
  );
}
