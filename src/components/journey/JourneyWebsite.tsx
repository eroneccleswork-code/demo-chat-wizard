import { useState } from 'react';
import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
  variant?: 'form' | 'call';
}

export default function JourneyWebsite({ config, onNext, variant = 'form' }: Props) {
  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';
  const baseUrl = config.websiteUrl?.startsWith('http') ? config.websiteUrl : `https://${config.websiteUrl}`;
  const [iframeError, setIframeError] = useState(false);
  const [contactPathIndex, setContactPathIndex] = useState(0);

  const isCallVariant = variant === 'call';

  // For call variant, try contact pages where the phone number is likely visible
  const CONTACT_PATHS = ['/contact', '/contact-us', '/about', '/about-us', '/locations', ''];
  const iframeSrc = isCallVariant
    ? `${baseUrl.replace(/\/$/, '')}${CONTACT_PATHS[contactPathIndex]}`
    : baseUrl;
  const displayPath = isCallVariant && CONTACT_PATHS[contactPathIndex]
    ? `${domain}${CONTACT_PATHS[contactPathIndex]}`
    : domain;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl"
    >
      {/* Browser chrome */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 border border-gray-200 min-w-[300px] text-center">
              🔒 {displayPath}
            </div>
          </div>
        </div>

        {/* Real website iframe */}
        <div className="relative w-full" style={{ height: '480px' }}>
          {!iframeError ? (
            <iframe
              src={iframeSrc}
              title={`${config.companyName} website`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              onError={() => {
                // If a contact path fails, try next one
                if (isCallVariant && contactPathIndex < CONTACT_PATHS.length - 1) {
                  setContactPathIndex(i => i + 1);
                } else {
                  setIframeError(true);
                }
              }}
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <img
              src={`https://image.thum.io/get/width/1280/crop/960/${iframeSrc}`}
              alt={`${config.companyName} website screenshot`}
              className="w-full h-full object-cover object-top"
            />
          )}


          {/* Click overlay to advance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/40 via-transparent to-transparent cursor-pointer h-32"
            onClick={onNext}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="px-5 py-2.5 bg-white/95 backdrop-blur rounded-lg shadow-lg text-sm font-medium text-gray-800 flex items-center gap-2"
            >
              {isCallVariant
                ? 'Customer clicks the phone number →'
                : 'Customer finds the contact form →'}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Customer browses the real website…
        </span>
      </motion.div>
    </motion.div>
  );
}
