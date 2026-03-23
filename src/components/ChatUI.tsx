import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig, ChatMessage, SpeedMode, DemoScenario } from '@/lib/types';
import { analyzeWebsite, generatePersona, generateAgentResponse, getThinkingSteps, getScenarioMessages } from '@/lib/conversation-engine';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import DemoControls from './DemoControls';

interface Props {
  config: BusinessConfig;
}

export default function ChatUI({ config }: Props) {
  const navigate = useNavigate();
  const insights = analyzeWebsite(config);
  const persona = generatePersona(config, insights);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('realistic');
  const [showThinking, setShowThinking] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scenarioActive, setScenarioActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Send initial greeting
  useEffect(() => {
    const greeting = generateAgentResponse(config, persona, insights, [], 0);
    const delay = speedMode === 'instant' ? 300 : 1200;
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([{
        id: '0',
        role: 'agent',
        content: greeting,
        timestamp: new Date(),
        thinkingSteps: ['New lead detected', 'Loading business context...', 'Generating personalized greeting'],
      }]);
      setIsTyping(false);
      setQuestionIndex(1);
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAgentResponse = useCallback((history: ChatMessage[], qIdx: number) => {
    const delay = speedMode === 'instant' ? 200 : 1000 + Math.random() * 1500;
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAgentResponse(config, persona, insights, history, qIdx);
      const thinkingSteps = getThinkingSteps(qIdx, history[history.length - 1]?.content || '');
      const agentMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        thinkingSteps,
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      setQuestionIndex(prev => prev + 1);
    }, delay);
  }, [config, persona, insights, speedMode]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    addAgentResponse(newMessages, questionIndex);
  };

  const handleScenario = async (scenario: DemoScenario) => {
    setMessages([]);
    setQuestionIndex(0);
    setScenarioActive(true);

    const scenarioMsgs = getScenarioMessages(scenario);
    
    // Start with greeting
    const greeting = generateAgentResponse(config, persona, insights, [], 0);
    const greetMsg: ChatMessage = {
      id: '0',
      role: 'agent',
      content: greeting,
      timestamp: new Date(),
      thinkingSteps: ['New lead detected', `Scenario: ${scenario}`, 'Generating greeting'],
    };

    setIsTyping(true);
    await new Promise(r => setTimeout(r, speedMode === 'instant' ? 200 : 1000));
    setMessages([greetMsg]);
    setIsTyping(false);

    let currentMessages = [greetMsg];
    let qIdx = 1;

    for (const userText of scenarioMsgs) {
      await new Promise(r => setTimeout(r, speedMode === 'instant' ? 300 : 1500));
      
      const userMsg: ChatMessage = {
        id: Date.now().toString() + Math.random(),
        role: 'user',
        content: userText,
        timestamp: new Date(),
      };
      currentMessages = [...currentMessages, userMsg];
      setMessages([...currentMessages]);
      
      setIsTyping(true);
      await new Promise(r => setTimeout(r, speedMode === 'instant' ? 200 : 1000 + Math.random() * 1000));
      
      const response = generateAgentResponse(config, persona, insights, currentMessages, qIdx);
      const agentMsg: ChatMessage = {
        id: Date.now().toString() + Math.random(),
        role: 'agent',
        content: response,
        timestamp: new Date(),
        thinkingSteps: getThinkingSteps(qIdx, userText),
      };
      currentMessages = [...currentMessages, agentMsg];
      setMessages([...currentMessages]);
      setIsTyping(false);
      qIdx++;
    }
    setQuestionIndex(qIdx);
    setScenarioActive(false);
  };

  const handleReset = () => {
    setMessages([]);
    setQuestionIndex(0);
    setInput('');
    // Re-trigger greeting
    const greeting = generateAgentResponse(config, persona, insights, [], 0);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        id: '0',
        role: 'agent',
        content: greeting,
        timestamp: new Date(),
        thinkingSteps: ['Session reset', 'Loading business context...', 'Generating greeting'],
      }]);
      setIsTyping(false);
      setQuestionIndex(1);
    }, speedMode === 'instant' ? 200 : 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md flex flex-col h-[calc(100vh-2rem)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center">
            <h2 className="text-sm font-semibold">{config.companyName}</h2>
            <p className="text-xs text-muted-foreground">SMS Agent • {config.industry}</p>
          </div>
          <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <DemoControls
          speedMode={speedMode}
          onSpeedChange={setSpeedMode}
          showThinking={showThinking}
          onThinkingToggle={() => setShowThinking(!showThinking)}
          onScenario={handleScenario}
          disabled={scenarioActive}
        />

        {/* Business context bar */}
        <div className="mt-3 mb-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/30">
          <p className="text-[11px] text-muted-foreground font-mono">
            <span className="text-primary">●</span> Agent trained on: {insights.services.slice(0, 3).join(' · ')}
          </p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 scrollbar-thin">
          <AnimatePresence>
            {messages.map(msg => (
              <ChatBubble key={msg.id} message={msg} showThinking={showThinking} />
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="pt-3 pb-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Reply as the customer…"
              disabled={scenarioActive}
              className="flex-1 px-4 py-2.5 rounded-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm disabled:opacity-40"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || scenarioActive}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
