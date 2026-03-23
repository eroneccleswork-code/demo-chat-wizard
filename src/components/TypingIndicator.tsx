import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="bg-sms-agent rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sms-agent-foreground/60 typing-dot" />
        <span className="w-2 h-2 rounded-full bg-sms-agent-foreground/60 typing-dot" />
        <span className="w-2 h-2 rounded-full bg-sms-agent-foreground/60 typing-dot" />
      </div>
    </motion.div>
  );
}
