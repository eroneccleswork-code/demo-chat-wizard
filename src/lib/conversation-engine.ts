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

// Build a full industry-aware conversation flow
interface ConversationStep {
  question: string;
  contextual?: boolean; // uses previous answers
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getConversationFlow(config: BusinessConfig): ConversationStep[] {
  const name = capitalizeWords(config.companyName);
  const flows: Record<string, ConversationStep[]> = {
    'Window Cleaning': [
      { question: `Thanks for contacting ${name}. I'm an AI agent here to help with your personalized quote. Would you like to get started?` },
      { question: "Perfect. How many windows are you looking to have cleaned?" },
      { question: "Are these standard-size windows, or do you have any large or specialty windows?" },
      { question: "Is this a single-story or multi-story home?" },
      { question: "Would you like interior and exterior, or just exterior?" },
      { question: "When are you hoping to get this done?" },
      { question: "Can you share your ZIP code so I can confirm service availability?" },
    ],
    'Dental': [
      { question: `Thanks for contacting ${name}. I'm an AI agent here to help you schedule your appointment. Would you like to get started?` },
      { question: "Perfect. Is this for a routine checkup, or is there something specific you'd like addressed?" },
      { question: "When was your last dental visit?" },
      { question: "Are you currently experiencing any pain or discomfort?" },
      { question: "Do you have dental insurance, or would you like info on our self-pay options?" },
      { question: "Can you share your ZIP code so I can confirm the closest location?" },
    ],
    'Real Estate': [
      { question: `Thanks for contacting ${name}. I'm an AI agent here to help you with your real estate needs. Would you like to get started?` },
      { question: "Perfect. Are you looking to buy, sell, or both?" },
      { question: "What area or neighborhood are you most interested in?" },
      { question: "Do you have a budget range in mind?" },
      { question: "What's your timeline looking like?" },
      { question: "Have you been pre-approved for a mortgage, or would you like help with that?" },
      { question: "Can you share your ZIP code so I can match you with a local agent?" },
    ],
    'HVAC': [
      { question: `Thanks for contacting ${name}. I'm an AI agent here to help with your heating and cooling needs. Would you like to get started?` },
      { question: "Perfect. Is this for heating, cooling, or both?" },
      { question: "How old is your current system?" },
      { question: "What's the approximate square footage of your home?" },
      { question: "Is this an urgent repair, or are you looking at maintenance or a new installation?" },
      { question: "When are you hoping to move forward with this?" },
      { question: "Can you share your ZIP code so I can confirm service availability?" },
    ],
    'Legal': [
      { question: `Thanks for contacting ${name}. I'm an AI agent here to help connect you with the right attorney. Would you like to get started?` },
      { question: "Perfect. What type of legal matter is this regarding?" },
      { question: "Has anything been filed yet, or is this a new matter?" },
      { question: "What's the timeline we're working with?" },
      { question: "Have you spoken with another attorney about this?" },
      { question: "Can you share your ZIP code so I can confirm jurisdiction?" },
    ],
    'Blinds': [
      { question: `Thanks for contacting ${config.companyName}. I'm an AI agent here to help with your personalized quote. Schedule a consultation today to save 10% on wood blinds. Would you like to get started?` },
      { question: "Perfect. How many windows are you looking to cover with blinds?" },
      { question: "What are the approximate measurements of each window?" },
      { question: "What material are you considering for the blinds?" },
      { question: "When are you hoping to move forward with this project?" },
      { question: "Can you share your ZIP code so I can confirm service availability?" },
    ],
  };

  const defaultFlow: ConversationStep[] = [
    { question: `Thanks for contacting ${config.companyName}. I'm an AI agent here to help you. ${config.cta ? `We can help you ${config.cta.toLowerCase()}.` : ''} Would you like to get started?` },
    { question: "Perfect. What specifically are you looking for help with?" },
    { question: "How large is the scope of what you need?" },
    { question: "What's your timeline for this?" },
    { question: "Do you have a budget range in mind?" },
    { question: "Can you share your ZIP code so I can confirm availability?" },
  ];

  return flows[config.industry] || defaultFlow;
}

function generateEstimateResponse(config: BusinessConfig, answers: string[]): string {
  const answersJoined = answers.join(' ').toLowerCase();
  
  const templates: Record<string, (answers: string[]) => string> = {
    'Window Cleaning': (ans) => {
      return `Good news. We do service that area, and based on what you've shared, a preliminary estimate is between $150 and $300. To give you an exact quote, we recommend a quick virtual consultation with one of our specialists. Would you like to schedule one?`;
    },
    'Dental': () => {
      return `Great news — we have availability at a location near you. Based on what you've described, we can get you in quickly. Would you like to schedule an appointment?`;
    },
    'Real Estate': () => {
      return `We have experienced agents in that area who can help. I'd love to connect you with one for a personalized consultation. Would you like to schedule a call?`;
    },
    'HVAC': () => {
      return `Good news. We do service that area. Based on what you've shared, we can have a technician assess your system and provide options. Would you like to schedule a visit?`;
    },
    'Legal': () => {
      return `We have attorneys experienced in that area of law. I'd like to set up a free initial consultation so we can discuss your case. Would you like to schedule one?`;
    },
    'Blinds': (ans) => {
      return `Good news. We do service that area, and based on what you've shared, a preliminary estimate for your blinds with installation is between $800 and $1,000. To give you an exact quote, we recommend a virtual consultation with one of our specialists. Would you like to schedule one?`;
    },
  };

  const defaultTemplate = () => {
    return `Good news — we service your area. Based on what you've shared, I'd love to connect you with our team for a personalized quote. Would you like to schedule a consultation?`;
  };

  return (templates[config.industry] || defaultTemplate)(answers);
}

function generateAppointmentOffer(): string {
  // Generate a realistic upcoming date
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

  return `Great. Your virtual consultation is confirmed for ${dayName}, ${monthName} ${dateNum} at ${hour}:00 ${ampm} Pacific Time. You'll receive a text message 5 minutes before the appointment with a reminder and the number to call: ${phoneNum}. Thank you for choosing ${config.companyName}. We look forward to working with you.`;
}

// State machine for conversation
type ConversationPhase = 'qualifying' | 'estimate' | 'offer-appointment' | 'confirm' | 'done';

export interface ConversationState {
  phase: ConversationPhase;
  questionIndex: number;
  userAnswers: string[];
}

export function getInitialState(): ConversationState {
  return { phase: 'qualifying', questionIndex: 0, userAnswers: [] };
}

export function getNextAgentMessage(
  config: BusinessConfig,
  state: ConversationState,
  userMessage?: string
): { message: string; newState: ConversationState } {
  const flow = getConversationFlow(config);

  // Opening message (no user message yet)
  if (state.questionIndex === 0 && !userMessage) {
    return {
      message: flow[0].question,
      newState: { ...state, questionIndex: 1 },
    };
  }

  const newAnswers = userMessage ? [...state.userAnswers, userMessage] : state.userAnswers;

  switch (state.phase) {
    case 'qualifying': {
      if (state.questionIndex < flow.length) {
        return {
          message: flow[state.questionIndex].question,
          newState: { phase: 'qualifying', questionIndex: state.questionIndex + 1, userAnswers: newAnswers },
        };
      }
      // All questions asked, give estimate
      return {
        message: generateEstimateResponse(config, newAnswers),
        newState: { phase: 'estimate', questionIndex: state.questionIndex + 1, userAnswers: newAnswers },
      };
    }

    case 'estimate': {
      // User said yes to consultation
      return {
        message: generateAppointmentOffer(),
        newState: { phase: 'offer-appointment', questionIndex: state.questionIndex + 1, userAnswers: newAnswers },
      };
    }

    case 'offer-appointment': {
      return {
        message: generateConfirmation(config),
        newState: { phase: 'done', questionIndex: state.questionIndex + 1, userAnswers: newAnswers },
      };
    }

    case 'done': {
      return {
        message: `Is there anything else I can help you with?`,
        newState: { ...state, userAnswers: newAnswers },
      };
    }

    default:
      return {
        message: "How can I help you?",
        newState: state,
      };
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
