import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Search, Check } from 'lucide-react';
import { useState } from 'react';
import { generateMockPages } from '@/lib/mock-pages';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (page: string) => void;
  industry: string;
  websiteUrl: string;
  currentPage?: string;
}

export default function PresenceModal({ open, onClose, onSelect, industry, websiteUrl, currentPage }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setPages(generateMockPages(industry, websiteUrl));
      setIsScanning(false);
      setScanned(true);
    }, 1500);
  };

  const handleSelect = (page: string) => {
    onSelect(page);
    onClose();
  };

  const handleRemove = () => {
    onSelect('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-[hsl(220,14%,14%)] rounded-2xl border border-[hsl(220,14%,22%)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(220,14%,22%)]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Add Presence</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {!scanned ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-white/60">
                    Scan <span className="text-white/80 font-medium">{websiteUrl || 'the website'}</span> for high-value drop-off pages to target with personalized messaging.
                  </p>
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50 transition-all"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Scanning pages…
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Scan Website
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-white/50 mb-3">
                    Select a drop-off page to personalize the intro message:
                  </p>
                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                    {pages.map(page => (
                      <button
                        key={page}
                        onClick={() => handleSelect(page)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                          currentPage === page
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-[hsl(220,14%,18%)] text-white/80 hover:bg-[hsl(220,14%,22%)] hover:text-white'
                        }`}
                      >
                        <span>{page}</span>
                        {currentPage === page && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                  {currentPage && (
                    <button
                      onClick={handleRemove}
                      className="w-full text-center text-xs text-white/40 hover:text-white/60 mt-2 py-1 transition-colors"
                    >
                      Remove presence
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
