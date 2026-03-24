import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

const FORM_FIELDS = [
  { label: 'Full Name', value: 'Sarah Johnson' },
  { label: 'Email', value: 'sarah.j@email.com' },
  { label: 'Phone', value: '(555) 234-5678' },
  { label: 'Message', value: "I'd like to get a quote for your services." },
];

const CONTACT_PATHS = ['/contact', '/contact-us', '/get-a-quote', '/request-quote', '/quote', '/get-quote', '/free-quote', '/schedule', '/book', '/appointment'];

export default function JourneyFormFill({ config, onNext }: Props) {
  const [filledFields, setFilledFields] = useState(0);
  const [fieldTexts, setFieldTexts] = useState<string[]>(FORM_FIELDS.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const rawUrl = config.websiteUrl || 'https://example.com';
  const baseUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const domain = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Try the base URL first — most sites have forms on the homepage or we try /contact
  const contactUrl = `${baseUrl.replace(/\/$/, '')}${CONTACT_PATHS[0]}`;

  // Auto-type effect — starts after iframe loads (or after 2s fallback)
  useEffect(() => {
    const startDelay = setTimeout(() => setIframeLoaded(true), 2000);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!iframeLoaded) return;
    if (filledFields >= FORM_FIELDS.length) {
      const timer = setTimeout(() => setSubmitted(true), 800);
      return () => clearTimeout(timer);
    }

    const field = FORM_FIELDS[filledFields];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      charIndex++;
      setFieldTexts(prev => {
        const next = [...prev];
        next[filledFields] = field.value.slice(0, charIndex);
        return next;
      });

      if (charIndex >= field.value.length) {
        clearInterval(typeInterval);
        setTimeout(() => setFilledFields(f => f + 1), 300);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [filledFields, iframeLoaded]);

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
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-500 border border-gray-200 min-w-[300px] text-center">
              🔒 {domain}/contact
            </div>
          </div>
        </div>

        {/* Split: real site iframe + form fill overlay */}
        <div className="relative" style={{ height: '480px' }}>
          {/* Real website iframe in background */}
          <iframe
            src={contactUrl}
            title={`${config.companyName} contact page`}
            className="w-full h-full border-0 absolute inset-0"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setIframeLoaded(true)}
            style={{ pointerEvents: 'none' }}
          />

          {/* Form fill overlay — positioned on the right side over the page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: iframeLoaded ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute right-4 top-4 bottom-4 w-[320px] flex flex-col"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 p-5 space-y-3 overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Live Form Fill</span>
              </div>

              {FORM_FIELDS.map((field, i) => (
                <div key={field.label} className="space-y-0.5">
                  <label className="text-[11px] font-medium text-gray-500">{field.label}</label>
                  <div
                    className={`w-full px-2.5 py-1.5 rounded-md border text-xs transition-all ${
                      i < filledFields
                        ? 'border-primary/40 bg-primary/5 text-gray-800'
                        : i === filledFields
                          ? 'border-primary/60 bg-primary/10 text-gray-800 shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-300'
                    }`}
                  >
                    {fieldTexts[i] || (i > filledFields ? '—' : '')}
                    {i === filledFields && iframeLoaded && (
                      <span className="animate-pulse text-primary">|</span>
                    )}
                  </div>
                </div>
              ))}

              <motion.div
                animate={submitted ? { scale: [1, 0.97, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-full py-2 rounded-lg text-center text-xs font-medium transition-all ${
                  submitted
                    ? 'bg-primary text-white'
                    : filledFields >= FORM_FIELDS.length
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {submitted ? '✓ Form Submitted!' : 'Submit'}
              </motion.div>
            </div>
          </motion.div>

          {/* Subtle gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Customer fills out the contact form on the real website…
        </span>
      </motion.div>
    </motion.div>
  );
}
