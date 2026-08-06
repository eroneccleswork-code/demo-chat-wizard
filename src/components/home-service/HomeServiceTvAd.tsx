import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Play, Pause, Volume2, VolumeX, Tv } from 'lucide-react';
import type { BrandProfile } from '@/lib/setup-analysis';

interface Props {
  companyName: string;
  domain: string;
  industry?: string;
  trackingNumber: string;
  tagline?: string;
  branding?: BrandProfile | null;
  onCall: () => void;
}

const SPOT_SECONDS = 30;
const PREROLL_SECONDS = 12;

const PREROLL_SCENES = [
  {
    at: 0,
    kicker: 'KASA FOX 2 · Albuquerque',
    headline: 'News at 6 will return',
    sub: 'Stay with FOX 2 New Mexico for weather on the nines.',
  },
  {
    at: 4,
    kicker: 'Paid Advertisement',
    headline: 'Sandia Peak Auto Group',
    sub: '0% APR for 60 months on all 2026 models. Se habla español.',
  },
  {
    at: 8,
    kicker: 'Coming up next',
    headline: 'Albuquerque Weather Authority',
    sub: 'Your seven-day forecast, after these messages.',
  },
];

function hexOrFallback(v: string | undefined, fallback: string) {
  return v && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim()) ? v.trim() : fallback;
}

