import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

export default function JourneyWebsite({ config, onNext }: Props) {
  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl"
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
        </div>

        {/* Website content mock */}
        <div className="p-8 space-y-6 min-h-[400px]">
          {/* Nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20" />
              <span className="font-bold text-gray-800 text-lg">{config.companyName}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Services', 'About', 'Reviews', 'Contact'].map(item => (
                <span key={item} className="text-sm text-gray-500">{item}</span>
              ))}
            </div>
          </div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-2">
              Professional {config.industry} Services
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Trusted by thousands of customers. Get your free quote today.
            </p>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg"
            >
              Get a Free Quote →
            </motion.button>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            {['Licensed & Insured', '5-Star Reviews', 'Free Estimates'].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-1">{['🛡️', '⭐', '💰'][i]}</div>
                <span className="text-xs font-medium text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Customer browses the website and clicks "Get a Free Quote"…
        </span>
      </motion.div>
    </motion.div>
  );
}
