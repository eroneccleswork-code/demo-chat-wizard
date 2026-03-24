import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';
import InvocaLogo from '../InvocaLogo';

interface Props {
  config: BusinessConfig;
}

interface DataPoint {
  label: string;
  value: string;
}

function generateConversationProfile(config: BusinessConfig): DataPoint[] {
  const industry = config.industry?.toLowerCase() || '';
  const company = config.companyName || 'Company';

  // Industry-specific data points
  if (industry.includes('health') || industry.includes('medical') || industry.includes('ortho')) {
    return [
      { label: 'Search Keyword', value: `"${industry} near me"` },
      { label: 'Google Click ID', value: `${Math.floor(Math.random() * 900000000) + 100000000}` },
      { label: 'Campaign', value: `${config.industry} — Regional` },
      { label: 'Web Visitor ID', value: `X${Math.floor(Math.random() * 900000) + 100000}` },
      { label: 'Insurance', value: 'United Healthcare' },
      { label: 'Calling Page URL', value: '/scheduling-availability' },
      { label: 'Caller ID', value: '(404) 464-0231' },
      { label: 'Interest Driver', value: 'Consultation' },
      { label: 'Manager Escalation', value: 'False' },
      { label: 'Outcome', value: 'Consultation booked' },
      { label: 'Agent', value: 'Candace Yen' },
      { label: 'Validated Patient Info', value: 'False' },
      { label: 'Call Quality Score', value: '6.6 / 10.0' },
    ];
  }

  if (industry.includes('internet') || industry.includes('telecom') || industry.includes('cable')) {
    return [
      { label: 'Search Keyword', value: '"high speed internet"' },
      { label: 'Google Click ID', value: `${Math.floor(Math.random() * 900000000) + 100000000}` },
      { label: 'Campaign', value: 'Bundle & Save' },
      { label: 'Web Visitor ID', value: `X${Math.floor(Math.random() * 900000) + 100000}` },
      { label: 'Serviceable Address', value: 'True' },
      { label: 'Product in Cart', value: 'Internet & TV' },
      { label: 'Calling Page URL', value: '/checkout' },
      { label: 'Caller ID', value: '(404) 464-0231' },
      { label: 'Interest Driver', value: 'Moving' },
      { label: 'Manager Escalation', value: 'False' },
      { label: 'Outcome', value: 'New service activation' },
      { label: 'Agent', value: 'Candace Yen' },
      { label: 'Mentioned Promotion', value: 'True' },
      { label: 'Call Quality Score', value: '6.6 / 10.0' },
    ];
  }

  // Default / generic
  return [
    { label: 'Search Keyword', value: `"${industry} services"` },
    { label: 'Google Click ID', value: `${Math.floor(Math.random() * 900000000) + 100000000}` },
    { label: 'Campaign', value: `${config.industry} — Brand` },
    { label: 'Web Visitor ID', value: `X${Math.floor(Math.random() * 900000) + 100000}` },
    { label: 'Calling Page URL', value: '/contact' },
    { label: 'Caller ID', value: '(404) 464-0231' },
    { label: 'Interest Driver', value: config.industry },
    { label: 'Manager Escalation', value: 'False' },
    { label: 'Outcome', value: 'New customer acquired' },
    { label: 'Agent', value: 'Candace Yen' },
    { label: 'Mentioned Promotion', value: 'True' },
    { label: 'Call Quality Score', value: '7.2 / 10.0' },
  ];
}

const PARTNER_LOGOS = ['Google', 'Adobe', 'Salesforce', 'Five9'];

export default function CallJourneyInvocaDashboard({ config }: Props) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showPartners, setShowPartners] = useState(false);

  const dataPoints = useMemo(() => generateConversationProfile(config), [config]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleRows(v => {
        if (v >= dataPoints.length) {
          clearInterval(interval);
          setTimeout(() => setShowPartners(true), 600);
          return v;
        }
        return v + 1;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [dataPoints.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Card */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-card">
        {/* Header — dark green bar */}
        <div className="bg-[#1a3c2a] px-6 py-5 flex items-center gap-4 relative">
          {/* Accent stripe */}
          <div className="absolute top-0 right-8 w-10 h-full bg-[#4caf50]/40 rounded-b-lg" />

          {/* Avatar */}
          <div className="w-16 h-16 rounded-lg bg-[#2a5c3a] overflow-hidden flex items-center justify-center flex-shrink-0 z-10">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#4caf50]/30 to-[#2a5c3a] flex items-center justify-center text-2xl">
              📞
            </div>
          </div>

          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <InvocaLogo size="sm" />
            </div>
            <p className="text-white/90 text-sm font-bold tracking-wide uppercase">
              Conversation Profile
            </p>
          </div>
        </div>

        {/* Data rows */}
        <div className="divide-y divide-border/60">
          {dataPoints.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -10 }}
              animate={i < visibleRows ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center px-6 py-3"
            >
              <span className="text-sm font-semibold text-foreground w-[45%] flex-shrink-0">
                {point.label}
              </span>
              <span className="text-sm text-muted-foreground">{point.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Partner logos */}
        {showPartners && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-center gap-6"
          >
            {PARTNER_LOGOS.map(name => (
              <span key={name} className="text-xs font-bold text-muted-foreground/60 tracking-wide">
                {name}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-center text-xs text-muted-foreground mt-4"
      >
        Invoca captures every signal from the call — attributing it back to the marketing source.
      </motion.p>
    </motion.div>
  );
}
