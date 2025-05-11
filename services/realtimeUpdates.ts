import { scheduleLocalNotification } from './notifications';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UpdateHandler {
    onUpdate: (data: any) => void;
    onError?: (error: any) => void;
}

interface UpdateData {
    path: string;
    payload: any;
    title?: string;
    message?: string;
}

interface RealtimeConfig {
    wsEndpoint?: string;
    useWebSocket: boolean;
    pollingInterval: number;
    maxReconnectAttempts: number;
    reconnectTimeout: number;
}

class RealtimeUpdateService {
    private static instance: RealtimeUpdateService;
    private updateHandlers: Map<string, UpdateHandler[]> = new Map();
    private isConnected: boolean = false;
    private socket: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private pollingInterval: ReturnType<typeof setInterval> | null = null;
    private config: RealtimeConfig;
    private isPolling: boolean = false;

    private constructor() {
        // Default configuration
        this.config = {
            useWebSocket: true,
            pollingInterval: 30000,
            maxReconnectAttempts: 5,
            reconnectTimeout: 5000,
            wsEndpoint: '/socket.io/?EIO=4&transport=websocket'
        };
    }

    static getInstance(): RealtimeUpdateService {
        if (!RealtimeUpdateService.instance) {
            RealtimeUpdateService.instance = new RealtimeUpdateService();
        }
        return RealtimeUpdateService.instance;
    }

    configure(config: Partial<RealtimeConfig>) {
        this.config = { ...this.config, ...config };
        console.log('Realtime service configured:', this.config);

        if (this.isConnected) {
            this.stopListening();
            this.startListening();
        }
    }

    subscribe(path: string, handler: UpdateHandler) {
        if (!this.updateHandlers.has(path)) {
            this.updateHandlers.set(path, []);
        }
        this.updateHandlers.get(path)?.push(handler);

        if (!this.isConnected) {
            this.startListening();
        }
    }

    unsubscribe(path: string, handler: UpdateHandler) {
        const handlers = this.updateHandlers.get(path);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
            if (handlers.length === 0) {
                this.updateHandlers.delete(path);
            }
        }

        if (this.updateHandlers.size === 0) {
            this.stopListening();
        }
    }

    private startListening() {
        this.isConnected = true;

        if (this.config.useWebSocket) {
            this.initializeWebSocket();
        } else {
            this.startPolling();
        }
    }

    private initializeWebSocket() {
        try {
            const apiUrl = Constants.expoConfig?.extra?.API_URL || '';
            // Remove trailing slash if present
            const baseUrl = apiUrl.replace(/\/$/, '');
            // Extract the base domain without the API path
            const domain = baseUrl.split('/api/v1')[0];
            const wsUrl = `${domain}/socket.io/?EIO=4&transport=websocket`;

            console.log('Attempting WebSocket connection to:', wsUrl);

            // Get the auth token from AsyncStorage
            AsyncStorage.getItem('user').then(userData => {
                if (!userData) {
                    console.error('No user data found for WebSocket authentication');
                    this.handleConnectionError();
                    return;
                }

                const user = JSON.parse(userData);
                const authToken = user.token; // Assuming token is stored in user object

                if (!authToken) {
                    console.error('No auth token found for WebSocket connection');
                    this.handleConnectionError();
                    return;
                }

                // Create WebSocket with auth token
                this.socket = new WebSocket(wsUrl);
                // Add auth token to the WebSocket URL
                const wsUrlWithAuth = `${wsUrl}&token=${authToken}`;
                this.socket = new WebSocket(wsUrlWithAuth);

                this.socket.onopen = () => {
                    console.log('WebSocket connected successfully');
                    this.reconnectAttempts = 0;
                    this.isPolling = false;
                };

                this.socket.onmessage = (event) => {
                    try {
                        const data: UpdateData = JSON.parse(event.data);
                        console.log('WebSocket message received:', data);
                        this.handleUpdate(data.path, data.payload);

                        if (data.title && data.message) {
                            scheduleLocalNotification(data.title, data.message, data.payload);
                        }
                    } catch (error) {
                        console.error('Error handling WebSocket message:', error);
                    }
                };

                this.socket.onerror = (error) => {
                    console.error('WebSocket error details:', {
                        error,
                        url: wsUrl,
                        reconnectAttempt: this.reconnectAttempts,
                        maxAttempts: this.config.maxReconnectAttempts
                    });
                    this.handleConnectionError();
                };

                this.socket.onclose = (event) => {
                    console.log('WebSocket closed:', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean
                    });
                    this.handleConnectionError();
                };
            }).catch(error => {
                console.error('Error getting user data for WebSocket:', error);
                this.handleConnectionError();
            });
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
            this.handleConnectionError();
        }
    }

    private handleConnectionError() {
        this.isConnected = false;
        if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
            // Use exponential backoff for reconnection attempts
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            setTimeout(() => {
                this.initializeWebSocket();
            }, delay);
        } else {
            console.log('Max WebSocket reconnection attempts reached, switching to polling');
            this.config.useWebSocket = false;
            this.startPolling();
        }
    }

    private async fetchUpdates() {
        try {
            const response = await axios.get(`${Constants.expoConfig?.extra?.API_URL}/notifications/getNotifications`);
            const updates = response.data;

            if (Array.isArray(updates)) {
                console.log('Polling updates received:', updates);
                updates.forEach((update: UpdateData) => {
                    this.handleUpdate(update.path, update.payload);

                    if (update.title && update.message) {
                        scheduleLocalNotification(update.title, update.message, update.payload);
                    }
                });
            }
        } catch (error) {
            console.error('Error polling for updates:', error);
            // If polling fails, try WebSocket again
            if (!this.config.useWebSocket && !this.isPolling) {
                console.log('Polling failed, attempting WebSocket connection');
                this.config.useWebSocket = true;
                this.reconnectAttempts = 0;
                this.initializeWebSocket();
            }
        }
    }

    private startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }

        console.log('Starting HTTP polling fallback');
        this.isPolling = true;

        // Fetch immediately
        this.fetchUpdates();

        // Then set up interval
        this.pollingInterval = setInterval(() => {
            this.fetchUpdates();
        }, this.config.pollingInterval);
    }

    private stopListening() {
        this.isConnected = false;
        this.isPolling = false;

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    private handleUpdate(path: string, data: any) {
        const handlers = this.updateHandlers.get(path);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler.onUpdate(data);
                } catch (error) {
                    if (handler.onError) {
                        handler.onError(error);
                    }
                }
            });
        }
    }

    triggerUpdate(path: string, data: any) {
        this.handleUpdate(path, data);
    }
}

export const realtimeUpdateService = RealtimeUpdateService.getInstance(); 