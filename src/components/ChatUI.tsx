import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Send, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig, ChatMessage, SpeedMode, DemoScenario } from '@/lib/types';
import { analyzeWebsite, generatePersona, generateAgentResponse, getThinkingSteps, getScenarioMessages } from '@/lib/conversation-engine';
import TypingIndicator from './TypingIndicator';

interface Props {
  config: BusinessConfig;
}

function IMessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.role === 'agent';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] px-3.5 py-2 text-[15px] leading-[1.35] ${
          isAgent
            ? 'bg-sms-user text-sms-user-foreground rounded-2xl rounded-bl-[4px]'
            : 'bg-sms-agent text-sms-agent-foreground rounded-2xl rounded-br-[4px]'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

export default function ChatUI({ config }: Props) {
  const navigate = useNavigate();
  const insights = analyzeWebsite(config);
  const persona = generatePersona(config, insights);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speedMode] = useState<SpeedMode>('realistic');
  const [questionIndex, setQuestionIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    const greeting = generateAgentResponse(config, persona, insights, [], 0);
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([{
        id: '0', role: 'agent', content: greeting, timestamp: new Date(),
      }]);
      setIsTyping(false);
      setQuestionIndex(1);
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAgentResponse = useCallback((history: ChatMessage[], qIdx: number) => {
    const delay = 1000 + Math.random() * 1500;
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAgentResponse(config, persona, insights, history, qIdx);
      const agentMsg: ChatMessage = {
        id: Date.now().toString(), role: 'agent', content: response, timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      setQuestionIndex(prev => prev + 1);
    }, delay);
  }, [config, persona, insights]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    addAgentResponse(newMessages, questionIndex);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* iPhone frame */}
      <div className="w-full max-w-[390px] h-[780px] rounded-[44px] border-[3px] border-[hsl(220,14%,18%)] bg-[hsl(0,0%,0%)] flex flex-col overflow-hidden relative shadow-2xl">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-[hsl(0,0%,0%)] rounded-full z-20" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-4 pb-1 text-[12px] font-semibold text-foreground z-10">
          <span>{timeStr}</span>
          <div className="w-[120px]" />
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.4"/><rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.6"/><rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.8"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor"><path d="M7.5 3.6c1.7 0 3.2.7 4.3 1.8l1.1-1.1C11.4 2.8 9.6 2 7.5 2S3.6 2.8 2.1 4.3l1.1 1.1C4.3 4.3 5.8 3.6 7.5 3.6zm0 3c.9 0 1.8.4 2.4 1l1.1-1.1c-.9-.9-2.1-1.4-3.5-1.4s-2.6.5-3.5 1.4l1.1 1.1c.6-.6 1.5-1 2.4-1zm0 3c.4 0 .7.1 1 .4l1.5-1.5c-.7-.6-1.5-1-2.5-1s-1.8.4-2.5 1L6.5 10c.3-.3.6-.4 1-.4z"/></svg>
            <div className="flex items-center">
              <div className="w-[22px] h-[10px] rounded-[3px] border border-foreground/40 flex items-center p-[1px]">
                <div className="h-full w-[60%] bg-foreground rounded-[1.5px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation header */}
        <div className="flex items-center px-4 py-2 relative">
          <button onClick={() => navigate('/')} className="flex items-center gap-0.5 text-sms-agent text-[17px]">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[hsl(220,14%,20%)] flex items-center justify-center mb-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(220,14%,40%)"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
            </div>
            <span className="text-[13px] font-semibold text-foreground">{config.companyName}</span>
          </div>
          <button onClick={() => {
            setMessages([]);
            setQuestionIndex(0);
            setIsTyping(true);
            setTimeout(() => {
              const greeting = generateAgentResponse(config, persona, insights, [], 0);
              setMessages([{ id: '0', role: 'agent', content: greeting, timestamp: new Date() }]);
              setIsTyping(false);
              setQuestionIndex(1);
            }, 800);
          }} className="text-sms-agent">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* iMessage / Today label */}
        <div className="text-center py-1.5">
          <span className="text-[11px] text-muted-foreground">iMessage</span>
          <br />
          <span className="text-[11px] text-muted-foreground">Today {timeStr}</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 space-y-1.5 pb-2">
          <AnimatePresence>
            {messages.map(msg => (
              <IMessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="px-3 pb-8 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[hsl(220,14%,12%)] rounded-full border border-[hsl(220,14%,20%)] px-4 py-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Text Message"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-[15px]"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-sms-agent flex items-center justify-center disabled:opacity-30 transition-opacity"
            >
              <Send className="w-4 h-4 text-sms-agent-foreground" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
