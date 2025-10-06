import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MESSAGES, USERS } from '../constants';
import { Message, User } from '../types';
import Card from '../components/ui/Card';
import { PaperAirplaneIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';

const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(MESSAGES);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

    // Get all unique conversation partners
    const partnerIds = React.useMemo(() => {
        if (!user) return [];
        const ids = messages
            .filter(m => m.senderId === user.id || m.receiverId === user.id)
            .map(m => m.senderId === user.id ? m.receiverId : m.senderId);
        return [...new Set(ids)];
    }, [user, messages]);

    // List all users except the current one
    const contactList = USERS.filter(u => u.id !== user?.id);

    useEffect(() => {
        if (!selectedConversation && partnerIds.length > 0) {
            setSelectedConversation(partnerIds[0]);
        } else if (!selectedConversation && contactList.length > 0) {
            setSelectedConversation(contactList[0].id);
        }
    }, [partnerIds, contactList, selectedConversation]);

    const getConversationMessages = () => {
        if (!user || !selectedConversation) return [];
        return messages
            .filter(m => 
                (m.senderId === user.id && m.receiverId === selectedConversation) ||
                (m.senderId === selectedConversation && m.receiverId === user.id)
            )
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };
    
    const getLastMessage = (otherUserId: string): Message | undefined => {
        if (!user) return undefined;
        return messages
            .filter(m => 
                (m.senderId === user.id && m.receiverId === otherUserId) ||
                (m.senderId === otherUserId && m.receiverId === user.id)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    }
    
    const handleSendMessage = (text: string) => {
        if (!user || !selectedConversation || !text.trim()) return;
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            receiverId: selectedConversation,
            text,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-6">Messages</h1>
            <Card className="!p-0">
                <div className="flex h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
                        <div className="p-4 border-b dark:border-gray-700">
                            <input type="text" placeholder="Search contacts..." className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-dark rounded-md text-sm"/>
                        </div>
                        {contactList.map(contact => {
                            const lastMessage = getLastMessage(contact.id);
                            return (
                                <div 
                                    key={contact.id} 
                                    onClick={() => setSelectedConversation(contact.id)}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-light dark:hover:bg-gray-700/50 ${selectedConversation === contact.id ? 'bg-light dark:bg-gray-700/50' : ''}`}
                                >
                                    <img src={contact.avatarUrl} className="h-12 w-12 rounded-full mr-4" alt={contact.name} />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-dark dark:text-light">{contact.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastMessage?.text || 'No messages yet'}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Chat Window */}
                    <div className="w-2/3 flex flex-col">
                        {selectedConversation ? (
                            <>
                                <ChatHeader user={USERS.find(u => u.id === selectedConversation)} />
                                <ChatBody messages={getConversationMessages()} currentUser={user} />
                                <ChatInput onSendMessage={handleSendMessage} />
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
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
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
                <img src={user.avatarUrl} className="h-10 w-10 rounded-full mr-3" alt={user.name} />
                <div>
                    <p className="font-bold text-dark dark:text-light">{user.name}</p>
                    <p className="text-sm text-green-500">Online</p>
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
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
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser?.id ? 'justify-end' : ''}`}>
                    {msg.senderId !== currentUser?.id && (
                        <img src={USERS.find(u => u.id === msg.senderId)?.avatarUrl} className="h-8 w-8 rounded-full" alt="avatar" />
                    )}
                    <div className={`px-4 py-2 rounded-xl max-w-lg ${msg.senderId === currentUser?.id ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-dark text-dark dark:text-light rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                    </div>
                </div>
            ))}
            </div>
            <div ref={endOfMessagesRef} />
        </div>
    );
};

const ChatInput: React.FC<{ onSendMessage: (text: string) => void }> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-dark border-t dark:border-gray-700">
            <div className="flex items-center bg-light dark:bg-gray-700 rounded-full px-4 py-2">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent focus:outline-none dark:text-light"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="text-primary hover:text-secondary p-2 disabled:text-gray-400" disabled={!text.trim()}>
                    <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </div>
        </form>
    );
};

export default MessagesPage;
