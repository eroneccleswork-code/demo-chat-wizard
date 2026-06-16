import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { firecrawlApi } from '@/lib/api/firecrawl';

interface Props {
  websiteUrl: string;
  domain: string;
  companyName?: string;
  industry?: string;
  customSignals?: string[];
  onNext?: () => void;
  onBack?: () => void;
}

export default function HomeServiceWebsite({ websiteUrl, domain, companyName, industry, customSignals, onNext }: Props) {
  const [fallbackHtml, setFallbackHtml] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const url = useMemo(() => {
    const cleanedWebsiteUrl = websiteUrl.trim().replace(/^(https?:\/\/)+/i, 'https://').replace(/\s+/g, '');
    return cleanedWebsiteUrl.startsWith('http') ? cleanedWebsiteUrl : `https://${cleanedWebsiteUrl}`;
  }, [websiteUrl]);
  const navigate = useNavigate();
  const goToInvoca = () => {
    if (onNext) onNext();
    else navigate('/invoca', { state: { companyName, industry, customSignals } });
  };

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const result = await firecrawlApi.scrape(url, {
          formats: ['rawHtml', 'html'],
          onlyMainContent: false,
          waitFor: 2000,
        });

        const html = result?.data?.rawHtml || result?.rawHtml || result?.data?.html || result?.html || '';
        if (!cancelled && html) {
          setFallbackHtml(`<!doctype html><html><head><base href="${url}"></head><body>${html}</body></html>`);
          setUseFallback(true);
        }
      } catch (error) {
        console.warn('Failed to render website fallback:', error);
      }
    }, 2200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [url]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col relative outline-none"
    >
      <div className="flex-1">
        <iframe
          src={useFallback ? undefined : url}
          srcDoc={useFallback ? fallbackHtml : undefined}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Invisible clickable zone in bottom-right corner — advances to Invoca dashboard */}
      <div
        onClick={goToInvoca}
        className="absolute right-0 bottom-0 w-24 h-24 z-50 cursor-default"
        title="Continue to Invoca"
      />
    </motion.div>
  );
}
