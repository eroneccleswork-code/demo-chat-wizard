import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Building2, Target, Zap, Radio, Search, Check, X } from 'lucide-react';
import InvocaLogo from './InvocaLogo';
import { BusinessConfig } from '@/lib/types';
import { generateMockPages } from '@/lib/mock-pages';

const INDUSTRIES = [
  'Window Cleaning',
  'Dental',
  'Real Estate',
  'HVAC',
  'Legal',
  'Landscaping',
  'Plumbing',
  'Auto Repair',
  'Insurance',
  'Fitness',
  'Blinds',
];

const CTAS = [
  'Book Appointment',
  'Get Quote',
  'Schedule Consultation',
  'Request Callback',
  'Start Free Trial',
];

export default function SetupForm() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<BusinessConfig>({
    companyName: '',
    industry: '',
    cta: '',
    websiteUrl: '',
    customContext: '',
  });
  const [customIndustry, setCustomIndustry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [presencePage, setPresencePage] = useState('');
  const [presencePages, setPresencePages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showPresenceList, setShowPresenceList] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalConfig: BusinessConfig = {
      ...config,
      industry: config.industry === 'Other' ? customIndustry : config.industry,
      presencePage: presencePage || undefined,
    };
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    navigate('/demo', { state: { config: finalConfig } });
  };

  const isValid = config.companyName && config.industry && config.cta && 
    (config.industry !== 'Other' || customIndustry);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Invoca watermark background */}
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
            <span className="text-sm font-semibold text-primary">AI Messaging Agent</span>
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Configure your agent
          </h1>
          <p className="text-muted-foreground">
            Set up your business profile and watch AI qualify leads in real-time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-surface rounded-xl p-6 space-y-5">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company Name
              </label>
              <input
                type="text"
                value={config.companyName}
                onChange={e => setConfig(c => ({ ...c, companyName: e.target.value }))}
                placeholder="Acme Services"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Industry
              </label>
              <select
                value={config.industry}
                onChange={e => setConfig(c => ({ ...c, industry: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="" className="text-muted-foreground">Select industry…</option>
                {INDUSTRIES.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {config.industry === 'Other' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  value={customIndustry}
                  onChange={e => setCustomIndustry(e.target.value)}
                  placeholder="Enter your industry"
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              )}
            </div>

            {/* CTA */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                Primary Call-To-Action
              </label>
              <select
                value={config.cta}
                onChange={e => setConfig(c => ({ ...c, cta: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="">Select CTA…</option>
                {CTAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Website URL
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                type="url"
                value={config.websiteUrl}
                onChange={e => setConfig(c => ({ ...c, websiteUrl: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Custom Context */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Custom Training Context
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <textarea
                value={config.customContext || ''}
                onChange={e => setConfig(c => ({ ...c, customContext: e.target.value }))}
                placeholder="Add any specific instructions, product details, pricing info, or conversation guidelines for the AI agent..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!isValid || isAnalyzing}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-primary"
          >
            {isAnalyzing ? (
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
