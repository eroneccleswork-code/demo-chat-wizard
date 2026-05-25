import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Mic, MicOff, Volume2, Grid3x3, UserPlus, Video, User } from 'lucide-react';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ScreenRecorder from '@/components/ScreenRecorder';
import { speakWithElevenLabs } from '@/lib/elevenlabs';
import { supabase } from '@/integrations/supabase/client';

type Step = 'google' | 'website';

interface CartItem { name: string; price: number; qty: number }
interface VoiceFlow {
  agentName: string;
  openingLine: string;
  presenceSummary: string;
  cart: CartItem[];
  branches: any[];
}

interface LocState {
  websiteUrl?: string;
  companyName?: string;
  enableRecording?: boolean;
  scrapedAd?: any;
  voiceId?: string;
  voiceName?: string;
  flow?: VoiceFlow;
}

const FALLBACK_FLOW = (company: string): VoiceFlow => ({
  agentName: 'Ava',
  openingLine: `Hi, this is Ava from ${company}. I noticed you left a few items in your cart — want to finish that order, or do you have any questions first?`,
  presenceSummary: `Trained on ${company}'s product catalog, pricing, shipping & returns policies.`,
  cart: [
    { name: 'Featured Product', price: 129.99, qty: 1 },
    { name: 'Add-on Accessory', price: 24.99, qty: 1 },
  ],
  branches: [],
});