export default function HomeServiceTvAd({
  companyName,
  domain,
  industry,
  trackingNumber,
  tagline,
  branding,
  onCall,
}: Props) {
  const [phase, setPhase] = useState<'preroll' | 'spot'>('preroll');
  const [pt, setPt] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [dialing, setDialing] = useState(false);
  const [dialed, setDialed] = useState('');
  const rafRef = useRef<number>();

  const ind = (industry || '').toLowerCase();
  const isDental = ind.includes('dental') || ind.includes('dentist');
  const isHealthcare = isDental || ind.includes('health');

  const brand = {
    primary: hexOrFallback(branding?.colors?.primary, '#0F4C81'),
    secondary: hexOrFallback(branding?.colors?.secondary, '#0B2233'),
    accent: hexOrFallback(branding?.colors?.accent, '#00A0A0'),
    text: hexOrFallback(branding?.colors?.textPrimary, '#FFFFFF'),
    font: branding?.fontFamily,
  };
  const logo = branding?.logo || branding?.favicon;
  const backdrop = branding?.ogImage;

  const scenes = useMemo(() => {
    if (isDental) {
      return [
        { at: 0, headline: tagline || 'Smiles that feel like you.', sub: 'Gentle, modern dentistry for the whole family.' },
        { at: 8, headline: 'Same-week appointments', sub: 'Cleanings, Invisalign, implants and emergency care.' },
        { at: 16, headline: 'Most insurance accepted', sub: 'Flexible financing on approved credit.' },
        { at: 24, headline: 'New patients welcome', sub: 'Call now to book your first visit.' },
      ];
    }
    if (isHealthcare) {
      return [
        { at: 0, headline: tagline || 'Care that puts you first.', sub: 'Board-certified specialists close to home.' },
        { at: 8, headline: 'Same-day appointments', sub: 'Primary care, urgent care and specialty services.' },
        { at: 16, headline: 'Most insurance accepted', sub: 'Coverage verified before your visit.' },
        { at: 24, headline: 'New patients welcome', sub: 'Call now to schedule.' },
      ];
    }
    return [
      { at: 0, headline: tagline || 'Your home deserves better.', sub: 'Trusted local pros, backed by a lifetime warranty.' },
      { at: 8, headline: 'Free in-home estimate', sub: 'No pressure, no obligation.' },
      { at: 16, headline: 'Financing available', sub: 'On approved credit.' },
      { at: 24, headline: 'Book this week', sub: 'Call now to reserve your spot.' },
    ];
  }, [isDental, isHealthcare, tagline]);

  const activeIdx = scenes.reduce((acc, s, i) => (t >= s.at ? i : acc), 0);
  const active = scenes[activeIdx];

  // Pre-roll clock (local station break before the brand spot)
  useEffect(() => {
    if (phase !== 'preroll' || !playing) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPt(prev => {
        const next = prev + dt;
        if (next >= PREROLL_SECONDS) {
          setPhase('spot');
          return PREROLL_SECONDS;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, playing]);

  // Playback clock
  useEffect(() => {
    if (phase !== 'spot' || !playing || dialing) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT(prev => (prev + dt >= SPOT_SECONDS ? 0 : prev + dt));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, playing, dialing]);

  // Dial animation then hand off to the call
  useEffect(() => {
    if (!dialing) return;
    const digits = trackingNumber.replace(/\D/g, '');
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setDialed(digits.slice(0, i));
      if (i >= digits.length) {
        clearInterval(iv);
        setTimeout(onCall, 900);
      }
    }, 130);
    return () => clearInterval(iv);
  }, [dialing, trackingNumber, onCall]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (phase === 'preroll') { setPhase('spot'); return; }
        setDialing(true);
      }
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const remaining = Math.max(0, Math.ceil(SPOT_SECONDS - t));
  const pct = (t / SPOT_SECONDS) * 100;
  const prerollIdx = PREROLL_SCENES.reduce((acc, s, i) => (pt >= s.at ? i : acc), 0);
  const prerollScene = PREROLL_SCENES[prerollIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen bg-[#07090c] flex flex-col items-center justify-center p-6 md:p-10"
      style={{ fontFamily: brand.font }}
    >
      <div className="w-full max-w-5xl">
        {/* TV bezel */}
        <div className="rounded-[22px] bg-[#15191f] p-3 shadow-[0_40px_100px_rgba(0,0,0,0.7)] border border-white/10">
          <div
            className="relative aspect-video w-full overflow-hidden rounded-[14px]"
            style={{ background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 60%, ${brand.primary} 100%)` }}
          >
            {/* Pre-roll: local station break */}
            <AnimatePresence>
              {phase === 'preroll' && (
                <motion.div
                  key="preroll"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-30 bg-[#0a0d14] flex flex-col"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1b2a4a,transparent_60%),radial-gradient(circle_at_75%_80%,#3a1220,transparent_55%)]" />
                  <motion.div
                    animate={{ x: ['-30%', '130%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-1/4 bg-white/5 blur-2xl pointer-events-none"
                  />

                  {/* Station bug */}
                  <div className="absolute top-4 left-5 flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-[#1b3a8f] text-white text-[13px] font-black tracking-tight">FOX</span>
                    <span className="text-white text-[13px] font-bold tracking-wide">2</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-[0.22em]">KASA · Albuquerque, NM</span>
                  </div>
                  <div className="absolute top-4 right-5 flex items-center gap-3 text-white/60 text-xs tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                    </span>
                    <span>Ad break :{String(Math.max(0, Math.ceil(PREROLL_SECONDS - pt))).padStart(2, '0')}</span>
                  </div>

                  <div className="relative flex-1 flex flex-col items-center justify-center text-center px-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={prerollIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="text-white/50 text-[11px] uppercase tracking-[0.3em] mb-3">{prerollScene.kicker}</p>
                        <p className="text-white text-3xl md:text-4xl font-black tracking-tight">{prerollScene.headline}</p>
                        <p className="text-white/60 text-base mt-3 max-w-xl mx-auto">{prerollScene.sub}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="relative px-6 pb-5">
                    <div className="flex items-center justify-between">
                      <p className="text-white/40 text-[11px]">Your spot airs next</p>
                      <button
                        onClick={() => setPhase('spot')}
                        className="text-white/70 hover:text-white text-xs border border-white/20 rounded-full px-3 py-1.5 transition-colors"
                      >
                        Skip ad break →
                      </button>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mt-3">
                      <div className="h-full rounded-full bg-white/50" style={{ width: `${(pt / PREROLL_SECONDS) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand backdrop */}
            {backdrop && (
              <img
                src={backdrop}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${brand.secondary}55, ${brand.secondary}cc)` }} />

            {/* light sweep */}
            <motion.div
              animate={{ x: ['-30%', '130%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/3 bg-white/5 blur-2xl pointer-events-none"
            />

            {/* Broadcast chrome */}
            <div className="absolute top-4 left-5 flex items-center gap-2 text-white/70 text-[11px] tracking-[0.25em] uppercase">
              <Tv className="w-4 h-4" /> Paid Advertisement
            </div>
            <div className="absolute top-4 right-5 flex items-center gap-3 text-white/60 text-xs tabular-nums">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
              </span>
              <span>:{String(remaining).padStart(2, '0')}</span>
            </div>

            {/* Center brand */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
              {logo ? (
                <img
                  src={logo}
                  alt={`${companyName} logo`}
                  className="h-14 md:h-16 object-contain mb-5 drop-shadow"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight drop-shadow mb-3">{companyName}</h2>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45 }}
                >
                  <p className="text-white text-2xl md:text-4xl font-bold max-w-3xl drop-shadow">{active.headline}</p>
                  <p className="text-white/75 text-base md:text-lg mt-3 max-w-2xl mx-auto">{active.sub}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Lower third with Invoca tracking number */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="bg-gradient-to-t from-black/85 to-transparent pt-20 pb-5 px-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-white/60 text-[11px] uppercase tracking-[0.22em] mb-1">Call now</p>
                    <motion.button
                      onClick={() => setDialing(true)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{ opacity: [1, 0.72, 1] }}
                      transition={{ opacity: { duration: 1.6, repeat: Infinity } }}
                      className="flex items-center gap-3 text-white"
                    >
                      <span className="flex items-center justify-center w-11 h-11 rounded-full" style={{ background: brand.accent }}>
                        <Phone className="w-5 h-5 text-white" />
                      </span>
                      <span className="text-3xl md:text-[42px] font-black tracking-wider tabular-nums">{trackingNumber}</span>
                    </motion.button>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm font-semibold">{domain}</p>
                    <p className="text-white/45 text-[11px] mt-1">Invoca tracking number · TV attribution</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialing overlay */}
            <AnimatePresence>
              {dialing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: brand.accent }}
                  >
                    <Phone className="w-7 h-7 text-white" />
                  </motion.div>
                  <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2">Dialing</p>
                  <p className="text-white text-3xl font-black tabular-nums tracking-widest">{dialed || '…'}</p>
                  <p className="text-white/50 text-xs mt-4">Connecting to {companyName} · call captured by Invoca</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player controls */}
          <div className="px-3 pt-3 pb-1">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden cursor-pointer"
              onClick={e => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setT(((e.clientX - rect.left) / rect.width) * SPOT_SECONDS);
              }}
            >
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: brand.accent }} />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setPlaying(p => !p)} className="text-white/80 hover:text-white transition-colors">
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setMuted(m => !m)} className="text-white/80 hover:text-white transition-colors">
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5 ml-2">
                  {scenes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setT(s.at)}
                      className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-6' : 'w-3 bg-white/25'}`}
                      style={i === activeIdx ? { background: brand.accent } : undefined}
                      aria-label={`Scene ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-white/40 text-[11px] tabular-nums">
                00:{String(Math.floor(t)).padStart(2, '0')} / 00:{SPOT_SECONDS}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-5">
          Click the on-screen number to place the call (space = play/pause, → = call now).
        </p>
      </div>
    </motion.div>
  );
}
