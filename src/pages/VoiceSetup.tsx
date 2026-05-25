import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Video, Building } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import { firecrawlApi } from '@/lib/api/firecrawl';
import { supabase } from '@/integrations/supabase/client';

export default function VoiceSetup() {
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [enableRecording, setEnableRecording] = useState(false);
  const [voiceId, setVoiceId] = useState(ELEVEN_VOICES[0].id);
  const [previewing, setPreviewing] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [stage, setStage] = useState<string>('');

  const previewVoice = async () => {
    if (previewing) return;
    setPreviewing(true);
    try {
      const audio = await speakWithElevenLabs(
        `Hi, this is your AI voice agent from ${companyName || 'your company'}. How can I help today?`,
        voiceId
      );
      audio.onended = () => setPreviewing(false);
      audio.onerror = () => setPreviewing(false);
      await audio.play();
    } catch (e) {
      console.error(e);
      setPreviewing(false);
    }
  };

  const isValid = websiteUrl && companyName && voiceId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLaunching(true);

    setStage('Scraping site…');
    let websiteMarkdown = '';
    let scrapedAd: any = null;
    try {
      const r = await firecrawlApi.scrape(websiteUrl, { formats: ['markdown'], onlyMainContent: true });
      if (r.success) {
        const md = r.data?.markdown || r.markdown || '';
        const meta = r.data?.metadata || r.metadata || {};
        websiteMarkdown = md;
        const headings = (md.match(/^#{1,3}\s+(.+)/gm) || [])
          .map((h: string) => h.replace(/^#+\s+/, '').trim())
          .filter((h: string) => h.length > 3 && h.length < 60)
          .slice(0, 3);
        scrapedAd = {
          description: meta.description || meta.ogDescription || md.split('\n').filter((l: string) => l.length > 30)[0]?.slice(0, 200) || '',
          metaTitle: meta.title || '',
          sitelinks: headings,
        };
      }
    } catch (err) {
      console.warn('Scrape failed:', err);
    }

    setStage('Training voice agent on cart & site…');
    let flow: any = null;
    try {
      const { data, error } = await supabase.functions.invoke('generate-voice-flow', {
        body: { companyName, websiteUrl, websiteMarkdown: websiteMarkdown.slice(0, 4000) },
      });
      if (!error && data?.success) flow = data.flow;
    } catch (err) {
      console.warn('Flow gen failed:', err);
    }

    const voice = ELEVEN_VOICES.find(v => v.id === voiceId);
    navigate('/voice-demo', {
      state: {
        websiteUrl,
        companyName,
        enableRecording,
        scrapedAd,
        voiceId,
        voiceName: voice?.name || '',
        flow,
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
          <div className="mb-6 flex flex-col items-center">
            <InvocaLogo size="lg" className="mb-3" />
            <span className="text-sm font-semibold text-primary">AI Voice Agent</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Live Search-to-Call Journey</h1>
          <p className="text-muted-foreground">
            Enter a company URL — we'll scrape the site, train the voice agent on the real cart, and run a live call.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-surface rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" /> Company Name
              </label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="Acme Shades"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" /> Company Website URL
              </label>
              <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://www.acmeshades.com"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mic className="w-4 h-4 text-muted-foreground" /> Agent Voice
                <span className="text-xs text-muted-foreground font-normal">(Deepgram Aura)</span>
              </label>
              <div className="flex gap-2">
                <select value={voiceId} onChange={e => setVoiceId(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {ELEVEN_VOICES.map(v => (
                    <option key={v.id} value={v.id}>{v.name} — {v.description}</option>
                  ))}
                </select>
                <button type="button" onClick={previewVoice} disabled={previewing}
                  className="px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-60">
                  {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Preview
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" /> Record Demo
              </label>
              <button type="button" onClick={() => setEnableRecording(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${enableRecording ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${enableRecording ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <motion.button type="submit" disabled={!isValid || isLaunching}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 transition-all glow-primary">
            {isLaunching ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {stage || 'Launching…'}
              </>
            ) : (
              <>Launch Demo <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
