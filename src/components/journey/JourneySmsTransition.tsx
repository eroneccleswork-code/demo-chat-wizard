import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';
import { BusinessConfig } from '@/lib/types';
import InvocaLogo from '../InvocaLogo';

interface Props {
  config: BusinessConfig;
  onStart: () => void;
}

export default function JourneySmsTransition({ config, onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <InvocaLogo size="md" className="mx-auto mb-4" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Invoca SMS Agent Activates</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Within seconds of the form submission, Invoca's AI messaging agent reaches out via SMS — engaging the lead before competitors can.
        </p>
      </motion.div>

      {/* Mock SMS preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-[hsl(220,14%,10%)] rounded-2xl p-4 max-w-xs mx-auto"
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-xs text-white/60">New Message</span>
        </div>
        <div className="bg-[hsl(220,14%,16%)] rounded-xl px-3 py-2 text-left">
          <p className="text-white text-sm leading-relaxed">
            Hi Sarah! I noticed you just submitted a request on our contact form. I'm an AI assistant with {config.companyName} — I'd love to help get you a quote right away. What can I help with?
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium glow-primary transition-all"
      >
        Experience the SMS Demo →
      </motion.button>
    </motion.div>
  );
}