export default function VoiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const st = (location.state as LocState) || {};
  const { websiteUrl, companyName, enableRecording, scrapedAd, voiceId, voiceName, flow: flowFromState } = st;

  const [step, setStep] = useState<Step>('google');
  const [callOpen, setCallOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => { if (!websiteUrl) navigate('/voice-setup'); }, [websiteUrl, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (callOpen) { setCallOpen(false); return; }
      if (step === 'website') setStep('google');
    }
  }, [step, callOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!websiteUrl) return null;

  const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayName = companyName || domain.replace(/^www\./, '').split('.')[0];
  const flow = flowFromState || FALLBACK_FLOW(displayName);

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
            onNext={() => setCallOpen(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {callOpen && step === 'website' && (
          <PhoneCallOverlay
            companyName={displayName}
            voiceId={voiceId || ''}
            voiceName={voiceName || ''}
            flow={flow}
            onClose={() => setCallOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────── iPhone call overlay ───────────────────────────

type CallState = 'ringing' | 'in-call' | 'ended';

function PhoneCallOverlay({ companyName, voiceId, voiceName, flow, onClose }:
  { companyName: string; voiceId: string; voiceName: string; flow: VoiceFlow; onClose: () => void }) {
  const [callState, setCallState] = useState<CallState>('ringing');
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastUserHeard, setLastUserHeard] = useState('');
  const [lastAgentSaid, setLastAgentSaid] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const ringRef = useRef<{ ctx: AudioContext; stop: () => void } | null>(null);
  const messagesRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const stateRef = useRef<CallState>('ringing');
  const mutedRef = useRef(false);

  useEffect(() => { stateRef.current = callState; }, [callState]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const cartLines = flow.cart.map(i => `${i.qty}× ${i.name} ($${i.price.toFixed(2)})`).join(', ');
  const cartTotal = flow.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const systemPrompt = `You are ${flow.agentName}, an AI voice agent answering an inbound call for ${companyName}.
Context about you: ${flow.presenceSummary}
Caller's live shopping cart: ${cartLines}. Total $${cartTotal.toFixed(2)}.
Speak naturally as if on a phone. Keep every reply under 2 short sentences. Be warm, helpful, sales-aware. Never mention you are an AI unless asked.`;

  // Ringtone
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let active = true;
    const playRing = () => {
      if (!active) return;
      const now = ctx.currentTime;
      [0, 0.4].forEach((offset) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 440;
        const o2 = ctx.createOscillator();
        o2.frequency.value = 480;
        o.connect(g); o2.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0, now + offset);
        g.gain.linearRampToValueAtTime(0.15, now + offset + 0.05);
        g.gain.linearRampToValueAtTime(0, now + offset + 0.35);
        o.start(now + offset); o2.start(now + offset);
        o.stop(now + offset + 0.4); o2.stop(now + offset + 0.4);
      });
    };
    playRing();
    const iv = setInterval(playRing, 3000);
    ringRef.current = { ctx, stop: () => { active = false; clearInterval(iv); ctx.close().catch(() => {}); } };
    return () => { ringRef.current?.stop(); };
  }, []);

  // Timer
  useEffect(() => {
    if (callState !== 'in-call' || !startedAt) return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(iv);
  }, [callState, startedAt]);

  const speak = async (text: string) => {
    setLastAgentSaid(text);
    setIsAgentSpeaking(true);
    // pause listening while agent speaks
    try { recognitionRef.current?.stop(); } catch {}
    try {
      const audio = await speakWithElevenLabs(text, voiceId);
      audioRef.current = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    } catch (e) { console.error(e); }
    setIsAgentSpeaking(false);
    audioRef.current = null;
    if (stateRef.current === 'in-call') startListening();
  };

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { console.warn('SpeechRecognition not supported'); return; }
    if (mutedRef.current) return;
    try { recognitionRef.current?.stop(); } catch {}
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => {
      setIsListening(false);
      // auto-restart if still in call & agent not speaking
      if (stateRef.current === 'in-call' && !audioRef.current && !mutedRef.current) {
        setTimeout(() => { if (stateRef.current === 'in-call') startListening(); }, 200);
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.onresult = async (ev: any) => {
      const transcript = ev.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      setLastUserHeard(transcript);
      messagesRef.current.push({ role: 'user', content: transcript });
      try {
        const { data, error } = await supabase.functions.invoke('voice-chat', {
          body: { systemPrompt, messages: messagesRef.current.slice(-12) },
        });
        if (error) throw error;
        const reply = data?.reply || "Sorry, could you repeat that?";
        messagesRef.current.push({ role: 'assistant', content: reply });
        if (stateRef.current === 'in-call') await speak(reply);
      } catch (e) {
        console.error('voice-chat error', e);
        if (stateRef.current === 'in-call') await speak("I'm having a little trouble hearing — could you say that again?");
      }
    };
    recognitionRef.current = rec;
    try { rec.start(); } catch {}
  };

  const answer = async () => {
    ringRef.current?.stop();
    setCallState('in-call');
    setStartedAt(Date.now());
    // request mic permission upfront
    try { await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {}
    messagesRef.current = [{ role: 'assistant', content: flow.openingLine }];
    await speak(flow.openingLine);
  };

  const endCall = () => {
    ringRef.current?.stop();
    try { recognitionRef.current?.stop(); } catch {}
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsAgentSpeaking(false);
    setIsListening(false);
    setCallState('ended');
    setTimeout(onClose, 900);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (next) { try { recognitionRef.current?.stop(); } catch {} }
    else if (callState === 'in-call' && !audioRef.current) startListening();
  };

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const statusLabel =
    callState === 'ringing' ? 'incoming call…'
    : callState === 'ended' ? 'call ended'
    : isAgentSpeaking ? `speaking · ${mmss}`
    : isListening ? `listening · ${mmss}`
    : `connected · ${mmss}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      {/* iPhone frame */}
      <motion.div
        initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
        className="relative w-[340px] h-[700px] bg-black rounded-[55px] border-[5px] border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-30 border border-gray-900" />

        {/* Screen */}
        <div
          className="absolute inset-[3px] rounded-[50px] overflow-hidden flex flex-col items-center pt-16 pb-8 px-7"
          style={{
            background: callState === 'ringing'
              ? 'linear-gradient(180deg, #2a2a2c 0%, #050505 100%)'
              : 'linear-gradient(180deg, #0d3d2e 0%, #051a13 60%, #000 100%)',
          }}
        >
          {/* Status */}
          <motion.p
            key={statusLabel}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`text-sm font-medium mb-3 tracking-wide ${callState === 'ringing' ? 'text-white/70' : 'text-green-300/90'}`}
          >
            {callState === 'ringing' && (
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                {statusLabel}
              </motion.span>
            )}
            {callState !== 'ringing' && statusLabel}
          </motion.p>

          {/* Avatar / mic */}
          <div className="relative mt-2 mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-white/10">
              <span className="text-white text-3xl font-light">{flow.agentName.slice(0, 1).toUpperCase()}</span>
            </div>
            {(isAgentSpeaking || isListening || callState === 'ringing') && (
              <>
                <motion.div className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [1, 1.4, 1.7], opacity: [0.6, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }} />
                <motion.div className="absolute inset-0 rounded-full border border-white/30"
                  animate={{ scale: [1, 1.4, 1.7], opacity: [0.6, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }} />
              </>
            )}
          </div>

          {/* Name */}
          <h2 className="text-white text-[26px] font-light tracking-tight mb-0.5 text-center">
            {flow.agentName}
          </h2>
          <p className="text-white/60 text-sm mb-2">{companyName}</p>

          {/* Waveform / hint */}
          <div className="h-14 flex items-center justify-center mb-auto">
            {callState === 'in-call' && (isAgentSpeaking || isListening) ? (
              <div className="flex items-end gap-1 h-10">
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.div key={i}
                    className={`w-1 rounded-full ${isAgentSpeaking ? 'bg-green-300' : 'bg-white/70'}`}
                    animate={{ height: [6, 4 + Math.random() * 30, 6] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.4, delay: i * 0.04 }}
                    style={{ minHeight: 4 }}
                  />
                ))}
              </div>
            ) : callState === 'in-call' ? (
              <p className="text-white/40 text-xs">Tap mic to mute · speak naturally</p>
            ) : null}
          </div>

          {/* Action grid for in-call */}
          {callState === 'in-call' && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-6 w-full">
              {[
                { icon: muted ? MicOff : Mic, label: muted ? 'unmute' : 'mute', onClick: toggleMute, active: muted },
                { icon: Grid3x3, label: 'keypad' },
                { icon: Volume2, label: 'audio' },
                { icon: UserPlus, label: 'add call' },
                { icon: Video, label: 'FaceTime' },
                { icon: User, label: 'contacts' },
              ].map(({ icon: Icon, label, onClick, active }) => (
                <button key={label} onClick={onClick} disabled={!onClick}
                  className="flex flex-col items-center gap-1.5 disabled:opacity-100">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                    active ? 'bg-white text-black' : 'bg-white/15 text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-white/70">{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Bottom buttons */}
          {callState === 'ringing' ? (
            <div className="flex items-center justify-between w-full px-2 mt-4">
              <button onClick={endCall}
                className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-white rotate-[135deg]" />
                </div>
                <span className="text-[11px] text-white/70">decline</span>
              </button>
              <motion.button onClick={answer}
                animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-full bg-[#34c759] flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <span className="text-[11px] text-white/70">accept</span>
              </motion.button>
            </div>
          ) : callState === 'in-call' ? (
            <button onClick={endCall}
              className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-lg">
              <Phone className="w-7 h-7 text-white rotate-[135deg]" />
            </button>
          ) : (
            <button onClick={onClose} className="text-white/70 text-sm">Tap to close</button>
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/40 rounded-full z-30" />
      </motion.div>

      {/* Subtle hint badge */}
      {callState === 'in-call' && lastUserHeard && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md text-center text-white/50 text-xs px-4">
          heard: "{lastUserHeard}"
        </motion.div>
      )}
    </motion.div>
  );
}
