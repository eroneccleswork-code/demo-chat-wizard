import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Phone, TrendingUp, DollarSign, Users } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';

interface Props {
  config: BusinessConfig;
  onStartDemo: () => void;
}

const DATA_POINTS = [
  { icon: Clock, label: 'Avg. Response Time (Without Invoca)', value: '24–48 hrs', color: 'text-destructive' },
  { icon: TrendingUp, label: 'Lead Drop-off During Wait', value: '67%', color: 'text-destructive' },
  { icon: Users, label: 'Customers Who Go to Competitor', value: '78%', color: 'text-destructive' },
  { icon: DollarSign, label: 'Revenue Lost Per Month (est.)', value: '$12,400+', color: 'text-destructive' },
  { icon: Phone, label: 'Invoca SMS Response Time', value: '< 30 sec', color: 'text-primary' },
];

export default function JourneyWaiting({ config, onStartDemo }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [visibleStats, setVisibleStats] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 200);
    return () => clearInterval(interval);
  }, []);

  // Show stats after danger zone appears
  useEffect(() => {
    if (elapsed < 12) return;
    const interval = setInterval(() => {
      setVisibleStats(v => {
        if (v >= DATA_POINTS.length) {
          clearInterval(interval);
          setTimeout(() => setShowCta(true), 600);
          return v;
        }
        return v + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [elapsed >= 12]);

  const minutes = Math.min(elapsed, 30);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg text-center space-y-5"
    >
      {/* Email confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 text-left"
      >
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px]">📧</div>
          noreply@{config.websiteUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'company.com'}
        </div>
        <p className="text-sm text-gray-700 font-medium mb-1">Thank you for your inquiry!</p>
        <p className="text-xs text-gray-500">
          We've received your request. A team member will be in touch within 24-48 hours.
        </p>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span className="text-3xl font-mono font-bold text-foreground">{minutes}+ min</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Customer is waiting… no response yet.
        </p>
      </motion.div>

      {/* Danger zone */}
      {elapsed > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-semibold">High risk of losing this lead</span>
          </div>
          <p className="text-xs text-muted-foreground">
            78% of customers buy from the first company to respond. This lead is searching competitors right now.
          </p>
        </motion.div>
      )}

      {/* Data points */}
      {visibleStats > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-surface rounded-xl p-4 space-y-2 text-left"
        >
          {DATA_POINTS.map((point, i) => (
            i < visibleStats && (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <point.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{point.label}</span>
                </div>
                <span className={`text-sm font-semibold ${point.color}`}>{point.value}</span>
              </motion.div>
            )
          ))}
        </motion.div>
      )}

      {/* CTA — starts demo directly */}
      {showCta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pt-1"
        >
          <button
            onClick={onStartDemo}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm glow-primary transition-all hover:scale-[1.02]"
          >
            Enter Invoca SMS Agent →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
