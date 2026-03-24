import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';
import { Phone } from 'lucide-react';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
  variant?: 'form' | 'call';
}

const FORM_FIELDS = [
  { label: 'Full Name', value: 'Sarah Johnson' },
  { label: 'Email', value: 'sarah.j@email.com' },
  { label: 'Phone', value: '(555) 234-5678' },
  { label: 'Message', value: "I'd like to get a quote for your services." },
];

export default function JourneyWebsite({ config, onNext, variant = 'form' }: Props) {
  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';
  const baseUrl = config.websiteUrl?.startsWith('http') ? config.websiteUrl : `https://${config.websiteUrl}`;
  const screenshotUrl = `https://image.thum.io/get/width/1280/crop/960/noanimate/${baseUrl}`;

  const isCall = variant === 'call';

  // Form fill auto-type state
  const [filledFields, setFilledFields] = useState(0);
  const [fieldTexts, setFieldTexts] = useState<string[]>(FORM_FIELDS.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Click-to-call state
  const [callClicked, setCallClicked] = useState(false);

  // Detect a phone number from the company name/domain for click-to-call display
  const phoneNumber = config.phoneNumber || '(800) 555-0199';

  // Show form or call button after a delay
  useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-type form fields (SMS variant only)
  useEffect(() => {
    if (isCall || !formVisible) return;
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
  }, [filledFields, formVisible, isCall]);

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
        </div>

        {/* Website screenshot + overlay */}
        <div className="relative w-full" style={{ height: '500px' }}>
          <img
            src={screenshotUrl}
            alt={`${config.companyName} website`}
            className="w-full h-full object-cover object-top"
          />

          {/* Click-to-call button — top right of "website" (call variant) */}
          {isCall && formVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-3 right-3 z-10"
            >
              <motion.button
                onClick={() => {
                  setCallClicked(true);
                  setTimeout(onNext, 800);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all ${
                  callClicked
                    ? 'bg-green-600 text-white'
                    : 'bg-primary text-primary-foreground hover:shadow-xl'
                }`}
              >
                <Phone className="w-4 h-4" fill="currentColor" />
                {callClicked ? 'Connecting…' : phoneNumber}
              </motion.button>

              {/* Attention ring */}
              {!callClicked && (
                <motion.div
                  className="absolute -inset-1 rounded-lg border-2 border-primary"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}

          {/* Form fill overlay — right side (form variant) */}
          {!isCall && formVisible && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute right-4 top-4 bottom-4 w-[300px] flex flex-col z-10"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 p-5 space-y-3">
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
                      {i === filledFields && (
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
                      ? 'bg-primary text-primary-foreground'
                      : filledFields >= FORM_FIELDS.length
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {submitted ? '✓ Form Submitted!' : 'Submit'}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          {isCall
            ? 'Customer sees the phone number and calls…'
            : 'Customer fills out the contact form on the website…'}
        </span>
      </motion.div>
    </motion.div>
  );
}
