import { useEffect, useState } from 'react';
import { realtimeUpdateService } from '../services/realtimeUpdates';

export function useRealtimeUpdates<T>(path: string) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const handler = {
            onUpdate: (newData: T) => {
                setData(newData);
                setError(null);
            },
            onError: (err: Error) => {
                setError(err);
            },
        };

        // Subscribe to updates
        realtimeUpdateService.subscribe(path, handler);

        // Cleanup subscription on unmount
        return () => {
            realtimeUpdateService.unsubscribe(path, handler);
        };
    }, [path]);

    return { data, error };
} 