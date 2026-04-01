import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Globe, Video } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';

export default function HomeServiceSetup() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [enableRecording, setEnableRecording] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const isValid = searchKeyword && websiteUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLaunching(true);
    await new Promise(r => setTimeout(r, 1000));
    navigate('/home-service-demo', {
      state: { searchKeyword, websiteUrl, enableRecording },
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
            <span className="text-sm font-semibold text-primary">Home Service Demo</span>
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
                <Search className="w-4 h-4 text-muted-foreground" />
                Search Keyword
              </label>
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="window replacement near me"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Company Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://www.renewalbyandersen.com"
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
                Loading journey…
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
