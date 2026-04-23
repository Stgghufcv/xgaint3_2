import type { PlayerState } from '../hooks/usePlayerState';
import type { WorldUserMotionPhase, WorldUserPos } from '../worldUserLayout';
import PixelSprite from './PixelSprite';

const STATUS_ZONE: Record<PlayerState['status'], number> = {
  WORKING: 0,
  SOCIALIZING: 1,
  EXPLORING: 2,
};

interface WorldPlayerOverlayProps {
  worldUserPos: WorldUserPos;
  motionPhase: WorldUserMotionPhase;
  playerState: PlayerState;
  statusColor: string;
}

export default function WorldPlayerOverlay({
  worldUserPos,
  motionPhase,
  playerState,
  statusColor,
}: WorldPlayerOverlayProps) {
  const zoneIndex = STATUS_ZONE[playerState.status];
  const fullPresence = zoneIndex >= 1 || playerState.status === 'WORKING';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        opacity: fullPresence ? 1 : 0.48,
        transition: 'opacity 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${worldUserPos.left}%`,
          top: `${worldUserPos.top}%`,
          transform: 'translate(-50%, -100%)',
          /* 点击地面等位移：平滑移动；撸猫路径由 App 内 animate 逐帧驱动，此处关闭 transition 避免双重插值 */
          transition:
            motionPhase === 'petWalk'
              ? 'none'
              : 'left 0.52s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.52s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        <PixelSprite
          variant="user"
          name="You"
          statusColor={statusColor}
          scale={2.2}
          walking={motionPhase === 'petWalk'}
        />
      </div>
    </div>
  );
}
