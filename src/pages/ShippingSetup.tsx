import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Globe, Video, Package } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { BusinessConfig } from '@/lib/types';

export default function ShippingSetup() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [enableRecording, setEnableRecording] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

  const isValid = companyName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLaunching(true);
    await new Promise(r => setTimeout(r, 600));
    const config: BusinessConfig = {
      companyName,
      industry: 'Shipping & Fulfillment',
      cta: 'Request Callback',
      websiteUrl,
      enableRecording,
      flowType: 'shipping',
    };
    navigate('/demo', { state: { config } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <InvocaLogo className="scale-[5]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <div className="mb-6 flex flex-col items-center">
            <InvocaLogo size="lg" className="mb-3" />
            <span className="text-sm font-semibold text-primary flex items-center gap-1.5">
              <Package className="w-4 h-4" /> Shipping Support Agent
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Configure your agent
          </h1>
          <p className="text-muted-foreground">
            Watch the AI collect a shipping number, look it up, and escalate to a human callback.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-surface rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Acme Fulfillment"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Website URL
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="glass-surface rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">Record Pitch</span>
                <p className="text-xs text-muted-foreground">Enable screen recording on the demo page</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnableRecording(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${enableRecording ? 'bg-primary' : 'bg-muted'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enableRecording ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={!isValid || isLaunching}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-primary"
          >
            {isLaunching ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Preparing demo…
              </>
            ) : (
              <>
                Launch Demo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
