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
  const fullUrl = config.websiteUrl?.startsWith('http') ? config.websiteUrl : `https://${config.websiteUrl}`;
  const [iframeError, setIframeError] = useState(false);

  const phoneNumber = config.customContext?.replace('Phone: ', '') || '(800) 555-0199';
  const isCallVariant = variant === 'call';

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
              🔒 {domain}
            </div>
          </div>
          {/* Click-to-call number in browser bar for call variant */}
          {isCallVariant && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded-md text-xs font-semibold cursor-pointer shadow-md"
              onClick={onNext}
            >
              <Phone className="w-3 h-3" />
              {phoneNumber}
            </motion.div>
          )}
        </div>

        {/* Real website iframe */}
        <div className="relative w-full" style={{ height: '480px' }}>
          {!iframeError ? (
            <iframe
              src={fullUrl}
              title={`${config.companyName} website`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              onError={() => setIframeError(true)}
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            /* Fallback: screenshot via thum.io */
            <img
              src={`https://image.thum.io/get/width/1280/crop/960/${fullUrl}`}
              alt={`${config.companyName} website screenshot`}
              className="w-full h-full object-cover object-top"
            />
          )}

          {/* Click-to-call floating button for call variant */}
          {isCallVariant && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-full shadow-xl cursor-pointer hover:bg-green-700 transition-colors"
              onClick={onNext}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-bold">{phoneNumber}</span>
            </motion.div>
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
                ? `Customer clicks to call ${phoneNumber} →`
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
