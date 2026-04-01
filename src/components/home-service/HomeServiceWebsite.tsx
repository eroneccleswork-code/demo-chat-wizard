import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Props {
  websiteUrl: string;
  domain: string;
  onNext?: () => void;
  onBack?: () => void;
}

export default function HomeServiceWebsite({ websiteUrl, domain, onNext, onBack }: Props) {
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodically steal focus back from iframe so arrow keys work
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.activeElement?.tagName === 'IFRAME') {
        containerRef.current?.focus();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' && onNext) { e.preventDefault(); onNext(); }
        if (e.key === 'ArrowLeft' && onBack) { e.preventDefault(); onBack(); }
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col relative outline-none"
    >
      <div className="flex-1">
        <iframe
          src={url}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      {/* Invisible clickable zone in bottom-right corner for presenter */}
      {onNext && (
        <div
          onClick={onNext}
          className="absolute right-0 bottom-0 w-24 h-24 z-50 cursor-default"
        />
      )}
    </motion.div>
  );
}
