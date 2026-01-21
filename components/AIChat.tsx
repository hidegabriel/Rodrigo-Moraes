import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { ChatMessage, ServiceOrder } from '../types';
import { generateLegalAdvice } from '../services/geminiService';

interface AIChatProps {
  activeOS?: ServiceOrder;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ activeOS, isOpen, onToggle }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá. Sou sua IA jurídica. Como posso ajudar com seus processos hoje?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateLegalAdvice(input, activeOS);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  // Add contextual hint when OS changes
  useEffect(() => {
    if (activeOS) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: `Entendido. Estou com o contexto da OS ${activeOS.osNumber} (${activeOS.clientName}). Pode perguntar sobre estratégia, prazos ou métodos.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [activeOS?.id]);

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 bg-legal-900 dark:bg-legal-600 text-white rounded-full shadow-lg hover:bg-legal-800 transition-all flex items-center justify-center z-50 hover:scale-105"
        title="Abrir Assistente IA"
      >
        <Icons.Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-white dark:bg-legal-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-legal-700 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-legal-900 dark:bg-legal-900 p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Icons.Sparkles className="w-5 h-5 text-gold-500" />
          <h3 className="font-semibold">LexFlow AI Assistant</h3>
        </div>
        <button onClick={onToggle} className="hover:text-gray-300">
          <span className="text-2xl leading-none">&times;</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-legal-900/50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-legal-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-legal-700 dark:text-gray-100 border border-gray-200 dark:border-legal-600 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-70 block text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-legal-700 p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-200 dark:border-legal-600">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-legal-800 border-t border-gray-200 dark:border-legal-700 shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={activeOS ? "Pergunte sobre esta OS..." : "Digite sua dúvida jurídica..."}
            className="w-full pl-3 pr-10 py-3 bg-gray-100 dark:bg-legal-900 dark:text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-legal-500 text-sm"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 text-legal-600 dark:text-legal-300 hover:text-legal-800 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <Icons.Send className="w-5 h-5" />
          </button>
        </div>
        {activeOS && (
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 px-1 truncate">
            Contexto: {activeOS.osNumber} - {activeOS.legalArea}
          </div>
        )}
      </div>
    </div>
  );
};
