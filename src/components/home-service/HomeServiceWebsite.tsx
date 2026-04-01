import { motion } from 'framer-motion';

interface Props {
  websiteUrl: string;
  domain: string;
}

export default function HomeServiceWebsite({ websiteUrl, domain }: Props) {
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen bg-white flex flex-col"
    >
      <div className="flex-1">
        <iframe
          src={url}
          title={domain}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </motion.div>
  );
}
