import { VoiceAgentConfig, CartItem } from './voice-types';

// Built-in scripted agentic flows. Each step yields the agent's line +
// the available caller reply options. The caller chooses, the engine
// branches, and the next step plays.

export interface ReplyOption {
  label: string;
  branch: string;
  intent?: 'buy' | 'decline' | 'transfer' | 'question' | 'continue';
}

export interface FlowStep {
  id: string;
  agent: (cfg: VoiceAgentConfig) => string;
  replies: (cfg: VoiceAgentConfig) => ReplyOption[];
  next?: (branch: string) => string | null;
  terminal?: boolean;
  showsCart?: boolean;
}

const cartTotal = (cart: CartItem[] = []) =>
  cart.reduce((s, i) => s + i.price * i.qty, 0);

const itemList = (cart: CartItem[] = []) =>
  cart.map(i => `${i.qty} ${i.name}`).join(', ');

// ──────────────── Cart Recovery flow ────────────────
const cartFlow: FlowStep[] = [
  {
    id: 'greet',
    agent: (c) => c.greetingLine
      || `Hi ${c.callerName || 'there'}, this is ${c.agentName} from ${c.companyName}. I noticed you left a few items in your cart — would you like to finish that order now, or do you have any questions first?`,
    replies: () => [
      { label: 'Finish the order', branch: 'buy', intent: 'buy' },
      { label: 'I have a question', branch: 'question', intent: 'question' },
      { label: 'Not interested', branch: 'decline', intent: 'decline' },
    ],
    next: (b) => b === 'buy' ? 'review-cart' : b === 'question' ? 'answer-q' : 'soft-decline',
  },
  {
    id: 'answer-q',
    showsCart: true,
    agent: (c) => `Of course. I can see your cart has ${itemList(c.cart)} for a total of $${cartTotal(c.cart).toFixed(2)}. What would you like to know — shipping, returns, or product details?`,
    replies: () => [
      { label: 'Shipping & delivery', branch: 'shipping' },
      { label: 'Return policy', branch: 'returns' },
      { label: 'Sounds good, let\'s buy', branch: 'buy', intent: 'buy' },
    ],
    next: (b) => b === 'buy' ? 'review-cart' : b === 'shipping' ? 'shipping' : 'returns',
  },
  {
    id: 'shipping',
    agent: () => `We ship within 24 hours and most orders arrive in 2–4 business days. Shipping is free on orders over $50. Ready to complete checkout?`,
    replies: () => [
      { label: 'Yes, let\'s do it', branch: 'buy', intent: 'buy' },
      { label: 'Transfer me to a person', branch: 'transfer', intent: 'transfer' },
    ],
    next: (b) => b === 'transfer' ? 'transfer' : 'review-cart',
  },
  {
    id: 'returns',
    agent: () => `Easy — 30-day no-questions-asked returns, prepaid label included. Want me to wrap up the order?`,
    replies: () => [
      { label: 'Yes, complete it', branch: 'buy', intent: 'buy' },
      { label: 'Transfer me to a person', branch: 'transfer', intent: 'transfer' },
    ],
    next: (b) => b === 'transfer' ? 'transfer' : 'review-cart',
  },
  {
    id: 'review-cart',
    showsCart: true,
    agent: (c) => {
      const upsell = c.enableUpsell ? ` Since you're at $${cartTotal(c.cart).toFixed(2)}, would you like to add our extended warranty for $19 — most customers grab it.` : '';
      return `Perfect. I have ${itemList(c.cart)} totaling $${cartTotal(c.cart).toFixed(2)}.${upsell} Shall I charge the card on file?`;
    },
    replies: (c) => c.enableUpsell ? [
      { label: 'Add the warranty', branch: 'upsell-yes', intent: 'buy' },
      { label: 'Skip the warranty', branch: 'upsell-no', intent: 'buy' },
      { label: 'Transfer me to a person', branch: 'transfer', intent: 'transfer' },
    ] : [
      { label: 'Yes, charge it', branch: 'buy', intent: 'buy' },
      { label: 'Transfer me to a person', branch: 'transfer', intent: 'transfer' },
    ],
    next: (b) => b === 'transfer' ? 'transfer' : 'close-sale',
  },
  {
    id: 'close-sale',
    agent: (c) => `Done — confirmation is on its way to your email. Thanks for shopping with ${c.companyName}. Anything else?`,
    replies: () => [
      { label: 'Nope, all good', branch: 'end' },
    ],
    next: () => 'end',
  },
  {
    id: 'soft-decline',
    agent: () => `Totally understand. I'll save your cart for 7 days in case you change your mind. Have a great day!`,
    replies: () => [{ label: 'Hang up', branch: 'end' }],
    next: () => 'end',
  },
  {
    id: 'transfer',
    agent: () => `Absolutely — connecting you to a human agent now. One moment please.`,
    replies: () => [{ label: 'Hold', branch: 'end' }],
    next: () => 'end',
    terminal: true,
  },
  {
    id: 'end',
    agent: () => `Goodbye.`,
    replies: () => [],
    terminal: true,
  },
];

