import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { startChatStream } from '../services/geminiService';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';
import { renderMarkdownContent } from '../utils/formatContent';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

const LiveChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Set initial welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'init',
                    role: 'model',
                    content: "Hi there! I'm Edge, your friendly AI guide to Prevaledge. I can help you explore our services, understand digital marketing, or even brainstorm some ideas. What's on your mind? 😊",
                },
            ]);
        }
    }, [isOpen, messages.length]);

    // Scroll to bottom of chat on new message
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;
    
        const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);
    
        const modelMessageId = `model-${Date.now()}`;
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '' }]);
        
        try {
          const stream = startChatStream(userMessage);
          
          let fullResponse = '';
          for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === modelMessageId
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            );
          }
        } catch (error) {
            console.error("Chat stream error:", error);
            setMessages(prev =>
              prev.map(msg =>
                msg.id === modelMessageId
                  ? { ...msg, content: "Sorry, I'm having trouble connecting. Please try again." }
                  : msg
              )
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400/50 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
                aria-label="Open chat"
            >
                <ChatBubbleIcon className="w-8 h-8" />
            </button>
    
            <div
                className={`fixed bottom-28 right-8 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
                role="dialog"
                aria-hidden={!isOpen}
            >
                <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Edge AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white transition-colors" aria-label="Close chat"><XIcon className="w-6 h-6" /></button>
                </header>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex items-end gap-2 animate-fade-in ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'model' && <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 p-1.5"><BrainCircuitIcon className="text-blue-400" /></div>}
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                <div className="prose prose-sm prose-invert max-w-none">
                                    {renderMarkdownContent(message.content)}
                                    {isLoading && message.id.startsWith('model-') && messages[messages.length-1].id === message.id && <span className="blinking-cursor"></span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="flex-shrink-0 p-4 border-t border-slate-800">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-grow bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-blue-500 transition-colors disabled:bg-slate-600"
                            disabled={isLoading || !inputValue.trim()}
                            aria-label="Send message"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default LiveChatWidget;