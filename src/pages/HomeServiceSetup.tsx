import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Video, Building, Zap, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { analyzeCompanyWebsite } from '@/lib/setup-analysis';

export default function HomeServiceSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const preset = (location.state as { industry?: string; companyName?: string; websiteUrl?: string } | null) || {};
  const industry = preset.industry || 'Home Services';
  const isHealthcare = industry.toLowerCase().includes('health');
  const [websiteUrl, setWebsiteUrl] = useState(preset.websiteUrl || 'https://www.renewalbyandersen.com');
  const [companyName, setCompanyName] = useState(preset.companyName || 'Renewal by Andersen');
  const [enableRecording, setEnableRecording] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showCustomSignals, setShowCustomSignals] = useState(false);
  const [customSignals, setCustomSignals] = useState<string[]>(['']);

  const isValid = websiteUrl && companyName;
  const verifySignal = isHealthcare ? 'Insurance Verified' : 'Serviceable Address';
  const activeCustom = customSignals.filter(s => s.trim());
  const firingSignals = ['Qualified Call', 'Converted Call', verifySignal, ...activeCustom];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLaunching(true);

    const analysis = await analyzeCompanyWebsite(websiteUrl, companyName, industry);

    navigate('/home-service-demo', {
      state: {
        websiteUrl,
        companyName,
        industry,
        enableRecording,
        scrapedAd: analysis.scrapedAd,
        customSignals: activeCustom,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <InvocaLogo className="scale-[5]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-col items-center"
          >
            <InvocaLogo size="lg" className="mb-3" />
            <span className="text-sm font-semibold text-primary">IFM for {isHealthcare ? 'Healthcare' : 'Home Service'}</span>
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Live Search-to-Site Journey
          </h1>
          <p className="text-muted-foreground">
            Enter a search keyword and company URL to simulate the full customer journey — from Google search to their real website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-surface rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Renewal by Andersen"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Company Website URL
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={e => {
                  let v = e.target.value.trim();
                  if (v && !v.startsWith('http://') && !v.startsWith('https://')) {
                    v = `https://${v}`;
                  }
                  setWebsiteUrl(v);
                }}
                placeholder="www.renewalbyandersen.com"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Record toggle */}
            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                Record Demo
              </label>
              <button
                type="button"
                onClick={() => setEnableRecording(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${enableRecording ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${enableRecording ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Custom Signals */}
          <div className="glass-surface rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                Custom Signals
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSignals(v => !v);
                  if (!showCustomSignals && customSignals.length === 0) setCustomSignals(['']);
                }}
                className={`relative w-11 h-6 rounded-full transition-colors ${showCustomSignals ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${showCustomSignals ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {showCustomSignals && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Define up to 5 custom signals. Each appears as a column in the Marketing Call Details report.
                </p>
                {customSignals.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-5 text-right flex-shrink-0">{i + 1}.</span>
                    <input
                      type="text"
                      value={s}
                      onChange={e => {
                        const updated = [...customSignals];
                        updated[i] = e.target.value;
                        setCustomSignals(updated);
                      }}
                      placeholder={`e.g. ${i === 0 ? 'Booked Estimate' : i === 1 ? 'Spanish Speaker' : 'Signal name'}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setCustomSignals(customSignals.filter((_, j) => j !== i))}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {customSignals.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setCustomSignals([...customSignals, ''])}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add signal
                  </button>
                )}
              </motion.div>
            )}

            {/* Firing preview */}
            <div className="pt-2 border-t border-border/60">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Signals that will fire</p>
              <div className="flex flex-wrap gap-1.5">
                {firingSignals.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
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
                Analyzing website…
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