// ──────────────── Service-call flow ────────────────
const serviceFlow: FlowStep[] = [
  {
    id: 'greet',
    agent: (c) => c.greetingLine
      || `Thanks for calling ${c.companyName}, this is ${c.agentName}. How can I help you today?`,
    replies: () => [
      { label: 'I need to book an appointment', branch: 'book' },
      { label: 'I have a question first', branch: 'q' },
      { label: 'Speak to a person', branch: 'transfer', intent: 'transfer' },
    ],
    next: (b) => b === 'book' ? 'qualify' : b === 'q' ? 'qa' : 'transfer',
  },
  {
    id: 'qa',
    agent: (c) => `Of course — I'm trained on everything ${c.companyName} offers. What would you like to know?`,
    replies: () => [
      { label: 'Pricing', branch: 'price' },
      { label: 'Availability', branch: 'avail' },
      { label: 'Book me in', branch: 'book' },
    ],
    next: (b) => b === 'book' ? 'qualify' : 'qualify',
  },
  {
    id: 'qualify',
    agent: () => `Great. What weekday works best — Monday, Tuesday, Wednesday, Thursday or Friday?`,
    replies: () => [
      { label: 'Tuesday', branch: 'tue' },
      { label: 'Wednesday', branch: 'wed' },
      { label: 'Thursday', branch: 'thu' },
    ],
    next: () => 'confirm',
  },
  {
    id: 'confirm',
    agent: (c) => `Perfect, I have you booked. ${c.callerPhone ? `We'll text confirmation to ${c.callerPhone}.` : ''} Anything else?`,
    replies: () => [
      { label: 'That\'s all', branch: 'end' },
      { label: 'Transfer me to a person', branch: 'transfer', intent: 'transfer' },
    ],
    next: (b) => b === 'transfer' ? 'transfer' : 'end',
  },
  {
    id: 'transfer',
    agent: () => `One moment — transferring you to a live representative now.`,
    replies: () => [{ label: 'Hold', branch: 'end' }],
    next: () => 'end',
    terminal: true,
  },
  {
    id: 'end',
    agent: () => `Thanks for calling. Goodbye.`,
    replies: () => [],
    terminal: true,
  },
];

// ──────────────── Custom flow ────────────────
// Parse a simple line-based script. Each line "AGENT: ..." or "CALLER OPTION: ..."
// Falls back to a single greeting + free-form continue.
function buildCustomFlow(cfg: VoiceAgentConfig): FlowStep[] {
  const script = (cfg.customFlow || '').trim();
  if (!script) {
    return [
      {
        id: 'greet',
        agent: (c) => c.greetingLine || `Hi, this is ${c.agentName} from ${c.companyName}. How can I help you?`,
        replies: () => [{ label: 'Continue', branch: 'end' }],
        next: () => 'end',
      },
      {
        id: 'end',
        agent: () => `Thank you, goodbye.`,
        replies: () => [],
        terminal: true,
      },
    ];
  }

  // Group script into steps: each AGENT line starts a step; the OPTION lines until
  // the next AGENT line become its replies. The next AGENT line is the branch target.
  const lines = script.split('\n').map(l => l.trim()).filter(Boolean);
  const steps: FlowStep[] = [];
  let current: { agent: string; options: string[] } | null = null;

  const push = () => {
    if (!current) return;
    const idx = steps.length;
    const nextId = `step-${idx + 1}`;
    const isLast = false; // patched after loop
    steps.push({
      id: `step-${idx}`,
      agent: () => current!.agent,
      replies: () => current!.options.length
        ? current!.options.map((o, i) => ({ label: o, branch: `${nextId}` }))
        : [{ label: 'Continue', branch: nextId }],
      next: () => nextId,
    });
  };

  for (const line of lines) {
    if (/^agent\s*:/i.test(line)) {
      push();
      current = { agent: line.replace(/^agent\s*:\s*/i, ''), options: [] };
    } else if (/^(caller|option)\s*:/i.test(line)) {
      if (current) current.options.push(line.replace(/^(caller|option)\s*:\s*/i, ''));
    } else if (current) {
      current.agent += ' ' + line;
    }
  }
  push();
  // Append terminal
  steps.push({
    id: `step-${steps.length}`,
    agent: () => `Thanks for your time. Goodbye.`,
    replies: () => [],
    terminal: true,
  });
  // Patch last non-terminal to point at terminal
  if (steps.length >= 2) {
    const lastReal = steps[steps.length - 2];
    const terminalId = steps[steps.length - 1].id;
    const origReplies = lastReal.replies;
    lastReal.replies = (c) => origReplies(c).map(r => ({ ...r, branch: terminalId }));
    lastReal.next = () => terminalId;
  }
  return steps;
}

export function getFlow(cfg: VoiceAgentConfig): FlowStep[] {
  if (cfg.scenarioType === 'cart-recovery') return cartFlow;
  if (cfg.scenarioType === 'service-call') return serviceFlow;
  return buildCustomFlow(cfg);
}

export function findStep(flow: FlowStep[], id: string): FlowStep | undefined {
  return flow.find(s => s.id === id);
}
