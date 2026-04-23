import { useState, useCallback, useRef } from 'react';

export type PlayerStatus = 'WORKING' | 'SOCIALIZING' | 'EXPLORING';

export interface PlayerState {
  status: PlayerStatus;
  zoneIndex: number; // 0=Studio, 1=Lounge, 2=Plaza
  avatarX: number;   // position within zone (0-1)
  avatarY: number;
}

const STATUS_ZONE_MAP: Record<PlayerStatus, number> = {
  WORKING: 0,
  SOCIALIZING: 1,
  EXPLORING: 2,
};

const STATUS_POSITION_MAP: Record<PlayerStatus, { x: number; y: number }> = {
  WORKING: { x: 0.38, y: 0.52 },
  SOCIALIZING: { x: 0.5, y: 0.58 },
  EXPLORING: { x: 0.48, y: 0.45 },
};

const STATUS_LABELS: Record<PlayerStatus, string> = {
  WORKING: 'Working',
  SOCIALIZING: 'In Lounge',
  EXPLORING: 'Exploring',
};

const STATUS_COLORS: Record<PlayerStatus, string> = {
  WORKING: '#4CAF50',
  SOCIALIZING: '#FF9800',
  EXPLORING: '#2196F3',
};

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>({
    status: 'SOCIALIZING',
    zoneIndex: 1,
    avatarX: STATUS_POSITION_MAP.SOCIALIZING.x,
    avatarY: STATUS_POSITION_MAP.SOCIALIZING.y,
  });
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setStatus = useCallback((status: PlayerStatus) => {
    if (transitioning) return;
    setTransitioning(true);
    const pos = STATUS_POSITION_MAP[status];
    setState({
      status,
      zoneIndex: STATUS_ZONE_MAP[status],
      avatarX: pos.x,
      avatarY: pos.y,
    });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTransitioning(false), 900);
  }, [transitioning]);

  return {
    state,
    setStatus,
    transitioning,
    label: STATUS_LABELS[state.status],
    color: STATUS_COLORS[state.status],
  };
}
