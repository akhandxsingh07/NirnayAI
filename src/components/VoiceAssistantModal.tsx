import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, Volume2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { askAssistantQuestion } from '../services/aiService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    businessIdea?: string;
    category?: string;
    margin?: number;
    projectCost?: number;
    loan?: number;
    scheme?: string;
    language?: string;
  };
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Namaste! I am NIRNAY AI advisory assistant. You can speak or ask questions about rural business opportunities, loan structures (₹50,000 margin → ₹5,00,000 project cost), or government scheme guidelines. How can I help?`,
      sources: ['SIH26091 Advisory Model'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = context.language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        if (!event?.results) return;
        const transcript = Array.from(event.results)
          .map((result: any) => result?.[0]?.transcript || '')
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition status:', err.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [context.language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newMsgs: Message[] = [...messages, { role: 'user', text: query.trim() }];
    setMessages(newMsgs);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await askAssistantQuestion(query.trim(), context);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: resp.answer,
          sources: resp.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach advisory engine at this moment. Please check connection or try one of the quick prompts below.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = context.language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickPrompts = [
    'What business can I start with ₹50,000?',
    'Explain my loan in Hindi (ऋण संरचना)',
    'Which scheme fits my project cost?',
    'How does the 6-month moratorium work?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1B16]/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-[#D9B99B]/60 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#4A2F24] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B9825B] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white leading-none">
                  Ask NIRNAY AI
                </h3>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-[#F3E8DC] font-semibold">
                  Voice First
                </span>
              </div>
              <span className="text-[11px] text-[#D9B99B]">
                Hyper-Local Business & Finance Advisory
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#D9B99B] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Speech API Warning if unsupported */}
        {!speechSupported && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-900 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
            <span>
              Voice speech input is not supported in this browser environment. You can use the text input below.
            </span>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FAF7F3]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-[#6B4535] text-white rounded-br-xs'
                    : 'bg-white text-[#2B1B16] border border-[#D9B99B]/50 rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.text}

                {msg.role === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-[#F3E8DC] flex items-center justify-between gap-2">
                    {msg.sources && msg.sources.length > 0 ? (
                      <span className="text-[10px] text-[#8B5E47] italic">
                        Ref: {msg.sources.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8B5E47]">NIRNAY Advisory Rule</span>
                    )}

                    {'speechSynthesis' in window && (
                      <button
                        onClick={() => speakText(msg.text)}
                        title="Read answer aloud"
                        className="p-1 rounded hover:bg-[#FAF7F3] text-[#8B5E47] hover:text-[#2B1B16] transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#8B5E47] p-2 bg-white/70 rounded-xl border border-[#D9B99B]/40 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#6B4535] animate-spin" />
              <span>NIRNAY advisory engine is synthesizing guidance...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggested Queries */}
        <div className="px-4 py-2.5 bg-white border-t border-[#D9B99B]/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E47] block mb-1.5">
            Suggested Prompts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F3] text-[#4A2F24] border border-[#D9B99B]/60 hover:bg-[#F3E8DC] transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Voice & Text Input Section */}
        <div className="p-3.5 bg-white border-t border-[#D9B99B]/40 space-y-2">
          {/* Active Listening Indicator */}
          {isListening && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-700 animate-pulse">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Listening to your voice... speak now
              </span>
              <button
                onClick={toggleListening}
                className="text-[11px] font-extrabold underline hover:text-red-900"
              >
                Stop
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Speak business idea or question'}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-red-600 text-white border-red-700 ring-2 ring-red-300 animate-bounce'
                    : 'bg-[#FAF7F3] text-[#6B4535] border-[#D9B99B] hover:bg-[#F3E8DC]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={speechSupported ? 'Ask NIRNAY or tap mic...' : 'Type your question here...'}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 focus:outline-hidden focus:ring-1 focus:ring-[#6B4535] text-[#2B1B16]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#4A2F24] text-white hover:bg-[#2B1B16] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
