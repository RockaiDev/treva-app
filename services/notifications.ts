import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

// Register for push notifications with retry logic
export async function registerForPushNotificationsAsync(retryCount = 3): Promise<string | undefined> {
    let token;
    let attempts = 0;

    while (attempts < retryCount) {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    throw new Error('Failed to get push notification permissions');
                }

                token = (await Notifications.getExpoPushTokenAsync({
                    projectId: process.env.EXPO_PROJECT_ID // Add your Expo project ID here
                })).data;

                // If we got here, registration was successful
                break;
            } else {
                throw new Error('Must use physical device for Push Notifications');
            }
        } catch (error) {
            attempts++;
            console.error(`Push notification registration attempt ${attempts} failed:`, error);

            if (attempts === retryCount) {
                console.error('All push notification registration attempts failed');
                return undefined;
            }

            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
    }

    return token;
}

// Save the push token to AsyncStorage with validation
export async function savePushToken(token: string) {
    if (!token) {
        console.error('Attempted to save invalid push token');
        return;
    }

    try {
        await AsyncStorage.setItem('pushToken', token);
        console.log('Push token saved successfully');
    } catch (error) {
        console.error('Error saving push token:', error);
        // Attempt to retry once
        try {
            await AsyncStorage.setItem('pushToken', token);
        } catch (retryError) {
            console.error('Failed to save push token after retry:', retryError);
        }
    }
}

// Get the saved push token
export async function getPushToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('pushToken');
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
}

// Request notification permissions
export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
    }

    return true;
}

// Schedule a local notification with validation
export async function scheduleLocalNotification(
    title: string,
    message: string,
    data: any = {}
) {
    if (!title || !message) {
        console.error('Invalid notification parameters:', { title, message });
        return;
    }

    try {
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body: message,
                data,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // Show immediately
        });
        console.log('Notification scheduled successfully:', notificationId);
        return notificationId;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        throw error; // Re-throw to allow caller to handle the error
    }
}

// Cancel all notifications
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
}

// Remove notification listeners
export function removeNotificationSubscription(subscription: Notifications.Subscription) {
    subscription.remove();
}

// Add notification response listener
export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

// Add notification received listener
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(callback);
} 