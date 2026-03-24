import { motion } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';
import invocaIntegrations from '@/assets/invoca-integrations.png';

interface Props {
  config: BusinessConfig;
}

export default function JourneyIntegrations({ config }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-foreground text-center"
      >
        Where {config.companyName}'s data flows with Invoca
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full rounded-xl overflow-hidden shadow-lg border border-border bg-white"
      >
        <img
          src={invocaIntegrations}
          alt="Invoca Integration Diagram — Power Better Digital Marketing & Sales Performance"
          className="w-full h-auto"
        />
      </motion.div>
    </motion.div>
  );
}
