import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Bot, Loader2, Minimize2 } from 'lucide-react';
import { db } from '../lib/firebaseClient';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { User as UserType } from '../types';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: any;
}

interface ChatWidgetProps {
  user: UserType | null;
}

export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create a unique session ID for the chat
  const [sessionId] = useState(() => {
    const saved = sessionStorage.getItem('fh-chat-session-id');
    if (saved) return saved;
    const newId = user?.id || `anon-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('fh-chat-session-id', newId);
    return newId;
  });

  useEffect(() => {
    if (!isOpen) return;

    const messagesRef = collection(db, 'chats', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save user message to Firestore
      const messagesRef = collection(db, 'chats', sessionId, 'messages');
      await addDoc(messagesRef, {
        role: 'user',
        text: userMsg,
        timestamp: serverTimestamp()
      });

      // 2. Call Gemini for response
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const systemInstruction = `Bạn là trợ lý ảo chuyên gia của Fruit Haven - cửa hàng trái cây hữu cơ tươi sạch hàng đầu. 
      Nhiệm vụ của bạn là:
      - Tư vấn các loại trái cây phù hợp với nhu cầu sức khỏe của khách hàng.
      - Cung cấp thông tin về nguồn gốc, cách bảo quản và lợi ích của các loại trái cây.
      - Hỗ trợ khách hàng về các chính sách giao hàng, đổi trả và tích điểm.
      - Luôn giữ thái độ thân thiện, chuyên nghiệp và nhiệt tình.
      - Nếu khách hàng hỏi về đơn hàng, hãy hướng dẫn họ vào mục "Tra cứu đơn hàng".
      - Các chi nhánh của chúng tôi: Hải Phòng (Trụ sở chính), Hà Nội, TP. Hồ Chí Minh.
      - Tỉ lệ quy đổi điểm: 1 điểm = 1đ giảm giá đơn hàng.
      - Ngôn ngữ: Tiếng Việt.`;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction },
        history: history.length > 0 ? history : undefined
      });

      const result = await chat.sendMessage({ message: userMsg });
      const aiResponse = result.text;

      // 3. Save AI response to Firestore
      await addDoc(messagesRef, {
        role: 'assistant',
        text: aiResponse,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("Chat error:", error);
      // Fallback message if AI fails
      const messagesRef = collection(db, 'chats', sessionId, 'messages');
      await addDoc(messagesRef, {
        role: 'assistant',
        text: "Xin lỗi, tôi đang gặp một chút trục trặc kỹ thuật. Bạn vui lòng thử lại sau giây lát hoặc liên hệ hotline 0397 225 824 để được hỗ trợ ngay lập tức nhé!",
        timestamp: serverTimestamp()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[32px] shadow-2xl border border-brand-primary/10 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-brand-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold leading-tight">Fruit Haven Bot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Minimize2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow p-4 overflow-y-auto space-y-4 bg-brand-background/30"
            >
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-10 px-6 space-y-4">
                  <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                    <MessageCircle size={32} />
                  </div>
                  <h4 className="font-serif font-bold text-brand-primary text-lg">Chào bạn!</h4>
                  <p className="text-sm text-zinc-500 italic">Mình là Robot hỗ trợ từ Fruit Haven. Bạn cần tư vấn về loại trái cây nào hay hỗ trợ đơn hàng không?</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-zinc-100 text-zinc-400" : "bg-brand-primary text-white"
                  )}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-brand-primary text-white rounded-br-none" 
                      : "bg-white text-zinc-700 border border-brand-primary/5 rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 mr-auto max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="p-3.5 bg-white text-zinc-400 rounded-2xl rounded-bl-none border border-brand-primary/5 shadow-sm inline-flex items-center gap-2 italic text-xs">
                    <Loader2 size={14} className="animate-spin" />
                    Đang tìm câu trả lời tốt nhất cho bạn...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-brand-primary/10 flex gap-2">
              <input 
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow px-4 py-2.5 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button / Minimized Bar */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "flex items-center gap-3 bg-brand-primary text-white p-4 rounded-full shadow-2xl transition-all duration-300",
          isOpen && !isMinimized ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={20} />}
        </div>
        <span className="font-bold text-sm uppercase tracking-widest mr-2">
          {isOpen && isMinimized ? "Tiếp tục tư vấn" : "Tư vấn trực tuyến"}
        </span>
      </motion.button>
    </div>
  );
}
