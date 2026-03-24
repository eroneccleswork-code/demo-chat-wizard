import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onNext: () => void;
}

const FORM_FIELDS = [
  { label: 'Full Name', value: 'Sarah Johnson', type: 'text' },
  { label: 'Email', value: 'sarah.j@email.com', type: 'email' },
  { label: 'Phone', value: '(555) 234-5678', type: 'tel' },
  { label: 'Message', value: 'I\'d like to get a quote for your services.', type: 'textarea' },
];

export default function JourneyFormFill({ config, onNext }: Props) {
  const [filledFields, setFilledFields] = useState<number>(0);
  const [fieldTexts, setFieldTexts] = useState<string[]>(FORM_FIELDS.map(() => ''));
  const [submitted, setSubmitted] = useState(false);

  const domain = config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'example.com';

  // Auto-type effect
  useEffect(() => {
    if (filledFields >= FORM_FIELDS.length) {
      // All fields filled, submit after a beat
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
  }, [filledFields]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl"
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

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-1">Request a Free Quote</h3>
          <p className="text-sm text-gray-500 mb-6">Fill out the form below and we'll get back to you shortly.</p>

          <div className="space-y-4">
            {FORM_FIELDS.map((field, i) => (
              <div key={field.label} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                {field.type === 'textarea' ? (
                  <div
                    className={`w-full px-3 py-2 rounded-md border text-sm min-h-[60px] transition-all ${
                      i <= filledFields
                        ? 'border-primary/50 bg-primary/5 text-gray-800'
                        : 'border-gray-200 bg-gray-50 text-gray-300'
                    }`}
                  >
                    {fieldTexts[i]}
                    {i === filledFields && <span className="animate-pulse">|</span>}
                  </div>
                ) : (
                  <div
                    className={`w-full px-3 py-2 rounded-md border text-sm transition-all ${
                      i <= filledFields
                        ? 'border-primary/50 bg-primary/5 text-gray-800'
                        : 'border-gray-200 bg-gray-50 text-gray-300'
                    }`}
                  >
                    {fieldTexts[i] || field.label}
                    {i === filledFields && <span className="animate-pulse">|</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            animate={submitted ? { scale: [1, 0.97, 1], backgroundColor: ['hsl(170,50%,45%)', 'hsl(170,50%,40%)', 'hsl(170,50%,45%)'] } : {}}
            transition={{ duration: 0.3 }}
            className={`mt-6 w-full py-2.5 rounded-lg text-center text-sm font-medium transition-all ${
              submitted
                ? 'bg-primary text-white'
                : filledFields >= FORM_FIELDS.length
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-400'
            }`}
          >
            {submitted ? '✓ Form Submitted!' : 'Submit Request'}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <span className="text-xs text-muted-foreground">
          Customer fills out the contact form with their details…
        </span>
      </motion.div>
    </motion.div>
  );
}
