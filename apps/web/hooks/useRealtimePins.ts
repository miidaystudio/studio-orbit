'use client';

import { useEffect, useState } from 'react';
import { StagingPin } from '@/types/staging';

export function useRealtimePins(initialPins: StagingPin[], assetId: string = 'global') {
  const [pins, setPins] = useState<StagingPin[]>(initialPins);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`/api/realtime/sse?assetId=${encodeURIComponent(assetId)}`);

      eventSource.addEventListener('connected', () => {
        setIsConnected(true);
      });

      eventSource.addEventListener('pin_added', (e: MessageEvent) => {
        try {
          const newPin: StagingPin = JSON.parse(e.data);
          setPins((prev) => [...prev.filter((p) => p.id !== newPin.id), newPin]);
        } catch (err) {
          console.error('Failed to parse realtime pin update:', err);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.warn('Realtime SSE unavailable, falling back to local state:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [assetId]);

  return { pins, setPins, isConnected };
}
