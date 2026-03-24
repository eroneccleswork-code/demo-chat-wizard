import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

function getSearchQuery(config: BusinessConfig): string {
  const queries: Record<string, string> = {
    'Window Cleaning': 'window cleaning near me',
    'Dental': 'dentist near me',
    'Real Estate': 'homes for sale near me',
    'HVAC': 'ac repair near me',
    'Legal': 'lawyer near me',
    'Blinds': 'custom blinds near me',
    'Landscaping': 'landscaping services near me',
    'Plumbing': 'plumber near me',
    'Auto Repair': 'auto repair shop near me',
    'Insurance': 'insurance quotes near me',
    'Fitness': 'gym near me',
  };
  return queries[config.industry] || `${config.industry.toLowerCase()} near me`;
}

export default function JourneyGoogleAd({ config, onNext }: Props) {
  const query = getSearchQuery(config);
  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
    >
      {/* Mock Google search */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-full border border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-gray-800 text-sm overflow-hidden whitespace-nowrap"
            >
              {query}
            </motion.span>
          </div>
        </div>

        {/* Sponsored result */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Sponsored</span>
            </div>
            <p className="text-xs text-green-700">{domain}</p>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.01 }}
              className="text-left"
            >
              <h3 className="text-lg text-blue-700 hover:underline font-medium cursor-pointer">
                {config.companyName} — {config.industry} Services
              </h3>
            </motion.button>
            <p className="text-sm text-gray-600">
              Professional {config.industry.toLowerCase()} services. Get a free quote today. Licensed & insured. ★★★★★ 4.9/5 rating.
            </p>
          </motion.div>

          {/* Organic results (faded) */}
          <div className="mt-6 space-y-4 opacity-40">
            {[1, 2].map(i => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-center mt-4"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
        >
          Customer clicks the ad…
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
