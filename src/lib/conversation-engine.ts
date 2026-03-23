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
  const qualificationQuestions: Record<string, string[]> = {
    'Window Cleaning': [
      "How many windows are we talking about?",
      "Is this a single-story or multi-story home?",
      "When's the last time they were cleaned?",
      "Are we looking at inside and outside, or just exterior?",
    ],
    'Dental': [
      "Is this for a routine checkup or something specific?",
      "When was your last visit to a dentist?",
      "Are you experiencing any pain or discomfort?",
      "Do you have dental insurance?",
    ],
    'Real Estate': [
      "Are you looking to buy or sell?",
      "What area are you interested in?",
      "What's your timeline looking like?",
      "Do you have a budget range in mind?",
    ],
    'HVAC': [
      "Is this for heating, cooling, or both?",
      "How old is your current system?",
      "What's the square footage of your space?",
      "Is this an emergency or can it wait a day or two?",
    ],
    'Legal': [
      "What type of legal matter is this regarding?",
      "Has anything been filed yet?",
      "What's the timeline we're working with?",
      "Have you spoken with another attorney about this?",
    ],
  };

  const defaultQuestions = [
    "What specifically are you looking for help with?",
    "What's your timeline for this?",
    "Have you worked with a company like ours before?",
    "What's most important to you in choosing a provider?",
  ];

  return {
    name: config.companyName,
    style: insights.tone,
    qualificationQuestions: qualificationQuestions[config.industry] || defaultQuestions,
    closingLines: [
      `Based on what you've shared, I can get you ${config.cta.toLowerCase()} — what day works best?`,
      `I'd love to connect you with our team. What's the best number to reach you?`,
      `We can definitely help with that. Want me to set something up for you this week?`,
    ],
  };
}

export function getThinkingSteps(messageIndex: number, userMessage: string): string[] {
  const steps: string[][] = [
    ['Analyzing incoming message...', 'Identifying lead intent...', 'Selecting opening qualification question'],
    ['Processing response...', 'Matching to service categories...', 'Building scope assessment'],
    ['Evaluating engagement level...', 'Pulling service context from website...', 'Selecting next best question'],
    ['Detecting buying signals...', 'Calculating lead score: High', 'Preparing to steer toward conversion'],
    ['Intent confirmed: Ready to convert', 'Generating personalized CTA...', 'Optimizing closing message'],
  ];

  return steps[Math.min(messageIndex, steps.length - 1)];
}

export function generateAgentResponse(
  config: BusinessConfig,
  persona: AgentPersona,
  insights: WebsiteInsights,
  conversationHistory: ChatMessage[],
  questionIndex: number
): string {
  const userMessages = conversationHistory.filter(m => m.role === 'user');
  const msgCount = userMessages.length;

  if (msgCount === 0) {
    return `Hey! 👋 Thanks for reaching out to ${config.companyName}. I'd love to help you out. ${persona.qualificationQuestions[0]}`;
  }

  if (questionIndex < persona.qualificationQuestions.length) {
    const acknowledgments = [
      "Got it!",
      "Perfect, that helps.",
      "Great, thanks for sharing that.",
      "Awesome, good to know.",
      "Makes sense!",
    ];
    const ack = acknowledgments[msgCount % acknowledgments.length];
    return `${ack} ${persona.qualificationQuestions[questionIndex]}`;
  }

  // Closing
  return persona.closingLines[msgCount % persona.closingLines.length];
}

export function getScenarioMessages(scenario: DemoScenario): string[] {
  switch (scenario) {
    case 'high-intent':
      return [
        "Hi, I need this done ASAP",
        "About 20, two-story house",
        "It's been over a year",
        "Both inside and out please",
        "This week if possible",
      ];
    case 'low-intent':
      return [
        "Just looking for some info",
        "Not sure yet honestly",
        "Maybe in a few months",
        "I'll think about it",
      ];
    case 'confused':
      return [
        "Um hi, someone gave me this number?",
        "I think I need help with something but not sure what exactly",
        "Wait, what do you guys actually do?",
        "Oh ok, maybe that could work",
      ];
  }
}
