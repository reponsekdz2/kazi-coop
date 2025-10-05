import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MESSAGES, USERS } from '../constants';
import { Message, User } from '../types';
import Card from '../components/ui/Card';
import { PaperAirplaneIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    
    // Create a set of conversation partners
    const conversationPartners = [...new Set(
        MESSAGES
            .filter(m => m.senderId === user?.id || m.receiverId === user?.id)
            .map(m => m.senderId === user?.id ? m.receiverId : m.senderId)
    )];

    const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationPartners[0] || null);

    const getOtherUser = (otherUserId: string) => {
        return USERS.find(u => u.id === otherUserId);
    };

    const getConversationMessages = () => {
        return MESSAGES
            .filter(m => 
                (m.senderId === user?.id && m.receiverId === selectedConversation) ||
                (m.senderId === selectedConversation && m.receiverId === user?.id)
            )
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };
    
    const getLastMessage = (otherUserId: string) => {
        return MESSAGES
            .filter(m => 
                (m.senderId === user?.id && m.receiverId === otherUserId) ||
                (m.senderId === otherUserId && m.receiverId === user?.id)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark mb-6">Messages</h1>
            <Card className="!p-0">
                <div className="flex h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r overflow-y-auto">
                        <div className="p-4 border-b">
                            <input type="text" placeholder="Search messages..." className="w-full px-3 py-2 border rounded-md text-sm"/>
                        </div>
                        {conversationPartners.map(partnerId => {
                            const partner = getOtherUser(partnerId);
                            const lastMessage = getLastMessage(partnerId);
                            if (!partner) return null;
                            return (
                                <div 
                                    key={partnerId} 
                                    onClick={() => setSelectedConversation(partnerId)}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-light ${selectedConversation === partnerId ? 'bg-light' : ''}`}
                                >
                                    <img src={partner.avatarUrl} className="h-12 w-12 rounded-full mr-4" alt={partner.name} />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-dark">{partner.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{lastMessage?.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Chat Window */}
                    <div className="w-2/3 flex flex-col">
                        {selectedConversation ? (
                            <>
                                <ChatHeader user={getOtherUser(selectedConversation)} />
                                <ChatBody messages={getConversationMessages()} currentUser={user} />
                                <ChatInput />
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a conversation to start chatting.
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ChatHeader: React.FC<{ user: User | undefined }> = ({ user }) => {
    if(!user) return null;
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
                <img src={user.avatarUrl} className="h-10 w-10 rounded-full mr-3" alt={user.name} />
                <div>
                    <p className="font-bold text-dark">{user.name}</p>
                    <p className="text-sm text-green-500">Online</p>
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

const ChatBody: React.FC<{ messages: Message[], currentUser: User | null }> = ({ messages, currentUser }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser?.id ? 'justify-end' : ''}`}>
                    {msg.senderId !== currentUser?.id && (
                        <img src={USERS.find(u => u.id === msg.senderId)?.avatarUrl} className="h-8 w-8 rounded-full" alt="avatar" />
                    )}
                    <div className={`px-4 py-2 rounded-xl max-w-lg ${msg.senderId === currentUser?.id ? 'bg-primary text-white rounded-br-none' : 'bg-white text-dark rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                    </div>
                </div>
            ))}
            </div>
            <div ref={endOfMessagesRef} />
        </div>
    );
};

const ChatInput: React.FC = () => {
    return (
        <div className="p-4 bg-white border-t">
            <div className="flex items-center bg-light rounded-full px-4 py-2">
                <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent focus:outline-none" />
                <button className="text-primary hover:text-secondary p-2">
                    <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default MessagesPage;
