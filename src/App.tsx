import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useSpring } from 'framer-motion';
import { usePlayerState } from './hooks/usePlayerState';
import StudioZone from './components/scenes/StudioZone';
import LoungeZone from './components/scenes/LoungeZone';
import PlazaZone from './components/scenes/PlazaZone';
import StatusHUD from './components/StatusHUD';
import MochiRoamer from './components/MochiRoamer';
import WorldPlayerOverlay from './components/WorldPlayerOverlay';
import FullScreenWeChatChat from './components/FullScreenWeChatChat';
import type { PlayerStatus } from './hooks/usePlayerState';
import {
  WORLD_USER_INITIAL,
  worldUserPosNearCat,
  worldUserPosFromZonePointer,
  type WorldUserMotionPhase,
} from './worldUserLayout';

const ZONE_STATUS: PlayerStatus[] = ['WORKING', 'SOCIALIZING', 'EXPLORING'];

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    window.setTimeout(resolve, ms);
  });
}

export default function App() {
  const { state, setStatus, transitioning, label, color } = usePlayerState();
  const [messengerActive, setMessengerActive] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [worldUserPos, setWorldUserPos] = useState(WORLD_USER_INITIAL);
  const worldUserPosRef = useRef(WORLD_USER_INITIAL);
  const [worldUserMotionPhase, setWorldUserMotionPhase] = useState<WorldUserMotionPhase>('normal');
  const [mochiPetting, setMochiPetting] = useState(false);
  const mochiPettingRef = useRef(false);
  const [fullscreenChatCharacterId, setFullscreenChatCharacterId] = useState<string | null>(null);
  const [fullscreenChatScrollToMessageIndex, setFullscreenChatScrollToMessageIndex] = useState<number | null>(null);

  const openCharacterChat = useCallback((characterId: string, scrollToMessageIndex?: number) => {
    setFullscreenChatCharacterId(characterId);
    setFullscreenChatScrollToMessageIndex(
      scrollToMessageIndex != null && scrollToMessageIndex >= 0 ? scrollToMessageIndex : null,
    );
  }, []);

  useEffect(() => {
    worldUserPosRef.current = worldUserPos;
  }, [worldUserPos]);

  const placeUserFromZone = (zoneIndex: number) => (localX: number, localY: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setWorldUserPos(worldUserPosFromZonePointer(zoneIndex, localX, localY, vw, vh));
  };

  const rawX = useMotionValue(-window.innerWidth); // Start at Lounge (zone index 1)
  const springX = useSpring(rawX, { stiffness: 280, damping: 30, mass: 0.7 });

  useEffect(() => {
    rawX.set(-state.zoneIndex * window.innerWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.zoneIndex]);

  const handleStatusChange = (status: PlayerStatus) => {
    setStatus(status);
    if (status !== 'SOCIALIZING') setMessengerActive(false);
  };

  const handleTaskClick = (task: string) => {
    setActiveTask(task);
    setStatus('WORKING');
  };

  const handlePetMochi = useCallback(async (catWorldX: number, catWorldY: number) => {
    if (mochiPettingRef.current) return;
    mochiPettingRef.current = true;
    setMochiPetting(true);
    setWorldUserMotionPhase('petWalk');
    try {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const target = worldUserPosNearCat(catWorldX, catWorldY, vw, vh);
      const from = { ...worldUserPosRef.current };
      const dist = Math.hypot(target.left - from.left, target.top - from.top);
      const walkDur = Math.min(7.5, Math.max(0.55, dist / 220));
      await animate(0, 1, {
        duration: walkDur,
        ease: 'linear',
        onUpdate: progress => {
          setWorldUserPos({
            left: Math.round(from.left + (target.left - from.left) * progress),
            top: Math.round(from.top + (target.top - from.top) * progress),
          });
        },
      });
      setWorldUserMotionPhase('petHold');
      await sleep(3000);
    } finally {
      mochiPettingRef.current = false;
      setMochiPetting(false);
      setWorldUserMotionPhase('normal');
    }
  }, []);

  // Swipe gesture support for portrait
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (transitioning) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    // Only register as horizontal swipe if horizontal movement dominates
    if (Math.abs(dx) < 55 || dy > Math.abs(dx) * 0.7) return;
    const nextIdx = dx > 0
      ? Math.min(2, state.zoneIndex + 1)
      : Math.max(0, state.zoneIndex - 1);
    if (nextIdx !== state.zoneIndex) {
      handleStatusChange(ZONE_STATUS[nextIdx]);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'pan-y',
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          width: '300vw',
          height: '100dvh',
          position: 'relative',
          willChange: 'transform',
          x: springX,
        }}
      >
        <div style={{ width: '100vw', height: '100dvh', flexShrink: 0 }}>
          <StudioZone
            playerState={state}
            statusColor={color}
            userInputLocked={mochiPetting}
            onWorldBackgroundClick={placeUserFromZone(0)}
            onOpenCharacterChat={openCharacterChat}
          />
        </div>
        <div style={{ width: '100vw', height: '100dvh', flexShrink: 0 }}>
          <LoungeZone
            playerState={state}
            statusColor={color}
            onMessengerClick={() => setMessengerActive(v => !v)}
            messengerActive={messengerActive}
            userInputLocked={mochiPetting}
            onWorldBackgroundClick={placeUserFromZone(1)}
            onOpenCharacterChat={openCharacterChat}
          />
        </div>
        <div style={{ width: '100vw', height: '100dvh', flexShrink: 0 }}>
          <PlazaZone
            playerState={state}
            statusColor={color}
            onTaskClick={handleTaskClick}
            userInputLocked={mochiPetting}
            onWorldBackgroundClick={placeUserFromZone(2)}
            onOpenCharacterChat={openCharacterChat}
          />
        </div>
        <WorldPlayerOverlay
          worldUserPos={worldUserPos}
          motionPhase={worldUserMotionPhase}
          playerState={state}
          statusColor={color}
        />
        <MochiRoamer pettingActive={mochiPetting} onPetCat={handlePetMochi} />
      </motion.div>

      <StatusHUD
        currentStatus={state.status}
        statusLabel={label}
        statusColor={color}
        onStatusChange={handleStatusChange}
        transitioning={transitioning}
        activeTask={activeTask}
        onDismissTask={() => setActiveTask(null)}
        onOpenCharacterChat={openCharacterChat}
        activeThreadId={fullscreenChatCharacterId}
      />

      <AnimatePresence>
        {fullscreenChatCharacterId && (
          <FullScreenWeChatChat
            key={fullscreenChatCharacterId}
            characterId={fullscreenChatCharacterId}
            scrollToMessageIndex={fullscreenChatScrollToMessageIndex ?? undefined}
            onClose={() => {
              setFullscreenChatCharacterId(null);
              setFullscreenChatScrollToMessageIndex(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
