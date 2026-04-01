import { BusinessConfig, WebsiteInsights, AgentPersona, ChatMessage, DemoScenario } from './types';

export function analyzeWebsite(config: BusinessConfig): WebsiteInsights {
  const industryMap: Record<string, WebsiteInsights> = {
    'Window Cleaning': {
      description: `${config.companyName} provides professional window cleaning services for residential and commercial properties.`,
      services: ['Residential window cleaning', 'Commercial building cleaning', 'Gutter cleaning', 'Pressure washing'],
      targetCustomer: 'Homeowners and property managers',
      tone: 'Friendly and professional',
    },
    'Dental': {
      description: `${config.companyName} is a modern dental practice offering comprehensive oral care.`,
      services: ['General dentistry', 'Cosmetic dentistry', 'Teeth whitening', 'Invisalign'],
      targetCustomer: 'Families and individuals seeking dental care',
      tone: 'Warm, reassuring, professional',
    },
    'Real Estate': {
      description: `${config.companyName} helps clients buy, sell, and invest in properties.`,
      services: ['Home buying', 'Home selling', 'Property valuation', 'Investment consulting'],
      targetCustomer: 'Home buyers, sellers, and investors',
      tone: 'Confident, knowledgeable, approachable',
    },
    'HVAC': {
      description: `${config.companyName} provides heating, ventilation, and air conditioning services.`,
      services: ['AC repair', 'Furnace installation', 'Duct cleaning', 'Maintenance plans'],
      targetCustomer: 'Homeowners and businesses needing climate control',
      tone: 'Helpful, straightforward, reliable',
    },
    'Legal': {
      description: `${config.companyName} is a law firm providing expert legal counsel.`,
      services: ['Personal injury', 'Business law', 'Estate planning', 'Family law'],
      targetCustomer: 'Individuals and businesses needing legal representation',
      tone: 'Professional, empathetic, authoritative',
    },
    'Blinds': {
      description: `${config.companyName} provides custom window blinds and shades.`,
      services: ['Wood blinds', 'Faux wood blinds', 'Roller shades', 'Shutters'],
      targetCustomer: 'Homeowners looking for window treatments',
      tone: 'Friendly, knowledgeable, sales-oriented',
    },
  };

  const defaultInsights: WebsiteInsights = {
    description: `${config.companyName} is a ${config.industry.toLowerCase()} company delivering expert services.`,
    services: ['Core services', 'Consulting', 'Custom solutions', 'Support'],
    targetCustomer: 'Businesses and individuals',
    tone: 'Professional and approachable',
  };

  return industryMap[config.industry] || defaultInsights;
}

