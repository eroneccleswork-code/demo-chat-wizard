import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessConfig } from '@/lib/types';
import { MessageSquare, X } from 'lucide-react';

interface Props {
  config: BusinessConfig;
}

interface IntegrationCategory {
  id: string;
  number: number;
  title: string;
  description: string;
  highlight: string;
  logos: string[];
  color: string;
  side: 'left' | 'right';
}

const CATEGORIES: IntegrationCategory[] = [
  {
    id: 'search',
    number: 1,
    title: 'Search & Digital Advertising',
    description: 'Attribute phone conversions from search, social, display & video ads to',
    highlight: 'improve performance, bid optimizations & ad targeting',
    logos: ['Google Ads', 'SA360', 'Microsoft', 'Meta', 'Instagram', 'TikTok', 'The Trade Desk', 'YouTube'],
    color: 'hsl(153, 60%, 40%)',
    side: 'left',
  },
  {
    id: 'analytics',
    number: 2,
    title: 'Marketing Analytics',
    description: 'Measure digital marketing performance &',
    highlight: 'make better strategic decisions with unified online & offline data',
    logos: ['Google Analytics', 'Adobe Analytics', 'Tableau', 'Looker', 'Domo'],
    color: 'hsl(153, 55%, 35%)',
    side: 'left',
  },
  {
    id: 'crm',
    number: 3,
    title: 'CRM',
    description: 'Connect phone leads to CRM records &',
    highlight: 'pass call disposition, opp stage & revenue from CRM to Invoca to fuel better optimizations',
    logos: ['Salesforce', 'HubSpot', 'Marketo'],
    color: 'hsl(153, 50%, 20%)',
    side: 'left',
  },
  {
    id: 'cdp',
    number: 4,
    title: 'CDP',
    description: 'Enrich customer profile data with phone conversion & caller data to',
    highlight: 'get more accurate customer profiles for better targeting',
    logos: ['Adobe', 'Segment', 'Tealium'],
    color: 'hsl(153, 60%, 40%)',
    side: 'right',
  },
  {
    id: 'digital',
    number: 5,
    title: 'Digital Experience',
    description: 'Improve ecommerce, online conversions & A/B testing with data on',
    highlight: 'when, where & why website visitors call',
    logos: ['Optimizely', 'Adobe Target', 'Contentsquare', 'FullStory'],
    color: 'hsl(153, 55%, 35%)',
    side: 'right',
  },
  {
    id: 'contact-center',
    number: 6,
    title: 'Contact Center',
    description: 'Enhanced call routing & present digital buyer journey data to agents at time of call to create',
    highlight: 'better call experiences and outcomes',
    logos: ['Five9', 'AWS', 'NICE', 'Genesys'],
    color: 'hsl(153, 50%, 20%)',
    side: 'right',
  },
];

function DataParticle({ delay, side }: { delay: number; side: 'left' | 'right' }) {
  const startX = side === 'left' ? -20 : 20;
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ background: 'hsl(153, 60%, 45%)' }}
      initial={{ opacity: 0, x: startX, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [startX, 0],
        scale: [0, 1, 1, 0.5],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
      }}
    />
  );
}

