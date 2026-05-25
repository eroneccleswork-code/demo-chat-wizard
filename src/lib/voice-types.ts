export type VoiceScenarioType = 'cart-recovery' | 'service-call' | 'custom';

export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export interface VoiceAgentConfig {
  companyName: string;
  industry: string;
  scenarioType: VoiceScenarioType;
  voiceURI: string;       // browser SpeechSynthesis voice URI
  voiceName: string;
  voiceRate: number;
  agentName: string;
  greetingLine?: string;
  presenceContext?: string;   // what the agent has been "trained on"
  cart?: CartItem[];
  customFlow?: string;        // free-form scenario instructions
  callerName?: string;
  callerPhone?: string;
  enableTransfer: boolean;
  enableUpsell: boolean;
}

export type VoiceTurnRole = 'agent' | 'caller' | 'system';

export interface VoiceTurn {
  id: string;
  role: VoiceTurnRole;
  text: string;
  ts: number;
}

export type CallStatus = 'idle' | 'ringing' | 'connected' | 'transferring' | 'completed';
