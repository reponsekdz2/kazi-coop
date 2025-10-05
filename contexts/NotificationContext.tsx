import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ACTIVITY_LOG } from '../constants';
import { ActivityLog } from '../types';

interface Notification extends ActivityLog {
    read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // In a real app, 'read' status would be persisted
    const [notifications, setNotifications] = useState<Notification[]>(() => 
        ACTIVITY_LOG.map(log => ({ ...log, read: false }))
    );

    const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};