function CategoryCard({
  cat,
  index,
  isActive,
  onClick,
  isFlowing,
}: {
  cat: IntegrationCategory;
  index: number;
  isActive: boolean;
  onClick: () => void;
  isFlowing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: cat.side === 'left' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Glow effect when flowing */}
      {isFlowing && (
        <motion.div
          className="absolute -inset-1 rounded-xl opacity-30"
          style={{ background: cat.color }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div
        className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 ${
          isActive
            ? 'border-[hsl(153,60%,40%)] shadow-lg shadow-[hsl(153,60%,40%)]/20 scale-[1.02]'
            : 'border-[hsl(153,30%,80%)] hover:border-[hsl(153,40%,60%)] hover:shadow-md'
        }`}
        style={{ background: 'hsl(150, 20%, 97%)' }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 text-white text-sm font-bold"
          style={{ background: cat.color }}
        >
          {cat.number}. {cat.title}
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            {cat.description}{' '}
            <span className="font-bold text-gray-900">{cat.highlight}</span>
          </p>

          {/* Logo dots */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cat.logos.map((logo, i) => (
              <motion.div
                key={logo}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.15 + i * 0.05 }}
                className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 shadow-sm"
                title={logo}
              >
                {logo.charAt(0)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data flow indicator */}
        {isFlowing && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'hsl(153, 70%, 50%)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
}

function DetailPanel({
  cat,
  companyName,
  onClose,
}: {
  cat: IntegrationCategory;
  companyName: string;
  onClose: () => void;
}) {
  const dataPoints = getDataPoints(cat.id, companyName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="absolute inset-0 z-30 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className="inline-block px-3 py-1 rounded-md text-white text-xs font-bold mb-4"
          style={{ background: cat.color }}
        >
          {cat.number}. {cat.title}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          How {companyName}'s data flows here
        </h3>

        <div className="space-y-3 mt-4">
          {dataPoints.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <motion.div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: 'hsl(153, 60%, 45%)' }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
              />
              <div>
                <p className="text-xs font-semibold text-gray-800">{point.label}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{point.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function getDataPoints(categoryId: string, companyName: string) {
  const map: Record<string, { label: string; detail: string }[]> = {
    search: [
      { label: 'Call Conversion Tracking', detail: `Every call from ${companyName}'s ads is attributed to the exact keyword, campaign & ad group` },
      { label: 'Bid Optimization', detail: 'Smart bidding receives real conversion signals, not just form fills' },
      { label: 'Audience Targeting', detail: 'Callers are synced back to ad platforms as high-intent audiences' },
    ],
    analytics: [
      { label: 'Unified Attribution', detail: 'Phone calls + online conversions in a single view' },
      { label: 'Revenue Reporting', detail: `${companyName}'s phone revenue appears alongside digital revenue` },
      { label: 'Channel Performance', detail: 'Compare call-driven vs. online-only campaign ROI' },
    ],
    crm: [
      { label: 'Lead Sync', detail: `Callers automatically create/update leads in ${companyName}'s CRM` },
      { label: 'Call Disposition', detail: 'Outcome data (booked, quoted, lost) flows back to Invoca' },
      { label: 'Revenue Attribution', detail: 'Closed deals traced back to the original ad click' },
    ],
    cdp: [
      { label: 'Profile Enrichment', detail: 'Call intent, conversation topics & outcomes enrich customer profiles' },
      { label: 'Segment Creation', detail: `Build audiences from ${companyName}'s callers for personalized targeting` },
      { label: 'Cross-Channel Identity', detail: 'Match phone callers to their digital identities' },
    ],
    digital: [
      { label: 'Call-Driven Optimization', detail: `A/B test ${companyName}'s pages based on which versions drive calls` },
      { label: 'Heatmap Integration', detail: 'See where callers clicked before picking up the phone' },
      { label: 'Conversion Rate Impact', detail: 'Measure how calls affect overall conversion rates' },
    ],
    'contact-center': [
      { label: 'Smart Routing', detail: `Route ${companyName}'s callers to the right agent based on ad context` },
      { label: 'Screen Pop', detail: "Agents see the caller's digital journey before answering" },
      { label: 'Call Scoring', detail: 'AI scores every call for quality, conversion & compliance' },
    ],
  };
  return map[categoryId] || [];
}

export default function JourneyIntegrations({ config }: Props) {
  const [flowingCategories, setFlowingCategories] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allFlowing, setAllFlowing] = useState(false);

  // Sequentially start data flowing into each category
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CATEGORIES.forEach((cat, i) => {
      timers.push(
        setTimeout(() => {
          setFlowingCategories((prev) => new Set([...prev, cat.id]));
        }, 1200 + i * 400)
      );
    });
    timers.push(
      setTimeout(() => setAllFlowing(true), 1200 + CATEGORIES.length * 400 + 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const leftCats = CATEGORIES.filter((c) => c.side === 'left');
  const rightCats = CATEGORIES.filter((c) => c.side === 'right');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-muted-foreground mb-4"
      >
        Where {config.companyName}'s data flows with Invoca
      </motion.h2>

      {/* Main diagram container */}
      <div
        className="relative w-full rounded-2xl border border-[hsl(153,20%,85%)] overflow-hidden"
        style={{ background: 'hsl(60, 30%, 96%)' }}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-2xl font-black text-gray-900 pt-6 pb-4"
        >
          Power Better Digital Marketing & Sales Performance
        </motion.h1>

        {/* Grid layout */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 px-6 pb-6 items-center">
          {/* Left column */}
          <div className="space-y-3">
            {leftCats.map((cat, i) => (
              <div key={cat.id} className="relative">
                <CategoryCard
                  cat={cat}
                  index={i}
                  isActive={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  isFlowing={flowingCategories.has(cat.id)}
                />
                {/* Flow line to center */}
                {flowingCategories.has(cat.id) && (
                  <motion.div
                    className="absolute top-1/2 -right-4 w-4 h-0.5"
                    style={{ background: 'hsl(153, 50%, 60%)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Center — Invoca hub */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Pulsing rings */}
              {allFlowing && (
                <>
                  <motion.div
                    className="absolute -inset-4 rounded-2xl border-2 border-dashed"
                    style={{ borderColor: 'hsl(153, 40%, 70%)' }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -inset-8 rounded-3xl border border-dashed"
                    style={{ borderColor: 'hsl(153, 30%, 80%)' }}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}

              <div
                className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-lg relative z-10"
                style={{
                  background: 'white',
                  borderColor: 'hsl(153, 40%, 50%)',
                }}
              >
                <MessageSquare
                  className="w-12 h-12"
                  style={{ color: 'hsl(153, 50%, 40%)' }}
                  fill="hsl(153, 50%, 40%)"
                />
              </div>

              {/* Floating data particles */}
              {allFlowing &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + (i % 3) * 30}%`,
                      [i < 3 ? 'left' : 'right']: '-20px',
                    }}
                  >
                    <DataParticle delay={i * 0.4} side={i < 3 ? 'left' : 'right'} />
                  </div>
                ))}
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            {rightCats.map((cat, i) => (
              <div key={cat.id} className="relative">
                <CategoryCard
                  cat={cat}
                  index={i + 3}
                  isActive={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  isFlowing={flowingCategories.has(cat.id)}
                />
                {/* Flow line from center */}
                {flowingCategories.has(cat.id) && (
                  <motion.div
                    className="absolute top-1/2 -left-4 w-4 h-0.5"
                    style={{ background: 'hsl(153, 50%, 60%)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Click hint */}
        <AnimatePresence>
          {!activeCategory && allFlowing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-gray-400 pb-4"
            >
              Click any integration to explore the data flow →
            </motion.p>
          )}
        </AnimatePresence>

        {/* Detail overlay */}
        <AnimatePresence>
          {activeCategory && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20"
                onClick={() => setActiveCategory(null)}
              />
              <DetailPanel
                cat={CATEGORIES.find((c) => c.id === activeCategory)!}
                companyName={config.companyName}
                onClose={() => setActiveCategory(null)}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
