import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Phone, DollarSign, Target, Zap } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';
import InvocaLogo from '../InvocaLogo';

interface Props {
  config: BusinessConfig;
}

const METRICS = [
  { icon: Phone, label: 'Calls This Month', value: '1,247', change: '+18%' },
  { icon: DollarSign, label: 'Revenue Attributed', value: '$384,200', change: '+24%' },
  { icon: Target, label: 'Conversion Rate', value: '34.2%', change: '+5.1%' },
  { icon: TrendingUp, label: 'Cost Per Acquisition', value: '$42.50', change: '-12%' },
];

const CALL_LOG = [
  { name: 'Sarah Johnson', duration: '4:32', outcome: 'Converted', campaign: 'Google — Brand' },
  { name: 'Mike Davis', duration: '2:15', outcome: 'Follow-up', campaign: 'Google — Non-Brand' },
  { name: 'Lisa Chen', duration: '6:08', outcome: 'Converted', campaign: 'Bing — Search' },
  { name: 'James Wilson', duration: '1:45', outcome: 'No Sale', campaign: 'Facebook — Retarget' },
];

export default function CallJourneyInvocaDashboard({ config }: Props) {
  const [visibleMetrics, setVisibleMetrics] = useState(0);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMetrics(v => {
        if (v >= METRICS.length) {
          clearInterval(interval);
          setTimeout(() => setShowLog(true), 500);
          return v;
        }
        return v + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InvocaLogo size="sm" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Invoca for Marketing</h2>
            <p className="text-xs text-muted-foreground">{config.companyName} — Call Analytics Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Real-time</span>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={i < visibleMetrics ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="glass-surface rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <metric.icon className="w-4 h-4" />
              <span className="text-xs">{metric.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{metric.value}</p>
            <span className={`text-xs font-medium ${
              metric.change.startsWith('+') ? 'text-green-600' : 'text-primary'
            }`}>
              {metric.change} vs last month
            </span>
          </motion.div>
        ))}
      </div>

      {/* Call attribution log */}
      {showLog && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface rounded-xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Recent Call Attribution</span>
          </div>
          <div className="divide-y divide-border/50">
            {CALL_LOG.map((call, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="px-4 py-3 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                    {call.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{call.name}</p>
                    <p className="text-xs text-muted-foreground">{call.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{call.duration}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    call.outcome === 'Converted'
                      ? 'bg-green-100 text-green-700'
                      : call.outcome === 'Follow-up'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {call.outcome}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-center text-xs text-muted-foreground"
      >
        Invoca attributes every call to the marketing source — giving full visibility into what's driving revenue.
      </motion.p>
    </motion.div>
  );
}
