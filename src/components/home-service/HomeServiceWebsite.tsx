import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props {
  websiteUrl: string;
  domain: string;
  companyName?: string;
  industry?: string;
  onNext?: () => void;
  onBack?: () => void;
}

export default function HomeServiceWebsite({ websiteUrl, domain, companyName, industry, onNext }: Props) {
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
  const navigate = useNavigate();
  const goToInvoca = () => {
    if (onNext) onNext();
    else navigate('/invoca', { state: { companyName, industry } });
  };

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
          src={url}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
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
