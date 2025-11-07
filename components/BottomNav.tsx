import React, { useState, useRef, useEffect } from 'react';
import type { Message, User } from '../types';

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentUser: User;
  allUsers: User[];
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, currentUser, allUsers }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const getUser = (id: number) => allUsers.find(u => u.id === id);

  return (
    <div className="bg-slate-800 rounded-2xl p-4 mt-4">
      <h3 className="text-lg font-bold text-white mb-4">Chat</h3>
      <div className="h-64 overflow-y-auto space-y-4 pr-2">
        {messages.map(message => {
          const sender = getUser(message.senderId);
          const isMe = message.senderId === currentUser.id;
          return (
            <div key={message.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              {sender && <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full object-cover" />}
              <div className={`p-3 rounded-xl max-w-[80%] ${isMe ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                <p className="text-sm text-white break-words">{message.text}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'} text-right`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Chat message input"
        />
        <button type="submit" className="bg-blue-600 text-white font-bold p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-600" aria-label="Send message" disabled={!text.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
