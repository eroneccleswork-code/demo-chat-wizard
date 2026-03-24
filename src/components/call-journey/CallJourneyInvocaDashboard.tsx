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

  if (industry.includes('health') || industry.includes('medical') || industry.includes('ortho')) {
    return [
      { label: 'Search keyword', value: '"knee pain"' },
      { label: 'Google Click ID', value: '542186921' },
      { label: 'Campaign', value: `${config.industry} - SoCal` },
      { label: 'Web Visitor ID', value: 'X854962' },
      { label: 'Insurance', value: 'United Healthcare' },
      { label: 'Calling Page URL', value: '/scheduling-availability' },
      { label: 'Caller ID', value: '404-464-0231' },
      { label: 'Interest Driver', value: 'Knee replacement' },
      { label: 'Manager Escalation', value: 'False' },
      { label: 'Outcome', value: 'Consultation booked' },
      { label: 'Agent', value: 'Candace Yen' },
      { label: 'Validated patient info', value: 'False' },
      { label: 'Call Quality Score', value: '6.6 / 10.0' },
    ];
  }

  if (industry.includes('internet') || industry.includes('telecom') || industry.includes('cable')) {
    return [
      { label: 'Search keyword', value: '"high speed internet"' },
      { label: 'Google Click ID', value: '542186921' },
      { label: 'Campaign', value: 'Bundle & Save' },
      { label: 'Web Visitor ID', value: 'X854962' },
      { label: 'Serviceable Address', value: 'True' },
      { label: 'Product in Cart', value: 'Internet & TV' },
      { label: 'Calling Page URL', value: '/checkout' },
      { label: 'Caller ID', value: '404-464-0231' },
      { label: 'Interest Driver', value: 'Moving' },
      { label: 'Manager Escalation', value: 'False' },
      { label: 'Outcome', value: 'New service activation' },
      { label: 'Agent', value: 'Candace Yen' },
      { label: 'Mentioned Promotion', value: 'True' },
      { label: 'Call Quality Score', value: '6.6 / 10.0' },
    ];
  }

  if (industry.includes('spa') || industry.includes('massage') || industry.includes('beauty') || industry.includes('salon')) {
    return [
      { label: 'Search keyword', value: `"${industry} near me"` },
      { label: 'Google Click ID', value: '542186921' },
      { label: 'Campaign', value: `${config.industry} — Brand` },
      { label: 'Web Visitor ID', value: 'X854962' },
      { label: 'Calling Page URL', value: '/book-appointment' },
      { label: 'Caller ID', value: '404-464-0231' },
      { label: 'Interest Driver', value: 'First visit' },
      { label: 'Manager Escalation', value: 'False' },
      { label: 'Outcome', value: 'Appointment booked' },
      { label: 'Agent', value: 'Candace Yen' },
      { label: 'Mentioned Promotion', value: 'True' },
      { label: 'Call Quality Score', value: '6.6 / 10.0' },
    ];
  }

  // Default
  return [
    { label: 'Search keyword', value: `"${config.industry} services"` },
    { label: 'Google Click ID', value: '542186921' },
    { label: 'Campaign', value: `${config.industry} — Brand` },
    { label: 'Web Visitor ID', value: 'X854962' },
    { label: 'Calling Page URL', value: '/contact' },
    { label: 'Caller ID', value: '404-464-0231' },
    { label: 'Interest Driver', value: config.industry },
    { label: 'Manager Escalation', value: 'False' },
    { label: 'Outcome', value: 'New customer acquired' },
    { label: 'Agent', value: 'Candace Yen' },
    { label: 'Mentioned Promotion', value: 'True' },
    { label: 'Call Quality Score', value: '7.2 / 10.0' },
  ];
}

export default function CallJourneyInvocaDashboard({ config }: Props) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  const dataPoints = useMemo(() => generateConversationProfile(config), [config]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleRows(v => {
        if (v >= dataPoints.length) {
          clearInterval(interval);
          setTimeout(() => setShowFooter(true), 500);
          return v;
        }
        return v + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [dataPoints.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[420px] mx-auto"
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl bg-white relative">
        {/* Green accent bar top-right */}
        <div className="absolute top-0 right-6 w-8 h-24 bg-[#4caf50]/50 rounded-b-xl z-10" />

        {/* Header */}
        <div className="bg-[#1a3c2a] px-6 pt-6 pb-5 relative">
          {/* Photo + branding */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#2d5a3c] flex-shrink-0 shadow-md">
              <div className="w-full h-full bg-gradient-to-br from-[#6bb87a]/40 to-[#2d5a3c] flex items-center justify-center text-2xl">
                📞
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-bold text-sm tracking-wide uppercase">INVOCA</span>
                <InvocaLogo size="sm" />
              </div>
              <p className="text-white/80 text-xs font-bold tracking-widest uppercase">
                Conversation Profile
              </p>
            </div>
          </div>

          {/* Decorative waveform on left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 -ml-1">
            {[6, 10, 14, 8, 12, 16, 10, 6, 4].map((h, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: h,
                  height: 3,
                  background: i < 4 ? '#e91e63' : i < 6 ? '#ff9800' : '#4caf50',
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* Data rows */}
        <div className="divide-y divide-gray-100">
          {dataPoints.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0 }}
              animate={i < visibleRows ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center px-6 py-3"
            >
              <span className="text-[13px] font-semibold text-gray-800 w-[48%] flex-shrink-0">
                {point.label}
              </span>
              <span className="text-[13px] text-gray-600">{point.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Partner logos footer */}
        {showFooter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-6 py-5 border-t border-gray-100 bg-[#f5f3e8]/60 flex items-center justify-center gap-8"
          >
            <span className="text-[11px] font-bold" style={{ color: '#4285F4' }}>
              G<span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#4285F4' }}>g</span><span style={{ color: '#34A853' }}>l</span><span style={{ color: '#EA4335' }}>e</span>
            </span>
            <span className="text-[11px] font-bold text-red-600">
              <span className="text-red-600">A</span> Adobe
            </span>
            <span className="text-[10px] font-bold text-white bg-[#00A1E0] px-2 py-0.5 rounded">
              salesforce
            </span>
            <span className="text-[11px] font-bold text-orange-500">
              Five9
            </span>
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
