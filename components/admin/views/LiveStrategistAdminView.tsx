import React, { useState, useEffect, useRef, useContext } from 'react';
import { startChatStream, executeFunctionCall } from '../../../services/geminiService';
import VisualizerOrb from '../../ui/VisualizerOrb';
import Button from '../../ui/Button';
import { SiteDataContext } from '../../../data/siteDataContext';
import { AuthContext } from '../../../context/AuthContext';
import { LiveAgentStatus, TranscriptionTurn } from '../../../types';
import PermissionModal from '../PermissionModal';

// Mock AdminToolResultDisplay since function calling is not fully implemented
const AdminToolResultDisplay: React.FC<{ functionName: string; result: any }> = ({ functionName, result }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-2 animate-fade-in">
        <p className="text-xs font-mono text-slate-400">Tool Result: {functionName}</p>
        <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all mt-2">{JSON.stringify(result, null, 2)}</pre>
    </div>
);

const LiveStrategistAdminView: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const [status, setStatus] = useState<LiveAgentStatus>('idle');
    const [transcription, setTranscription] = useState<TranscriptionTurn[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'idle' | 'pending' | 'denied'>('idle');

    const recognitionRef = useRef<any | null>(null); // SpeechRecognition instance
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Speech Recognition Logic ---
    const getAIResponse = async (prompt: string) => {
        setStatus('thinking');
        let fullResponse = '';
        try {
            const stream = startChatStream(prompt);
            for await (const chunk of stream) {
                fullResponse += chunk;
                setTranscription(prev => {
                    const newTranscription = [...prev];
                    if (newTranscription.length > 0 && newTranscription[newTranscription.length - 1].speaker === 'model') {
                        newTranscription[newTranscription.length - 1].text = fullResponse;
                    } else {
                        newTranscription.push({ speaker: 'model', text: fullResponse });
                    }
                    return newTranscription;
                });
            }
        } catch (err: any) {
            console.error("Error getting AI response:", err);
            setError(`Failed to get response: ${err.message}`);
            setStatus('error');
        } finally {
            setStatus('idle');
        }
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            setError("Speech recognition is not supported in this browser. Try Chrome.");
            setStatus('error');
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onstart = () => {
            setStatus('listening');
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // For now, we only care about the final transcript.
            // You could update the UI with the interim transcript if you wish.
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setError(`Speech recognition error: ${event.error}`);
            setStatus('error');
        };

        recognition.onend = () => {
            if (finalTranscript) {
                setTranscription(prev => [...prev, { speaker: 'user', text: finalTranscript }]);
                getAIResponse(finalTranscript);
            } else {
                setStatus('idle'); // No speech detected
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setStatus('idle');
    };
    
    // --- Lifecycle and Permissions ---
    
    useEffect(() => {
        return () => { // Cleanup on unmount
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcription]);

    const handleStartClick = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // We just needed permission
            setIsPermissionModalOpen(false);
            setPermissionStatus('idle');
            startListening(); // Start listening right away
        } catch (err) {
            console.error("Microphone permission denied:", err);
            setIsPermissionModalOpen(true);
            setPermissionStatus('denied');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in h-full flex flex-col">
             <h1 className="text-3xl font-bold text-white mb-2">Voice Strategist</h1>
             <p className="text-slate-400 mb-6">Your voice-powered AI business partner. Speak your commands and get results.</p>
             <div className="flex-grow bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                <div className="flex-grow flex flex-col items-center justify-center p-4 relative">
                    {transcription.length > 0 ? (
                        <div className="absolute top-0 left-0 w-full h-full overflow-y-auto p-4 space-y-4">
                            {transcription.map((turn, index) => (
                                <div key={index} className="animate-fade-in">
                                    <p className={`font-bold ${turn.speaker === 'user' ? 'text-blue-300' : 'text-purple-300'}`}>{turn.speaker === 'user' ? (currentUser?.name || 'You') : 'Strategist'}:</p>
                                    <p className="text-slate-200 pl-4 border-l-2 border-slate-700 whitespace-pre-wrap">{turn.text}</p>
                                    {turn.toolResult && <AdminToolResultDisplay functionName={turn.toolResult.functionName} result={turn.toolResult.result} />}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <>
                            <VisualizerOrb status={status} />
                            <p className="mt-4 text-slate-300 capitalize text-center min-h-[24px]">
                                {status === 'idle' ? 'Click "Start" to begin' : status}
                            </p>
                        </>
                    )}
                </div>
                <footer className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900 text-center">
                    {status === 'idle' || status === 'error' ? (
                         <Button onClick={() => setIsPermissionModalOpen(true)}>Start Session</Button>
                    ) : (
                        <Button onClick={stopListening} variant="secondary" className="bg-red-900/50 border-red-500/50 text-red-300 hover:bg-red-900/80">Stop</Button>
                    )}
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </footer>
             </div>
             <PermissionModal 
                isOpen={isPermissionModalOpen}
                onClose={() => setIsPermissionModalOpen(false)}
                onContinue={handleStartClick}
                status={permissionStatus}
            />
        </div>
    );
};

export default LiveStrategistAdminView;