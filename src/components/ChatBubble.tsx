import { motion } from 'framer-motion';
import { ChatMessage } from '@/lib/types';

interface Props {
  message: ChatMessage;
  showThinking: boolean;
}

export default function ChatBubble({ message, showThinking }: Props) {
  const isAgent = message.role === 'agent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      <div className="max-w-[80%] space-y-1">
        {showThinking && isAgent && message.thinkingSteps && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/30 mb-1"
          >
            {message.thinkingSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-2 text-xs text-muted-foreground font-mono py-0.5"
              >
                <span className="text-primary">→</span>
                {step}
              </motion.div>
            ))}
          </motion.div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
            isAgent
              ? 'bg-sms-agent text-sms-agent-foreground rounded-bl-md'
              : 'bg-sms-user text-sms-user-foreground rounded-br-md'
          }`}
        >
          {message.content}
        </div>
        <div className={`text-[10px] text-muted-foreground px-1 ${isAgent ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
