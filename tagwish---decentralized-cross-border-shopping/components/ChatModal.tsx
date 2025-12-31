
import React, { useState } from 'react';
import { Wish, User } from '../types';

interface ChatModalProps {
  wish: Wish;
  user: User;
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ wish, user, onClose, onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-3">
          <img src={wish.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
          <div>
            <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{wish.itemName}</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Chat</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {wish.chat?.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.senderId === user.id 
                ? 'bg-[#FF6B6B] text-white rounded-tr-none shadow-md' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
              <p className={`text-[9px] mt-1 opacity-60 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {(!wish.chat || wish.chat.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium">Start the conversation</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t">
        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            className="p-3 bg-[#FF6B6B] text-white rounded-xl shadow-lg hover:bg-[#ff5252] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
