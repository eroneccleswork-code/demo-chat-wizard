import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  websiteUrl: string;
  domain: string;
  onNext?: () => void;
}

export default function HomeServiceWebsite({ websiteUrl, domain, onNext }: Props) {
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col relative"
    >
      <div className="flex-1">
        <iframe
          src={url}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
          title="Continue to SMS demo (→)"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      )}
    </motion.div>
  );
}
