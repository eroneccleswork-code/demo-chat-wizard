export interface BusinessConfig {
  companyName: string;
  industry: string;
  cta: string;
  websiteUrl: string;
  customContext?: string;
  presencePage?: string;
}

export interface WebsiteInsights {
  description: string;
  services: string[];
  targetCustomer: string;
  tone: string;
}

export interface AgentPersona {
  name: string;
  style: string;
  qualificationQuestions: string[];
  closingLines: string[];
}

export interface ChatMessage {
  id: string;
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
  thinkingSteps?: string[];
}

export type DemoScenario = 'high-intent' | 'low-intent' | 'confused';
export type SpeedMode = 'realistic' | 'instant';
