

import React, { useState, useEffect, useRef, useContext } from 'react';
import { startStrategistChat, executeFunctionCall } from '../../../services/geminiService';
import type { Chat, Part } from "@google/genai";
import Button from '../../ui/Button';
import { renderMarkdownContent } from '../../../utils/formatContent';
import SparklesIcon from '../../icons/SparklesIcon';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import type { ChatMessage, SiteDataContextType } from '../../../types';
import SendIcon from '../../icons/SendIcon';

const StrategistView: React.FC = () => {
    const siteDataContext = useContext(SiteDataContext);
    const { currentUser } = useContext(AuthContext);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        const agencyData = JSON.stringify({
            users: siteDataContext.users,
            clients: siteDataContext.clients,
            projects: siteDataContext.projects,
            tasks: siteDataContext.tasks,
            blogPosts: siteDataContext.blogPosts,
            marketScanners: siteDataContext.marketScanners,
        });
        const session = startStrategistChat(agencyData);
        setChatSession(session);
        setMessages([{
            id: 'init', role: 'model', content: "Hello! I'm The Strategist, your AI business partner. How can I help you run the agency today? Feel free to ask about projects, manage tasks, or request strategic analysis."
        }]);
        setIsLoading(false);
    }, []);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent, prompt?: string) => {
        e.preventDefault();
        const userMessage = prompt || inputValue.trim();
        if (!userMessage || isLoading || !chatSession) return;

        const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            let result = await chatSession.sendMessage({ message: userMessage });
            
            // Handle potential function calls
            while (result.functionCalls && result.functionCalls.length > 0) {
                const functionCalls = result.functionCalls;
                const functionResponseParts: Part[] = [];

                for (const fc of functionCalls) {
                    const functionResult = await executeFunctionCall(fc.name, fc.args, siteDataContext, currentUser);
                    functionResponseParts.push({
                        functionResponse: {
                            name: fc.name,
                            response: functionResult,
                        },
                    });
                }
                
                result = await chatSession.sendMessage({ message: { parts: functionResponseParts } });
            }
            
            setMessages(prev => [...prev, { id: `model-${Date.now()}`, role: 'model', content: result.text }]);

        } catch (error) {
            console.error("Strategist error:", error);
            setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'model', content: "Sorry, an error occurred. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const examplePrompts = [
        "Forecast our revenue for the next 3 months.",
        "Analyze our blog content for gaps.",
        "Develop a 3-month content plan for 'AI in Marketing'.",
        "Show me all overdue invoices.",
        "Find internal linking opportunities for the 'future-of-seo' post.",
        "What's the team's current workload?",
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in h-full flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-white mb-2">The Strategist</h1>
                <p className="text-slate-400 mb-6">Your conversational AI partner. Ask questions, issue commands, and get strategic insights.</p>
            </div>
            
            <div className="flex-grow bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map(message => (
                        <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'model' && <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm prose prose-sm prose-invert max-w-none ${message.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                                {renderMarkdownContent(message.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0"><SparklesIcon className="w-5 h-5 animate-spin"/></div>
                            <div className="max-w-[85%] rounded-2xl p-3 text-sm bg-slate-800 text-slate-200 rounded-bl-none">
                                <span className="blinking-cursor"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {messages.length <= 1 && !isLoading && (
                    <div className="p-4 text-sm text-slate-400">
                        <h3 className="font-semibold mb-2">Try asking:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {examplePrompts.map(p => (
                            <button key={p} onClick={(e) => handleSendMessage(e, p)} className="text-left p-2 bg-slate-800/50 rounded-md hover:bg-slate-800 transition-colors">
                                "{p}"
                            </button>
                        ))}
                        </div>
                    </div>
                )}

                <footer className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask The Strategist..."
                            className="flex-grow bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-blue-500 transition-colors disabled:bg-slate-600" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default StrategistView;
