import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {
    registerForPushNotificationsAsync,
    savePushToken,
    getPushToken,
    addNotificationResponseListener,
    addNotificationReceivedListener,
} from '../services/notifications';

interface NotificationError {
    message: string;
    code?: string;
    timestamp: number;
}

export function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<NotificationError | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        let isMounted = true;

        const initializeNotifications = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Register for push notifications
                const token = await registerForPushNotificationsAsync();

                if (isMounted) {
                    if (token) {
                        setExpoPushToken(token);
                        await savePushToken(token);
                    } else {
                        setError({
                            message: 'Failed to register for push notifications',
                            code: 'REGISTRATION_FAILED',
                            timestamp: Date.now()
                        });
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError({
                        message: err instanceof Error ? err.message : 'Unknown error occurred',
                        code: 'INITIALIZATION_ERROR',
                        timestamp: Date.now()
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeNotifications();

        // Listen for incoming notifications while the app is foregrounded
        notificationListener.current = addNotificationReceivedListener(notification => {
            if (isMounted) {
                setNotification(notification);
                // Clear any previous errors when we successfully receive a notification
                setError(null);
            }
        });

        // Listen for user interactions with notifications
        responseListener.current = addNotificationResponseListener(response => {
            if (isMounted) {
                console.log('Notification response:', response);
                // Handle notification response here
                setError(null);
            }
        });

        return () => {
            isMounted = false;
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    const clearError = () => setError(null);

    return {
        expoPushToken,
        notification,
        error,
        isLoading,
        clearError
    };
} 