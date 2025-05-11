import React, { createContext, useContext, useEffect, useState } from 'react';
import { realtimeUpdateService } from '../services/realtimeUpdates';
import { useNotifications } from '../hooks/useNotifications';

interface RealtimeContextType {
    updates: {
        courses: any[];
        wallet: any;
        profile: any;
        notifications: any[];
    };
    refreshUpdates: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const [updates, setUpdates] = useState<RealtimeContextType['updates']>({
        courses: [],
        wallet: null,
        profile: null,
        notifications: [],
    });

    const { expoPushToken } = useNotifications();

    useEffect(() => {
        // Subscribe to course updates
        const courseHandler = {
            onUpdate: (data: any) => {
                setUpdates(prev => ({
                    ...prev,
                    courses: Array.isArray(data) ? data : [data],
                }));
            },
        };

        // Subscribe to wallet updates
        const walletHandler = {
            onUpdate: (data: any) => {
                setUpdates(prev => ({
                    ...prev,
                    wallet: data,
                }));
            },
        };

        // Subscribe to profile updates
        const profileHandler = {
            onUpdate: (data: any) => {
                setUpdates(prev => ({
                    ...prev,
                    profile: data,
                }));
            },
        };

        // Subscribe to notifications
        const notificationHandler = {
            onUpdate: (data: any) => {
                setUpdates(prev => ({
                    ...prev,
                    notifications: Array.isArray(data) ? data : [data],
                }));
            },
        };

        // Subscribe to all paths
        realtimeUpdateService.subscribe('courses', courseHandler);
        realtimeUpdateService.subscribe('wallet', walletHandler);
        realtimeUpdateService.subscribe('profile', profileHandler);
        realtimeUpdateService.subscribe('notifications', notificationHandler);

        // Cleanup subscriptions
        return () => {
            realtimeUpdateService.unsubscribe('courses', courseHandler);
            realtimeUpdateService.unsubscribe('wallet', walletHandler);
            realtimeUpdateService.unsubscribe('profile', profileHandler);
            realtimeUpdateService.unsubscribe('notifications', notificationHandler);
        };
    }, [expoPushToken]);

    const refreshUpdates = () => {
        // Trigger a refresh of all updates
        realtimeUpdateService.triggerUpdate('courses', []);
        realtimeUpdateService.triggerUpdate('wallet', null);
        realtimeUpdateService.triggerUpdate('profile', null);
        realtimeUpdateService.triggerUpdate('notifications', []);
    };

    return (
        <RealtimeContext.Provider value={{ updates, refreshUpdates }}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    const context = useContext(RealtimeContext);
    if (context === undefined) {
        throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
} 