import { motion } from 'framer-motion';
import { Zap, Clock, Eye, EyeOff, Flame, Meh, HelpCircle } from 'lucide-react';
import { SpeedMode, DemoScenario } from '@/lib/types';

interface Props {
  speedMode: SpeedMode;
  onSpeedChange: (mode: SpeedMode) => void;
  showThinking: boolean;
  onThinkingToggle: () => void;
  onScenario: (scenario: DemoScenario) => void;
  disabled: boolean;
}

export default function DemoControls({ speedMode, onSpeedChange, showThinking, onThinkingToggle, onScenario, disabled }: Props) {
  return (
    <div className="space-y-3">
      {/* Speed + Thinking toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSpeedChange(speedMode === 'realistic' ? 'instant' : 'realistic')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
        >
          {speedMode === 'realistic' ? <Clock className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
          {speedMode === 'realistic' ? 'Realistic' : 'Instant'}
        </button>
        <button
          onClick={onThinkingToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
        >
          {showThinking ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          AI Thinking
        </button>
      </div>

      {/* Scenario buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Simulate:</span>
        {([
          { id: 'high-intent' as DemoScenario, label: 'Hot Lead', icon: Flame },
          { id: 'low-intent' as DemoScenario, label: 'Cold Lead', icon: Meh },
          { id: 'confused' as DemoScenario, label: 'Confused', icon: HelpCircle },
        ]).map(s => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScenario(s.id)}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-40"
          >
            <s.icon className="w-3 h-3" />
            {s.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
