import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { io } from 'socket.io-client';
import API from '../services/api';

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [reply, setReply] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
    try {
      socketRef.current = io('/', { transports: ['websocket', 'polling'] });
      socketRef.current.emit('join-admin');
      socketRef.current.on('new-message', (data) => {
        if (selectedChat?.sessionId === data.sessionId) {
          setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, data.message] } : prev);
        }
        fetchChats();
      });
    } catch {}
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedChat]);

  const fetchChats = async () => {
    try { const { data } = await API.get('/chat'); setChats(data.chats); } catch {
      setChats([
        { _id: '1', sessionId: 'chat-1', status: 'active', user: { name: 'Ram', email: 'ram@example.com' }, messages: [
          { sender: 'user', content: 'Hello, I need help with my internet', timestamp: new Date().toISOString() },
          { sender: 'bot', content: 'Hello! How can I help you?', timestamp: new Date().toISOString() },
        ]},
      ]);
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !selectedChat) return;
    try {
      await API.post('/chat/admin-reply', { sessionId: selectedChat.sessionId, content: reply });
      setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, { sender: 'admin', content: reply, timestamp: new Date() }] }));
      setReply('');
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Chats</h1>
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button key={chat._id} onClick={() => setSelectedChat(chat)} className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50 ${selectedChat?._id === chat._id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white"><FiUser className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{chat.user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-500 truncate">{chat.messages?.[chat.messages.length - 1]?.content || 'No messages'}</p>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${chat.status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white"><FiUser className="w-5 h-5" /></div>
                  <div><p className="font-semibold text-gray-900">{selectedChat.user?.name || 'Guest'}</p><p className="text-sm text-green-500">Online</p></div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedChat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{selectedChat.status}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedChat.messages?.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-gray-100 text-gray-900 rounded-bl-md' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input value={reply} onChange={e => setReply(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendReply()} placeholder="Type a reply..." className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={sendReply} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl"><FiSend className="w-5 h-5" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center"><FiMessageSquare className="w-12 h-12 mx-auto mb-3" /><p>Select a conversation to start chatting</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
