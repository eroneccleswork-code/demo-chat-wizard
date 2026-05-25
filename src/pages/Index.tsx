import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import InvocaLogo from '@/components/InvocaLogo';
import heroImage from '@/assets/hero-blinds.jpg';

const USE_CASES = [
  { label: 'AI Messaging Agent | Lead Form Response', active: true, path: '/setup' },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Decorative corner brackets */}
      <div className="absolute top-[10%] left-[35%] w-24 h-24 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-[5%] right-[15%] w-32 h-32 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-[20%] right-[25%] w-20 h-20 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

      {/* Logo top-left */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InvocaLogo size="md" />
      </motion.div>

      {/* Main content */}
      <div className="mt-12 md:mt-20 flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        {/* Left side */}
        <div className="flex-1 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05] mb-10"
          >
            Agentic<br />Solutions
          </motion.h1>

          <div className="space-y-3">
            {USE_CASES.map((uc, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                onClick={() => uc.active && uc.path && navigate(uc.path)}
                disabled={!uc.active}
                className={`w-full flex items-center justify-between px-6 py-4 border border-foreground/20 rounded-sm text-left transition-all ${
                  uc.active
                    ? 'hover:bg-foreground/5 hover:border-foreground/40 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-sm md:text-base font-medium text-foreground">{uc.label}</span>
                {uc.active && <ArrowRight className="w-4 h-4 text-foreground/50" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right side — hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 max-w-xl relative"
        >
          {/* Decorative bracket behind image */}
          <div className="absolute -top-4 -right-4 w-full h-full border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
          <img
            src={heroImage}
            alt="Window blinds"
            className="w-full h-auto rounded-lg shadow-xl relative z-10 object-cover aspect-[4/3]"
            width={800}
            height={1024}
          />
        </motion.div>
      </div>
    </div>
  );
}
