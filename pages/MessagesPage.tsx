
import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { MESSAGES, USERS } from '../constants';
import { User, Message } from '../types';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();

  const conversations = useMemo(() => {
    if (!user) return [];
    const conversationPartners = new Set<string>();
    MESSAGES.forEach(msg => {
      if (msg.senderId === user.id) conversationPartners.add(msg.receiverId);
      if (msg.receiverId === user.id) conversationPartners.add(msg.senderId);
    });
    return Array.from(conversationPartners)
      .map(partnerId => USERS.find(u => u.id === partnerId))
      .filter((p): p is User => p !== undefined);
  }, [user]);
  
  const [selectedConversation, setSelectedConversation] = useState<User | null>(conversations[0] || null);

  const messages = useMemo(() => {
    if (!user || !selectedConversation) return [];
    return MESSAGES.filter(
      msg =>
        (msg.senderId === user.id && msg.receiverId === selectedConversation.id) ||
        (msg.senderId === selectedConversation.id && msg.receiverId === user.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [user, selectedConversation]);


  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Conversation List */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Messages</h1>
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            className="input-field w-full !pl-10"
          />
        </div>
        <div className="overflow-y-auto pr-2 flex-grow">
          {conversations.map(convoUser => (
            <div
              key={convoUser.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center gap-3 ${selectedConversation?.id === convoUser.id ? 'bg-primary/10' : 'hover:bg-light dark:hover:bg-gray-700/50'}`}
              onClick={() => setSelectedConversation(convoUser)}
            >
                <img src={convoUser.avatarUrl} alt={convoUser.name} className="h-10 w-10 rounded-full" />
                <div>
                    <h3 className="font-semibold text-dark dark:text-light">{convoUser.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Last message text...</p>
                </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="lg:col-span-2 flex flex-col">
        {selectedConversation ? (
          <Card className="flex-grow flex flex-col">
            <div className="border-b dark:border-gray-700 pb-3 mb-4">
                <h2 className="text-xl font-bold text-dark dark:text-light">{selectedConversation.name}</h2>
                <p className="text-sm text-gray-500">{selectedConversation.role}</p>
            </div>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4">
                {messages.map(msg => (
                     <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user.id ? 'justify-end' : ''}`}>
                        {msg.senderId !== user.id && <img src={selectedConversation.avatarUrl} className="h-6 w-6 rounded-full" />}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.senderId === user.id ? 'bg-primary text-white rounded-br-none' : 'bg-light dark:bg-gray-700 rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t dark:border-gray-700">
                <div className="relative">
                    <input type="text" placeholder="Type a message..." className="input-field w-full pr-12"/>
                    <Button size="sm" className="!absolute top-1/2 right-2 -translate-y-1/2"><PaperAirplaneIcon className="h-5 w-5"/></Button>
                </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start chatting.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