export function generatePersona(config: BusinessConfig, insights: WebsiteInsights): AgentPersona {
  return {
    name: config.companyName,
    style: insights.tone,
    qualificationQuestions: [],
    closingLines: [],
  };
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Sentiment & Intent Detection ───

type UserSentiment = 'positive' | 'negative' | 'confused' | 'neutral' | 'off-topic';

function detectSentiment(msg: string): UserSentiment {
  const lower = msg.toLowerCase().trim();

  const positivePatterns = /^(yes|yeah|yep|sure|ok|okay|absolutely|definitely|sounds good|let'?s do it|go ahead|please|yea|of course|for sure|i'?d like|i want|i need|sign me up|let'?s go|ready)/;
  const negativePatterns = /^(no|nah|not really|i'?m good|no thanks|not interested|maybe later|pass|never mind|stop|quit|cancel)/;
  const confusedPatterns = /(what|huh|i don'?t understand|what do you mean|confused|not sure what|how is that|why|that doesn'?t make sense|irrelevant|i'?m lost|\?$)/i;

  if (positivePatterns.test(lower)) return 'positive';
  if (negativePatterns.test(lower)) return 'negative';
  if (confusedPatterns.test(lower)) return 'confused';

  // Check if the response seems completely off-topic (very short non-answers)
  if (lower.length < 3 && !/\d/.test(lower)) return 'confused';

  return 'neutral';
}

function extractKeyInfo(msg: string): Record<string, string> {
  const info: Record<string, string> = {};
  const lower = msg.toLowerCase();

  // ZIP code
  const zip = msg.match(/\b\d{5}\b/);
  if (zip) info.zipCode = zip[0];

  // Numbers (quantity, count, etc.)
  const numbers = msg.match(/\b(\d+)\b/);
  if (numbers) info.quantity = numbers[1];

  // Timeframes
  if (/asap|urgent|emergency|right away|immediately|today/i.test(lower)) info.urgency = 'high';
  else if (/this week|soon|next few days/i.test(lower)) info.urgency = 'medium';
  else if (/no rush|whenever|flexible|next month|later/i.test(lower)) info.urgency = 'low';

  // Size / scope
  if (/large|big|huge|many|lot|extensive/i.test(lower)) info.scope = 'large';
  else if (/small|few|couple|one|single|just/i.test(lower)) info.scope = 'small';
  else if (/medium|moderate|average|standard/i.test(lower)) info.scope = 'medium';

  return info;
}

// ─── Contextual Acknowledgments ───

function getAcknowledgment(sentiment: UserSentiment, userMsg: string, questionContext: string): string {
  const info = extractKeyInfo(userMsg);

  if (sentiment === 'negative') {
    const negativeResponses = [
      "I completely understand. No pressure at all.",
      "Totally fair — I appreciate you letting me know.",
      "No worries at all. If you change your mind, we're here.",
    ];
    return negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
  }

  if (sentiment === 'confused') {
    return `Great question — let me clarify. ${getContextualClarification(questionContext, userMsg)}`;
  }

  // Contextual positive/neutral acknowledgments
  if (info.urgency === 'high') {
    return "Understood — sounds like this is time-sensitive. Let me make sure we move quickly for you.";
  }
  if (info.quantity) {
    return `Got it, ${info.quantity}. That helps me get a better picture.`;
  }
  if (info.zipCode) {
    return `Thanks — let me check availability in the ${info.zipCode} area.`;
  }

  const genericAcks = [
    "Got it, thanks for sharing that.",
    "That's helpful, thank you.",
    "Understood, I appreciate the details.",
    "Great, that gives me a clearer picture.",
    "Thanks for that info.",
  ];
  return genericAcks[Math.floor(Math.random() * genericAcks.length)];
}

function getContextualClarification(questionContext: string, userMsg: string): string {
  const lower = questionContext.toLowerCase();
  
  if (lower.includes('scope') || lower.includes('how large')) {
    return "I'm trying to understand the size of the project so I can give you the most accurate estimate. Could you describe what you're looking for in a bit more detail?";
  }
  if (lower.includes('timeline') || lower.includes('when')) {
    return "I'm asking about timing so we can prioritize and get you scheduled at the right time. Are you looking at the next few days, weeks, or is this more flexible?";
  }
  if (lower.includes('budget') || lower.includes('price')) {
    return "Knowing your budget range helps me recommend the right options. Even a rough range is helpful — or I can share our typical pricing if that's easier.";
  }
  if (lower.includes('zip') || lower.includes('area') || lower.includes('location')) {
    return "I need your general area to confirm we can service your location and connect you with the right team. A ZIP code works great, or just the city name.";
  }

  return "I want to make sure I'm giving you the best information. Could you tell me a bit more about what you're looking for?";
}

// ─── Conversation Flow with Context ───

interface QualificationStep {
  question: string;
  topic: string; // what this question is about — used for contextual responses
  skipIf?: (answers: string[], info: Record<string, string>[]) => boolean;
}

function getQualificationSteps(config: BusinessConfig): QualificationStep[] {
  // If custom questions are provided, use those instead of industry defaults
  if (config.customQuestions && config.customQuestions.filter(q => q.trim()).length > 0) {
    return config.customQuestions
      .filter(q => q.trim())
      .slice(0, 5)
      .map((q, i) => ({ question: q, topic: `custom-${i}` }));
  }

  const name = capitalizeWords(config.companyName);
  const industry = config.industry;

  const industrySteps: Record<string, QualificationStep[]> = {
    'Window Cleaning': [
      { question: "How many windows are you looking to have cleaned?", topic: 'quantity' },
      { question: "Are these standard-size windows, or do you have any large or specialty windows?", topic: 'type' },
      { question: "Is this a single-story or multi-story home?", topic: 'property' },
      { question: "Would you like interior and exterior, or just exterior?", topic: 'scope' },
      { question: "When are you hoping to get this done?", topic: 'timeline' },
      { question: "Can you share your ZIP code so I can confirm service availability?", topic: 'location' },
    ],
    'Dental': [
      { question: "Is this for a routine checkup, or is there something specific you'd like addressed?", topic: 'need' },
      { question: "When was your last dental visit?", topic: 'history' },
      { question: "Are you currently experiencing any pain or discomfort?", topic: 'urgency' },
      { question: "Do you have dental insurance, or would you like info on our self-pay options?", topic: 'insurance' },
      { question: "Can you share your ZIP code so I can confirm the closest location?", topic: 'location' },
    ],
    'Real Estate': [
      { question: "Are you looking to buy, sell, or both?", topic: 'intent' },
      { question: "What area or neighborhood are you most interested in?", topic: 'location' },
      { question: "Do you have a budget range in mind?", topic: 'budget' },
      { question: "What's your timeline looking like?", topic: 'timeline' },
      { question: "Have you been pre-approved for a mortgage, or would you like help with that?", topic: 'financing' },
      { question: "Can you share your ZIP code so I can match you with a local agent?", topic: 'location' },
    ],
    'HVAC': [
      { question: "Is this for heating, cooling, or both?", topic: 'need' },
      { question: "How old is your current system?", topic: 'system' },
      { question: "What's the approximate square footage of your home?", topic: 'scope' },
      { question: "Is this an urgent repair, or are you looking at maintenance or a new installation?", topic: 'urgency' },
      { question: "When are you hoping to move forward with this?", topic: 'timeline' },
      { question: "Can you share your ZIP code so I can confirm service availability?", topic: 'location' },
    ],
    'Legal': [
      { question: "What type of legal matter is this regarding?", topic: 'need' },
      { question: "Has anything been filed yet, or is this a new matter?", topic: 'status' },
      { question: "What's the timeline we're working with?", topic: 'timeline' },
      { question: "Have you spoken with another attorney about this?", topic: 'history' },
      { question: "Can you share your ZIP code so I can confirm jurisdiction?", topic: 'location' },
    ],
    'Blinds': [
      { question: "How many windows are you looking to cover with blinds?", topic: 'quantity' },
      { question: "What are the approximate measurements of each window?", topic: 'size' },
      { question: "What material are you considering for the blinds?", topic: 'type' },
      { question: "When are you hoping to move forward with this project?", topic: 'timeline' },
      { question: "Can you share your ZIP code so I can confirm service availability?", topic: 'location' },
    ],
  };

  const defaultSteps: QualificationStep[] = [
    { question: "What specifically are you looking for help with?", topic: 'need' },
    { question: "What's your timeline for this?", topic: 'timeline' },
    { question: "Do you have a budget range in mind?", topic: 'budget' },
    { question: "Can you share your ZIP code so I can confirm availability?", topic: 'location' },
  ];

  return industrySteps[industry] || defaultSteps;
}

function getIntroMessage(config: BusinessConfig): string {
  const name = capitalizeWords(config.companyName);

  if (config.presencePage) {
    return `Hi! I noticed you were checking out our ${config.presencePage} page. I'm an AI agent with ${name} — can I help answer any questions or get you set up?`;
  }

  const intros: Record<string, string> = {
    'Window Cleaning': `Thanks for contacting ${name}. I'm an AI agent here to help with your personalized quote. Would you like to get started?`,
    'Dental': `Thanks for contacting ${name}. I'm an AI agent here to help you schedule your appointment. Would you like to get started?`,
    'Real Estate': `Thanks for contacting ${name}. I'm an AI agent here to help you with your real estate needs. Would you like to get started?`,
    'HVAC': `Thanks for contacting ${name}. I'm an AI agent here to help with your heating and cooling needs. Would you like to get started?`,
    'Legal': `Thanks for contacting ${name}. I'm an AI agent here to help connect you with the right attorney. Would you like to get started?`,
    'Blinds': `Thanks for contacting ${name}. I'm an AI agent here to help with your personalized quote. Schedule a consultation today to save 10% on wood blinds. Would you like to get started?`,
  };

  return intros[config.industry] || `Thanks for contacting ${name}. I'm an AI agent here to help you. Would you like to get started?`;
}

// ─── Estimate & Closing (contextual) ───

function generateEstimateResponse(config: BusinessConfig, answers: string[], extractedInfo: Record<string, string>[]): string {
  const name = capitalizeWords(config.companyName);
  const allInfo = Object.assign({}, ...extractedInfo);
  const hasZip = !!allInfo.zipCode;
  const areaPhrase = hasZip ? `the ${allInfo.zipCode} area` : 'your area';

  const templates: Record<string, () => string> = {
    'Window Cleaning': () => {
      const qty = allInfo.quantity || 'your windows';
      return `Good news — we do service ${areaPhrase}. Based on ${qty === 'your windows' ? 'what you\'ve described' : `the ${qty} windows you mentioned`}, a preliminary estimate is between $150 and $300. For an exact quote, I'd recommend a quick virtual consultation with one of our specialists. Would you like to schedule one?`;
    },
    'Dental': () => `Great news — we have availability at a location near you${hasZip ? ` in ${areaPhrase}` : ''}. Based on what you've described, we can get you in quickly. Would you like to schedule an appointment?`,
    'Real Estate': () => `We have experienced agents${hasZip ? ` in ${areaPhrase}` : ''} who can help. I'd love to connect you with one for a personalized consultation. Would you like to schedule a call?`,
    'HVAC': () => {
      const urgencyNote = allInfo.urgency === 'high' ? ' Given the urgency, we can prioritize your visit.' : '';
      return `Good news — we do service ${areaPhrase}.${urgencyNote} Based on what you've shared, we can have a technician assess your system and provide options. Would you like to schedule a visit?`;
    },
    'Legal': () => `We have attorneys experienced in that area of law. I'd like to set up a free initial consultation so we can discuss your case in detail. Would you like to schedule one?`,
    'Blinds': () => {
      const qty = allInfo.quantity || 'your';
      return `Good news — we do service ${areaPhrase}. Based on ${qty === 'your' ? 'what you\'ve shared' : `the ${qty} windows you mentioned`}, a preliminary estimate for blinds with installation is between $800 and $1,000. For an exact quote, I'd recommend a virtual consultation. Would you like to schedule one?`;
    },
  };

  const defaultTemplate = () => `Good news — we service ${areaPhrase}. Based on what you've shared, I'd love to connect you with our team for a personalized quote. Would you like to schedule a consultation?`;

  return (templates[config.industry] || defaultTemplate)();
}

function generateAppointmentOffer(): string {
  const now = new Date();
  const daysAhead = 2 + Math.floor(Math.random() * 5);
  const apptDate = new Date(now);
  apptDate.setDate(apptDate.getDate() + daysAhead);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[apptDate.getDay()];
  const monthName = months[apptDate.getMonth()];
  const dateNum = apptDate.getDate();
  const hours = [10, 11, 12, 1, 2, 3];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const ampm = hour >= 10 && hour <= 11 ? 'AM' : 'PM';

  return `I have availability on ${dayName}, ${monthName} ${dateNum} at ${hour}:00 ${ampm} Pacific Time. Would you like me to lock that in?`;
}

function generateConfirmation(config: BusinessConfig): string {
  const now = new Date();
  const daysAhead = 2 + Math.floor(Math.random() * 5);
  const apptDate = new Date(now);
  apptDate.setDate(apptDate.getDate() + daysAhead);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[apptDate.getDay()];
  const monthName = months[apptDate.getMonth()];
  const dateNum = apptDate.getDate();
  const hours = [10, 11, 12, 1, 2, 3];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  const ampm = hour >= 10 && hour <= 11 ? 'AM' : 'PM';
  const phoneNum = '805-888-2424';

  return `Great. Your virtual consultation is confirmed for ${dayName}, ${monthName} ${dateNum} at ${hour}:00 ${ampm} Pacific Time. You'll receive a text message 5 minutes before the appointment with a reminder and the number to call: ${phoneNum}. Thank you for choosing ${capitalizeWords(config.companyName)}. We look forward to working with you.`;
}

// ─── State Machine ───

type ConversationPhase = 'intro' | 'qualifying' | 'estimate' | 'offer-appointment' | 'confirm' | 'done' | 'disengaged';

export interface ConversationState {
  phase: ConversationPhase;
  questionIndex: number;
  userAnswers: string[];
  extractedInfo: Record<string, string>[];
  negativeCount: number;
  lastTopic: string;
}

export function getInitialState(): ConversationState {
  return { phase: 'intro', questionIndex: 0, userAnswers: [], extractedInfo: [], negativeCount: 0, lastTopic: '' };
}

export function getNextAgentMessage(
  config: BusinessConfig,
  state: ConversationState,
  userMessage?: string
): { message: string; newState: ConversationState } {
  const steps = getQualificationSteps(config);
  const name = capitalizeWords(config.companyName);

  // Opening message — no user input yet
  if (state.phase === 'intro' && !userMessage) {
    return {
      message: getIntroMessage(config),
      newState: { ...state, phase: 'intro', questionIndex: 0 },
    };
  }

  const sentiment = userMessage ? detectSentiment(userMessage) : 'neutral';
  const info = userMessage ? extractKeyInfo(userMessage) : {};
  const newAnswers = userMessage ? [...state.userAnswers, userMessage] : state.userAnswers;
  const newInfo = [...state.extractedInfo, info];
  const newNegCount = sentiment === 'negative' ? state.negativeCount + 1 : state.negativeCount;

  // Handle repeated disengagement
  if (newNegCount >= 2 && state.phase !== 'done') {
    return {
      message: `Totally understand — no pressure at all. If you ever need help in the future, don't hesitate to reach out to ${name}. We're always here. Have a great day!`,
      newState: { ...state, phase: 'disengaged', userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: '' },
    };
  }

  switch (state.phase) {
    case 'intro': {
      // User responded to the intro
      if (sentiment === 'negative') {
        return {
          message: `No problem at all! If you have any questions in the future, feel free to reach out to ${name}. We're here to help whenever you're ready.`,
          newState: { ...state, phase: 'disengaged', userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: '' },
        };
      }

      // Positive or neutral — start qualifying
      const firstStep = steps[0];
      const ack = sentiment === 'confused'
        ? "No worries! I'll walk you through it — just a few quick questions so I can help you out. "
        : "Perfect. ";

      return {
        message: `${ack}${firstStep.question}`,
        newState: { phase: 'qualifying', questionIndex: 1, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: firstStep.topic },
      };
    }

    case 'qualifying': {
      const currentStepIndex = state.questionIndex;
      const previousTopic = state.lastTopic;

      // If user gives a negative/disengaged response mid-qualification
      if (sentiment === 'negative') {
        const ack = getAcknowledgment(sentiment, userMessage || '', previousTopic);
        // Try to re-engage gently
        return {
          message: `${ack} Would you still like to get a quick estimate? I just need a couple more details and it'll only take a minute.`,
          newState: { ...state, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: previousTopic },
        };
      }

      // Build contextual acknowledgment + next question
      const ack = getAcknowledgment(sentiment, userMessage || '', previousTopic);

      if (currentStepIndex < steps.length) {
        const nextStep = steps[currentStepIndex];
        return {
          message: `${ack} ${nextStep.question}`,
          newState: { phase: 'qualifying', questionIndex: currentStepIndex + 1, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: nextStep.topic },
        };
      }

      // All questions done — give estimate
      return {
        message: `${ack} ${generateEstimateResponse(config, newAnswers, newInfo)}`,
        newState: { phase: 'estimate', questionIndex: currentStepIndex + 1, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: 'estimate' },
      };
    }

    case 'estimate': {
      if (sentiment === 'negative') {
        return {
          message: `No problem. If you change your mind, we're just a message away. Thanks for considering ${name}!`,
          newState: { phase: 'done', userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, questionIndex: state.questionIndex + 1, lastTopic: '' },
        };
      }
      return {
        message: generateAppointmentOffer(),
        newState: { phase: 'offer-appointment', questionIndex: state.questionIndex + 1, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: 'appointment' },
      };
    }

    case 'offer-appointment': {
      if (sentiment === 'negative') {
        return {
          message: `No worries — if another time works better, just let me know and I'll find something that fits. Or feel free to reach back out whenever you're ready.`,
          newState: { phase: 'done', userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, questionIndex: state.questionIndex + 1, lastTopic: '' },
        };
      }
      return {
        message: generateConfirmation(config),
        newState: { phase: 'done', questionIndex: state.questionIndex + 1, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: newNegCount, lastTopic: '' },
      };
    }

    case 'done':
    case 'disengaged': {
      // If they re-engage after being done
      if (sentiment === 'positive' || sentiment === 'neutral') {
        return {
          message: `Of course — I'm still here! What can I help you with?`,
          newState: { ...state, userAnswers: newAnswers, extractedInfo: newInfo, negativeCount: 0, lastTopic: '' },
        };
      }
      return {
        message: `Thanks for chatting with us. Have a wonderful day!`,
        newState: { ...state, userAnswers: newAnswers, extractedInfo: newInfo, lastTopic: '' },
      };
    }

    default:
      return { message: "How can I help you?", newState: state };
  }
}

export function getScenarioMessages(scenario: DemoScenario): string[] {
  switch (scenario) {
    case 'high-intent':
      return ['Yes', '8', '24 by 36 inches', 'Wooden', 'ASAP', '93101', 'Yes', 'Yes'];
    case 'low-intent':
      return ['Just looking', 'Not sure yet', 'Maybe later', 'I\'ll think about it'];
    case 'confused':
      return ['Um hi?', 'I think so', 'Not sure', 'Maybe 3?', 'Standard I guess', 'Soon', '90210', 'Sure', 'Yes'];
  }
}
