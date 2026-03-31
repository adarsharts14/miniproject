import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

const TeacherChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Teacher Assistant. I can help you plan your syllabus and schedule classes. How can I help today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // API call to our backend chatbot endpoint
      const response = await api.post('/chat/ask', { prompt: userMessage.text });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the server. Please try again later.",
        sender: 'bot'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-fade-in group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header */}
          <div className="relative z-10 p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-2 rounded-xl shadow-inner border border-blue-500/30">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold flex items-center shadow-black/50 drop-shadow-md">
                Teacher Assistant
                <span className="ml-2 flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="relative z-10 flex-1 h-96 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600/80 text-white rounded-br-sm border border-blue-500/30 font-medium'
                      : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5 backdrop-blur-sm'
                  }`}
                  style={{ textShadow: msg.sender === 'user' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none' }}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/10 rounded-2xl p-4 rounded-bl-sm border border-white/5 shadow-lg flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="relative z-10 p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about schedule, syllabus..."
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-105'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center p-4 rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all duration-300 hover:scale-110 border border-blue-400/30"
        >
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 group-hover:animate-ping" />
          <MessageSquare className="h-6 w-6 relative z-10 drop-shadow-md" />
        </button>
      )}
    </div>
  );
};

export default TeacherChatbot;
