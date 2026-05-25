import { useEffect, useRef, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, ShoppingCart, Mic, Volume2, ArrowLeft, User } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { VoiceAgentConfig, VoiceTurn, CallStatus } from '@/lib/voice-types';
import { getFlow, findStep, ReplyOption } from '@/lib/voice-engine';
import ScreenRecorder from '@/components/ScreenRecorder';

export default function VoiceDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { config?: VoiceAgentConfig } | null;
  const cfg = state?.config;
  if (!cfg) return <Navigate to="/" replace />;

  return <VoiceDemoInner cfg={cfg} onBack={() => navigate('/voice-setup', { state: { config: cfg } })} />;
}

function VoiceDemoInner({ cfg, onBack }: { cfg: VoiceAgentConfig; onBack: () => void }) {
  const flow = useRef(getFlow(cfg)).current;
  const [status, setStatus] = useState<CallStatus>('ringing');
  const [stepId, setStepId] = useState<string>(flow[0]?.id || '');
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replies, setReplies] = useState<ReplyOption[]>([]);
  const [callStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tick timer
  useEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - callStart) / 1000)), 500);
    return () => clearInterval(t);
  }, [status, callStart]);

  // Ringing → connected after a beat
  useEffect(() => {
    if (status !== 'ringing') return;
    const t = setTimeout(() => setStatus('connected'), 1400);
    return () => clearTimeout(t);
  }, [status]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, isSpeaking]);

  const speak = (text: string) => new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = window.speechSynthesis.getVoices().find(x => x.voiceURI === cfg.voiceURI);
    if (v) u.voice = v;
    u.rate = cfg.voiceRate;
    u.onend = () => { setIsSpeaking(false); resolve(); };
    u.onerror = () => { setIsSpeaking(false); resolve(); };
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });

  // Play current step
  useEffect(() => {
    if (status !== 'connected') return;
    const step = findStep(flow, stepId);
    if (!step) return;
    const text = step.agent(cfg);
    setTurns(prev => [...prev, { id: `agent-${Date.now()}`, role: 'agent', text, ts: Date.now() }]);
    setReplies([]);
    speak(text).then(() => {
      setReplies(step.replies(cfg));
      if (step.terminal && step.replies(cfg).length === 0) {
        setTimeout(() => setStatus('completed'), 1500);
      }
    });
    return () => window.speechSynthesis.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId, status]);

  const handleReply = (r: ReplyOption) => {
    setTurns(prev => [...prev, { id: `caller-${Date.now()}`, role: 'caller', text: r.label, ts: Date.now() }]);
    setReplies([]);
    const step = findStep(flow, stepId);
    if (!step) return;

    if (r.intent === 'transfer') setStatus('transferring');

    setTimeout(() => {
      const nextId = step.next?.(r.branch);
      if (nextId) setStepId(nextId);
      else setStatus('completed');
    }, 400);
  };

  const endCall = () => {
    window.speechSynthesis.cancel();
    setStatus('completed');
  };

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const currentStep = findStep(flow, stepId);
  const showCart = currentStep?.showsCart && cfg.cart?.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4 md:p-8">
      <ScreenRecorder />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Setup
          </button>
          <InvocaLogo size="sm" />
          <div className="text-xs text-muted-foreground uppercase tracking-wide">AI Voice Agent</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call panel */}
          <div className="lg:col-span-2 glass-surface rounded-2xl p-6 flex flex-col" style={{ minHeight: 560 }}>
            {/* Call header */}
            <div className="flex items-center gap-4 pb-4 border-b border-border/50">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                {isSpeaking && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{cfg.agentName} · {cfg.companyName}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <StatusDot status={status} />
                  {status === 'ringing' && 'Ringing…'}
                  {status === 'connected' && (isSpeaking ? `Speaking · ${mmss}` : `Listening · ${mmss}`)}
                  {status === 'transferring' && 'Transferring to human agent…'}
                  {status === 'completed' && `Call ended · ${mmss}`}
                </div>
              </div>
              <button onClick={endCall} disabled={status === 'completed'}
                className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform">
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3 min-h-[280px]">
              <AnimatePresence initial={false}>
                {turns.map(t => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${t.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      t.role === 'agent'
                        ? 'bg-primary/15 text-foreground rounded-bl-sm'
                        : 'bg-foreground text-background rounded-br-sm'
                    }`}>
                      <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">
                        {t.role === 'agent' ? cfg.agentName : (cfg.callerName || 'Caller')}
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
            <div className="border-t border-border/50 pt-4">
              {status === 'completed' ? (
                <button onClick={onBack} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium">
                  Run another call
                </button>
              ) : replies.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Caller responds…
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {replies.filter(r => cfg.enableTransfer || r.intent !== 'transfer').map((r, i) => (
                      <button key={i} onClick={() => handleReply(r)}
                        className="px-4 py-3 rounded-lg bg-background border border-border text-sm text-left hover:border-primary hover:bg-primary/5 transition-all">
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  {isSpeaking ? 'Agent is speaking…' : status === 'ringing' ? 'Connecting…' : '…'}
                </div>
              )}
            </div>
          </div>

          {/* Side panel: capabilities + cart */}
          <div className="space-y-4">
            <div className="glass-surface rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Agent Capabilities</div>
              <ul className="space-y-2 text-sm">
                <CapRow on label={`Voice: ${cfg.voiceName.split(' ')[0] || 'Default'}`} />
                <CapRow on={!!cfg.presenceContext} label="Trained on your presence" />
                <CapRow on={!!cfg.cart?.length} label="Sees customer cart" />
                <CapRow on={cfg.enableUpsell} label="Can upsell" />
                <CapRow on={cfg.enableTransfer} label="Can transfer to human" />
                <CapRow on label="Can close the sale" />
              </ul>
            </div>

            {cfg.cart && cfg.cart.length > 0 && (
              <motion.div
                animate={{ borderColor: showCart ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.5)' }}
                className="glass-surface rounded-2xl p-5 border-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" /> Live Cart
                  </div>
                  {showCart && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-[10px] uppercase font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded">
                      Agent viewing
                    </motion.span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  {cfg.cart.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-foreground/80">{it.qty}× {it.name}</span>
                      <span className="font-medium">${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${cfg.cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {cfg.presenceContext && (
              <div className="glass-surface rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Trained Context
                </div>
                <p className="text-xs text-foreground/70 line-clamp-6 whitespace-pre-wrap">{cfg.presenceContext}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: CallStatus }) {
  const color = status === 'connected' ? 'bg-green-500' : status === 'ringing' ? 'bg-yellow-500' : status === 'transferring' ? 'bg-blue-500' : 'bg-muted-foreground';
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />;
}

function CapRow({ on, label }: { on?: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${on ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
      <span className={on ? '' : 'text-muted-foreground line-through'}>{label}</span>
    </li>
  );
}
