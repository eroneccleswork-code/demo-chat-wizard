import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Building2, Target, Mic, ShoppingCart, MessageSquare, Plus, Trash2, User, FileText } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { VoiceAgentConfig, VoiceScenarioType, CartItem } from '@/lib/voice-types';

const INDUSTRIES = ['E-commerce', 'Window Cleaning', 'Dental', 'Real Estate', 'HVAC', 'Legal', 'Landscaping', 'Plumbing', 'Auto Repair', 'Insurance', 'Fitness', 'Blinds'];

const DEFAULT_CART: CartItem[] = [
  { name: 'Premium Roller Shade', price: 129.99, qty: 2 },
  { name: 'Cordless Wand', price: 14.99, qty: 1 },
];

export default function VoiceSetup() {
  const navigate = useNavigate();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [cfg, setCfg] = useState<VoiceAgentConfig>({
    companyName: '',
    industry: 'E-commerce',
    scenarioType: 'cart-recovery',
    voiceURI: '',
    voiceName: '',
    voiceRate: 1,
    agentName: 'Ava',
    callerName: 'Alex',
    callerPhone: '555-0142',
    cart: DEFAULT_CART,
    enableTransfer: true,
    enableUpsell: true,
    presenceContext: '',
    customFlow: '',
  });

  useEffect(() => {
    const load = () => {
      const list = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      setVoices(list);
      if (list.length && !cfg.voiceURI) {
        const preferred = list.find(v => /samantha|google us english|jenny|aria|female/i.test(v.name)) || list[0];
        setCfg(c => ({ ...c, voiceURI: preferred.voiceURI, voiceName: preferred.name }));
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewVoice = () => {
    const u = new SpeechSynthesisUtterance(`Hi, this is ${cfg.agentName} from ${cfg.companyName || 'your company'}. How can I help you today?`);
    const v = voices.find(x => x.voiceURI === cfg.voiceURI);
    if (v) u.voice = v;
    u.rate = cfg.voiceRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const updateCartItem = (i: number, patch: Partial<CartItem>) => {
    setCfg(c => ({ ...c, cart: (c.cart || []).map((it, idx) => idx === i ? { ...it, ...patch } : it) }));
  };
  const addCartItem = () => setCfg(c => ({ ...c, cart: [...(c.cart || []), { name: '', price: 0, qty: 1 }] }));
  const removeCartItem = (i: number) => setCfg(c => ({ ...c, cart: (c.cart || []).filter((_, idx) => idx !== i) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/voice-demo', { state: { config: cfg } });
  };

  const isValid = cfg.companyName && cfg.agentName && cfg.voiceURI;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <InvocaLogo className="scale-[5]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10 my-8"
      >
        <div className="text-center mb-8">
          <div className="mb-6 flex flex-col items-center">
            <InvocaLogo size="lg" className="mb-3" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">AI Voice Agent</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Configure your voice agent</h1>
          <p className="text-muted-foreground">Pick a voice, train it on your presence, and design the call.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-surface rounded-xl p-6 space-y-5">
            {/* Company + Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Company Name" icon={<Building2 className="w-4 h-4" />}>
                <input className="input" value={cfg.companyName} onChange={e => setCfg(c => ({ ...c, companyName: e.target.value }))} placeholder="Acme Shades" />
              </Field>
              <Field label="Industry" icon={<Target className="w-4 h-4" />}>
                <select className="input" value={cfg.industry} onChange={e => setCfg(c => ({ ...c, industry: e.target.value }))}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </Field>
            </div>

            {/* Scenario */}
            <Field label="Scenario" icon={<MessageSquare className="w-4 h-4" />}>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'cart-recovery', label: 'Cart Recovery', desc: 'Sees cart, upsells, closes' },
                  { id: 'service-call', label: 'Service Call', desc: 'Books appts, answers Qs' },
                  { id: 'custom', label: 'Custom Flow', desc: 'Write your own script' },
                ] as { id: VoiceScenarioType; label: string; desc: string }[]).map(s => (
                  <button key={s.id} type="button"
                    onClick={() => setCfg(c => ({ ...c, scenarioType: s.id }))}
                    className={`p-3 rounded-lg border text-left transition-all ${cfg.scenarioType === s.id ? 'border-primary bg-primary/10' : 'border-border hover:border-foreground/40'}`}
                  >
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </Field>

            {/* Agent name + Caller */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Agent Name" icon={<User className="w-4 h-4" />}>
                <input className="input" value={cfg.agentName} onChange={e => setCfg(c => ({ ...c, agentName: e.target.value }))} />
              </Field>
              <Field label="Caller Name">
                <input className="input" value={cfg.callerName || ''} onChange={e => setCfg(c => ({ ...c, callerName: e.target.value }))} />
              </Field>
              <Field label="Caller Phone">
                <input className="input" value={cfg.callerPhone || ''} onChange={e => setCfg(c => ({ ...c, callerPhone: e.target.value }))} />
              </Field>
            </div>

            {/* Voice picker */}
            <Field label="Agent Voice" icon={<Mic className="w-4 h-4" />}>
              <div className="flex gap-2">
                <select
                  className="input flex-1"
                  value={cfg.voiceURI}
                  onChange={e => {
                    const v = voices.find(x => x.voiceURI === e.target.value);
                    setCfg(c => ({ ...c, voiceURI: e.target.value, voiceName: v?.name || '' }));
                  }}
                >
                  {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} — {v.lang}</option>)}
                </select>
                <button type="button" onClick={previewVoice}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                  Preview
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-muted-foreground w-16">Rate</span>
                <input type="range" min="0.7" max="1.3" step="0.05" value={cfg.voiceRate}
                  onChange={e => setCfg(c => ({ ...c, voiceRate: parseFloat(e.target.value) }))}
                  className="flex-1" />
                <span className="text-xs w-10 text-right">{cfg.voiceRate.toFixed(2)}x</span>
              </div>
            </Field>

            {/* Greeting */}
            <Field label="Opening Line (optional)">
              <input className="input" placeholder="Auto-generated if blank"
                value={cfg.greetingLine || ''}
                onChange={e => setCfg(c => ({ ...c, greetingLine: e.target.value }))} />
            </Field>

            {/* Presence */}
            <Field label="Trained On / Presence Context (optional)" icon={<FileText className="w-4 h-4" />}>
              <textarea rows={3} className="input resize-none"
                placeholder="Paste product details, FAQ, pricing — what the agent should 'know'."
                value={cfg.presenceContext || ''}
                onChange={e => setCfg(c => ({ ...c, presenceContext: e.target.value }))} />
            </Field>

            {/* Cart (only cart scenario) */}
            {cfg.scenarioType === 'cart-recovery' && (
              <Field label="Caller's Cart" icon={<ShoppingCart className="w-4 h-4" />}>
                <div className="space-y-2">
                  {(cfg.cart || []).map((it, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className="input flex-1" placeholder="Item name" value={it.name} onChange={e => updateCartItem(i, { name: e.target.value })} />
                      <input className="input w-24" type="number" step="0.01" placeholder="Price" value={it.price} onChange={e => updateCartItem(i, { price: parseFloat(e.target.value) || 0 })} />
                      <input className="input w-16" type="number" placeholder="Qty" value={it.qty} onChange={e => updateCartItem(i, { qty: parseInt(e.target.value) || 1 })} />
                      <button type="button" onClick={() => removeCartItem(i)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addCartItem} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Plus className="w-4 h-4" /> Add item
                  </button>
                </div>
              </Field>
            )}

            {/* Custom flow */}
            {cfg.scenarioType === 'custom' && (
              <Field label="Custom Script">
                <textarea rows={8} className="input resize-none font-mono text-xs"
                  placeholder={`AGENT: Hi, this is ${cfg.agentName}...\nOPTION: Tell me more\nOPTION: Not interested\nAGENT: Great, here's what we offer...`}
                  value={cfg.customFlow || ''}
                  onChange={e => setCfg(c => ({ ...c, customFlow: e.target.value }))} />
                <p className="text-xs text-muted-foreground mt-1">Use <code>AGENT:</code> lines for what the bot says and <code>OPTION:</code> lines for caller replies.</p>
              </Field>
            )}

            {/* Capabilities */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Toggle label="Allow upsell" checked={cfg.enableUpsell} onChange={v => setCfg(c => ({ ...c, enableUpsell: v }))} />
              <Toggle label="Allow transfer to human" checked={cfg.enableTransfer} onChange={v => setCfg(c => ({ ...c, enableTransfer: v }))} />
            </div>
          </div>

          <button type="submit" disabled={!isValid}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40 hover:opacity-90 transition-all">
            <Phone className="w-4 h-4" /> Start Call
          </button>
        </form>
      </motion.div>

      <style>{`
        .input { width: 100%; padding: 0.625rem 1rem; border-radius: 0.5rem; background: hsl(var(--secondary)); border: 1px solid hsl(var(--border)); color: hsl(var(--foreground)); outline: none; }
        .input:focus { box-shadow: 0 0 0 2px hsl(var(--primary) / 0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-primary" />
      {label}
    </label>
  );
}
