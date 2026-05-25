import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, PhoneOff, ShoppingCart, Mic, User, X } from 'lucide-react';
import HomeServiceGoogle from '@/components/home-service/HomeServiceGoogle';
import HomeServiceWebsite from '@/components/home-service/HomeServiceWebsite';
import ScreenRecorder from '@/components/ScreenRecorder';
import { speakWithElevenLabs } from '@/lib/elevenlabs';

type Step = 'google' | 'website';

interface FlowOption { label: string; nextId: string; intent?: string }
interface FlowBranch { id: string; agent: string; options: FlowOption[]; terminal?: boolean }
interface CartItem { name: string; price: number; qty: number }
interface VoiceFlow {
  agentName: string;
  openingLine: string;
  presenceSummary: string;
  cart: CartItem[];
  branches: FlowBranch[];
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
  branches: [
    { id: 'greet', agent: '', options: [
      { label: 'Finish the order', nextId: 'close', intent: 'buy' },
      { label: 'I have a question', nextId: 'q', intent: 'question' },
      { label: 'Transfer me to a person', nextId: 'transfer', intent: 'transfer' },
    ]},
    { id: 'q', agent: 'Of course — what would you like to know? Shipping, returns, or product details?', options: [
      { label: 'Shipping', nextId: 'ship' },
      { label: "Sounds good, let's buy", nextId: 'close', intent: 'buy' },
    ]},
    { id: 'ship', agent: 'We ship within 24 hours, free over $50. Ready to wrap this up?', options: [
      { label: 'Yes, complete it', nextId: 'close', intent: 'buy' },
    ]},
    { id: 'close', agent: `Perfect — charging the card on file now. Confirmation is on its way. Thanks for shopping with ${company}!`, options: [], terminal: true },
    { id: 'transfer', agent: 'Absolutely — connecting you to a human agent now. One moment.', options: [], terminal: true },
  ],
});

export default function VoiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const st = (location.state as LocState) || {};
  const { websiteUrl, companyName, enableRecording, scrapedAd, voiceId, voiceName, flow: flowFromState } = st;

  const [step, setStep] = useState<Step>('google');
  const [callOpen, setCallOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!websiteUrl) navigate('/voice-setup');
  }, [websiteUrl, navigate]);

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
          <CallOverlay
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

// ─────────────────────────── Call overlay ───────────────────────────

interface Turn { id: string; role: 'agent' | 'caller'; text: string }
type CallStatus = 'ringing' | 'connected' | 'transferring' | 'ended';

function CallOverlay({ companyName, voiceId, voiceName, flow, onClose }:
  { companyName: string; voiceId: string; voiceName: string; flow: VoiceFlow; onClose: () => void }
) {
  const [status, setStatus] = useState<CallStatus>('ringing');
  const [stepId, setStepId] = useState<string>('greet');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replies, setReplies] = useState<FlowOption[]>([]);
  const [agentViewingCart, setAgentViewingCart] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt] = useState(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Connect after ring
  useEffect(() => {
    const t = setTimeout(() => setStatus('connected'), 1300);
    return () => clearTimeout(t);
  }, []);

  // Timer
  useEffect(() => {
    if (status !== 'connected' && status !== 'transferring') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(t);
  }, [status, startedAt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, isSpeaking]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const speak = async (text: string) => {
    stopAudio();
    setIsSpeaking(true);
    try {
      const audio = await speakWithElevenLabs(text, voiceId);
      audioRef.current = audio;
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
    } catch (e) {
      console.error('TTS error', e);
    } finally {
      setIsSpeaking(false);
      audioRef.current = null;
    }
  };

  // Play current step
  useEffect(() => {
    if (status !== 'connected' && status !== 'transferring') return;
    const branch = flow.branches.find(b => b.id === stepId);
    if (!branch) return;
    const text = stepId === 'greet' ? flow.openingLine : branch.agent;
    if (!text) return;
    if (/cart|item|order|left|total|\$/i.test(text)) setAgentViewingCart(true);
    setTurns(prev => [...prev, { id: `a-${Date.now()}`, role: 'agent', text }]);
    setReplies([]);
    speak(text).then(() => {
      setAgentViewingCart(false);
      setReplies(branch.options || []);
      if (branch.terminal) setTimeout(() => setStatus('ended'), 1500);
    });
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId, status]);

  const handleReply = (r: FlowOption) => {
    setTurns(prev => [...prev, { id: `c-${Date.now()}`, role: 'caller', text: r.label }]);
    setReplies([]);
    if (r.intent === 'transfer') setStatus('transferring');
    setTimeout(() => setStepId(r.nextId), 400);
  };

  const endCall = () => { stopAudio(); setStatus('ended'); };
  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const cartTotal = flow.cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && status === 'ended') onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-5xl bg-card rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-3 overflow-hidden"
        style={{ height: 'min(640px, 90vh)' }}
      >
        {/* Call panel */}
        <div className="md:col-span-2 flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center gap-4 p-5 border-b border-border">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              {isSpeaking && (
                <motion.div className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.2 }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{flow.agentName} · {companyName}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <StatusDot status={status} />
                {status === 'ringing' && 'Ringing…'}
                {status === 'connected' && (isSpeaking ? `Speaking · ${mmss}` : `Listening · ${mmss}`)}
                {status === 'transferring' && `Transferring to human · ${mmss}`}
                {status === 'ended' && `Call ended · ${mmss}`}
              </div>
            </div>
            <button onClick={endCall} disabled={status === 'ended'}
              className="w-11 h-11 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform">
              <PhoneOff className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1" title="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
            <AnimatePresence initial={false}>
              {turns.map(t => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${t.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    t.role === 'agent' ? 'bg-primary/15 rounded-bl-sm' : 'bg-foreground text-background rounded-br-sm'
                  }`}>
                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">
                      {t.role === 'agent' ? flow.agentName : 'Caller'}
                    </div>
                    {t.text}
                  </div>
                </motion.div>
              ))}
              {isSpeaking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-primary/15 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reply buttons */}
          <div className="border-t border-border p-4">
            {status === 'ended' ? (
              <button onClick={onClose} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                Close
              </button>
            ) : replies.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Caller responds…
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {replies.map((r, i) => (
                    <button key={i} onClick={() => handleReply(r)}
                      className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-left hover:border-primary hover:bg-primary/5 transition-all">
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-2">
                {isSpeaking ? 'Agent speaking…' : status === 'ringing' ? 'Connecting…' : '…'}
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="bg-card p-5 space-y-4 border-l border-border overflow-y-auto">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Agent Voice</div>
            <div className="text-sm font-medium">{voiceName || 'Default'}</div>
          </div>

          <motion.div
            animate={{ borderColor: agentViewingCart ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
            className="rounded-xl p-4 border-2 bg-background">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Live Cart
              </div>
              {agentViewingCart && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="text-[10px] uppercase font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded">
                  Agent viewing
                </motion.span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {flow.cart.map((it, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <span className="text-foreground/80 truncate">{it.qty}× {it.name}</span>
                  <span className="font-medium whitespace-nowrap">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          <div className="rounded-xl p-4 bg-background border border-border">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Trained On</div>
            <p className="text-xs text-foreground/70 whitespace-pre-wrap">{flow.presenceSummary}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatusDot({ status }: { status: CallStatus }) {
  const color = status === 'connected' ? 'bg-green-500'
    : status === 'ringing' ? 'bg-yellow-500'
    : status === 'transferring' ? 'bg-blue-500'
    : 'bg-muted-foreground';
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />;
}
