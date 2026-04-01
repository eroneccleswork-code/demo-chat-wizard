import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Target, Globe, Video } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { BusinessConfig } from '@/lib/types';
import { analyzeCompanyWebsite } from '@/lib/setup-analysis';

const INDUSTRIES = [
  'Window Cleaning', 'Dental', 'Real Estate', 'HVAC', 'Legal',
  'Landscaping', 'Plumbing', 'Auto Repair', 'Insurance', 'Fitness', 'Blinds',
];

export default function JourneySetup() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [enableRecording, setEnableRecording] = useState(false);

  const finalIndustry = industry === 'Other' ? customIndustry : industry;
  const isValid = companyName && finalIndustry && websiteUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLaunching(true);

    // Scrape for ad data
    let scrapedAd: any = null;
    try {
      const result = await firecrawlApi.scrape(websiteUrl, {
        formats: ['markdown'],
        onlyMainContent: true,
      });
      if (result.success) {
        const markdown = result.data?.markdown || result.markdown || '';
        const metadata = result.data?.metadata || result.metadata || {};
        const lines = markdown.split('\n').filter((l: string) => l.trim().length > 30 && !l.startsWith('#') && !l.startsWith('|'));
        const description = lines.slice(0, 2).join(' ').slice(0, 200).trim();
        const headings = markdown.match(/^#{1,3}\s+(.+)/gm) || [];
        const sitelinkTitles = headings
          .map((h: string) => h.replace(/^#+\s+/, '').trim())
          .filter((h: string) => h.length > 3 && h.length < 60)
          .slice(0, 3);
        scrapedAd = {
          description: description || metadata.description || '',
          metaTitle: metadata.title || '',
          sitelinks: sitelinkTitles,
        };
      }
    } catch (err) {
      console.warn('Failed to scrape site, using defaults:', err);
    }

    const config: BusinessConfig = {
      companyName,
      industry: finalIndustry,
      cta: 'Get Quote',
      websiteUrl,
    };
    navigate('/journey', { state: { config, enableRecording, scrapedAd } });
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
            <span className="text-sm font-semibold text-primary">Customer Journey Demo</span>
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            See the full journey
          </h1>
          <p className="text-muted-foreground">
            Enter a company website and watch the customer experience — from Google search to SMS engagement.
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
                placeholder="Acme Services"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Industry
              </label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                <option value="Other">Other</option>
              </select>
              {industry === 'Other' && (
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
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
                Launch Journey Demo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
