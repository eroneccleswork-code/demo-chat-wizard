import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Send, RotateCcw, Plus, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusinessConfig, ChatMessage } from '@/lib/types';
import { analyzeWebsite, generatePersona, getNextAgentMessage, getInitialState, ConversationState } from '@/lib/conversation-engine';
import TypingIndicator from './TypingIndicator';

interface Props {
  config: BusinessConfig;
}

function renderMessageContent(content: string) {
  const phoneRegex = /(\d{3}-\d{3}-\d{4})/g;
  const parts = content.split(phoneRegex);
  return parts.map((part, i) =>
    phoneRegex.test(part) ? (
      <span key={i} className="text-blue-400 underline">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function IMessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const isAgent = message.role === 'agent';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
    >
      <div
        className={`max-w-[75%] px-3.5 py-2 text-[15px] leading-[1.4] ${
          isAgent
            ? 'bg-sms-user text-sms-user-foreground rounded-2xl rounded-bl-[4px]'
            : 'bg-sms-agent text-sms-agent-foreground rounded-2xl rounded-br-[4px]'
        }`}
      >
        {renderMessageContent(message.content)}
      </div>
      {/* Show "Delivered" under the last user message */}
      {!isAgent && isLast && (
        <span className="text-[11px] text-muted-foreground mt-0.5 mr-1">Delivered</span>
      )}
    </motion.div>
  );
}

export default function ChatUI({ config }: Props) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [convState, setConvState] = useState<ConversationState>(getInitialState());

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Send initial greeting
  useEffect(() => {
    setIsTyping(true);
    const { message, newState } = getNextAgentMessage(config, getInitialState());
    const timer = setTimeout(() => {
      setMessages([{ id: '0', role: 'agent', content: message, timestamp: new Date() }]);
      setConvState(newState);
      setIsTyping(false);
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAgentResponse = useCallback((currentState: ConversationState, userText: string) => {
    const delay = 1000 + Math.random() * 1500;
    setIsTyping(true);
    setTimeout(() => {
      const { message, newState } = getNextAgentMessage(config, currentState, userText);
      const agentMsg: ChatMessage = {
        id: Date.now().toString(), role: 'agent', content: message, timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setConvState(newState);
      setIsTyping(false);
    }, delay);
  }, [config]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    addAgentResponse(convState, content);
  };

  const handleReset = () => {
    const initialState = getInitialState();
    setMessages([]);
    setConvState(initialState);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const { message, newState } = getNextAgentMessage(config, initialState);
      setMessages([{ id: '0', role: 'agent', content: message, timestamp: new Date() }]);
      setConvState(newState);
      setIsTyping(false);
    }, 800);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // Find last user message index for "Delivered" label
  let lastUserIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') { lastUserIdx = i; break; }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(240,5%,84%)]">
      {/* iPhone frame */}
      <div className="w-full max-w-[390px] h-[780px] rounded-[44px] border-[3px] border-[hsl(220,14%,18%)] bg-[hsl(0,0%,0%)] flex flex-col overflow-hidden relative shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-[hsl(0,0%,0%)] rounded-full z-20" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-4 pb-1 text-[12px] font-semibold text-white z-10">
          <span>{timeStr}</span>
          <div className="w-[120px]" />
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.4"/><rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.6"/><rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.8"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor"><path d="M7.5 3.6c1.7 0 3.2.7 4.3 1.8l1.1-1.1C11.4 2.8 9.6 2 7.5 2S3.6 2.8 2.1 4.3l1.1 1.1C4.3 4.3 5.8 3.6 7.5 3.6zm0 3c.9 0 1.8.4 2.4 1l1.1-1.1c-.9-.9-2.1-1.4-3.5-1.4s-2.6.5-3.5 1.4l1.1 1.1c.6-.6 1.5-1 2.4-1zm0 3c.4 0 .7.1 1 .4l1.5-1.5c-.7-.6-1.5-1-2.5-1s-1.8.4-2.5 1L6.5 10c.3-.3.6-.4 1-.4z"/></svg>
            <div className="flex items-center">
              <div className="w-[22px] h-[10px] rounded-[3px] border border-white/40 flex items-center p-[1px]">
                <div className="h-full w-[60%] bg-white rounded-[1.5px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation header */}
        <div className="flex items-center px-4 py-2 relative">
          <button onClick={() => navigate('/')} className="flex items-center text-sms-agent text-[17px]">
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[hsl(220,14%,20%)] flex items-center justify-center mb-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="hsl(220,14%,40%)"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>
            </div>
            <span className="text-[13px] font-semibold text-foreground">{config.companyName}</span>
          </div>
          <button onClick={handleReset} className="text-sms-agent">
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
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 space-y-2 pb-2">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <IMessageBubble key={msg.id} message={msg} isLast={msg.role === 'user' && idx === lastUserIdx} />
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Input bar — iOS style */}
        <div className="px-3 pb-8 pt-2 flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[hsl(220,14%,18%)] flex items-center justify-center text-muted-foreground flex-shrink-0">
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center bg-transparent rounded-full border border-[hsl(220,14%,22%)] px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="iMessage"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-[15px]"
            />
            {input.trim() ? (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleSend}
                className="ml-2 w-7 h-7 rounded-full bg-sms-agent flex items-center justify-center flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(0,0%,100%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </motion.button>
            ) : (
              <Mic className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
