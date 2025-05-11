import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBannerProps {
    onClose?: () => void;
}

export function NotificationBanner({ onClose }: NotificationBannerProps) {
    const { notification, error, clearError } = useNotifications();
    const [visible, setVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (notification || error) {
            setVisible(true);
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setVisible(false);
                if (onClose) onClose();
                if (error) clearError();
            });
        }
    }, [notification, error]);

    if (!visible || (!notification && !error)) return null;

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
        if (error) clearError();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [
                        {
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <BlurView intensity={80} style={[
                styles.blurContainer,
                error && styles.errorContainer
            ]}>
                <View style={styles.content}>
                    {error ? (
                        <>
                            <Text style={[styles.title, styles.errorTitle]}>Error</Text>
                            <Text style={[styles.body, styles.errorBody]}>{error.message}</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.title}>{notification?.request.content.title}</Text>
                            <Text style={styles.body}>{notification?.request.content.body}</Text>
                        </>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                >
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 1000,
    },
    blurContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    errorTitle: {
        color: '#FF0000',
    },
    body: {
        fontSize: 14,
        color: '#666',
    },
    errorBody: {
        color: '#FF0000',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
        lineHeight: 24,
    },
}); 