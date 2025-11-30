import React, { useState, useRef, useEffect } from 'react';
import { askAiAssistant } from '../services/geminiService';
import { Bot, Send, X, Loader2, Sparkles, HelpCircle } from 'lucide-react';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I can help you with giffgaff SIM rules, usage tips, or drafting messages. What do you need?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);
    const response = await askAiAssistant(userMsg, history);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-brand-card shadow-2xl z-50 border-l border-white/10 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2 text-brand-accent">
          <Sparkles size={20} />
          <h2 className="font-bold text-white">Assistant</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-accent text-brand-dark rounded-br-none font-medium' 
                  : 'bg-white/10 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white/5 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-brand-accent" />
                <span className="text-xs text-gray-400">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-brand-dark/50 backdrop-blur-sm">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about SIM expiry..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-brand-accent hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-brand-dark rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
           <button onClick={() => setInput('How do I keep my SIM active?')} className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-400 border border-white/5 transition-colors">
              How to keep active?
           </button>
           <button onClick={() => setInput('What is the deadline for giffgaff?')} className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-gray-400 border border-white/5 transition-colors">
              Giffgaff deadline?
           </button>
        </div>
      </div>
    </div>
  );
};