import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import PixelSprite from '../PixelSprite';
import type { PlayerState } from '../../hooks/usePlayerState';
import { zoneBleedBackgroundLayer } from '../../zoneBleedBackground';

interface PlazaZoneProps {
  playerState: PlayerState;
  statusColor: string;
  userInputLocked: boolean;
  zoneNavLocked: boolean;
  onWorldBackgroundClick: (localX: number, localY: number, zoneInnerHeightPx: number) => void;
  onOpenCharacterChat: (characterId: string) => void;
  onNavigateToZone: (zoneIndex: 0 | 1 | 2) => void;
}

/** 布局坐标系最大宽（略大于最右装饰） */
const PLAZA_LAYOUT_W = 402;
/** 布局坐标系最大高（草地 y=728 + 高 24） */
const PLAZA_LAYOUT_H = 752;

/** Studio 内 NPC（如 Orion）的 PixelSprite scale；Plaza 内对齐其屏幕身高 */
const PLAZA_NPC_BASE_SCALE = 2.2;
/** 相对 Studio 略放大一点，户外场景更易辨认 */
const PLAZA_READABILITY_MUL = 1.05;
/** 舞台内人物与物件整体上移（布局坐标 px） */
const PLAZA_SCENE_NUDGE_UP_PX = 200;

function PixelTree({ x, y, size = 1, boost = 1 }: { x: number; y: number; size?: number; boost?: number }) {
  const w = 40 * size * boost,
    h = 56 * size * boost;
  return (
    <svg
      className="sprite"
      width={w}
      height={h}
      viewBox="0 0 20 28"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="8" y="20" width="4" height="8" fill="#8B6040" />
      <rect x="9" y="20" width="2" height="8" fill="#A07040" />
      <rect x="4" y="14" width="12" height="8" fill="#2ECC71" rx="2" />
      <rect x="2" y="8" width="16" height="9" fill="#27AE60" rx="2" />
      <rect x="4" y="2" width="12" height="9" fill="#58D68D" rx="2" />
      <rect x="6" y="0" width="8" height="5" fill="#82E0AA" rx="2" />
      <rect x="5" y="4" width="2" height="2" fill="#A9DFBF" opacity="0.6" />
      <rect x="13" y="10" width="2" height="2" fill="#A9DFBF" opacity="0.4" />
      <rect x="6" y="16" width="2" height="2" fill="#A9DFBF" opacity="0.5" />
    </svg>
  );
}

function PixelPond({ x, y, boost = 1 }: { x: number; y: number; boost?: number }) {
  const bw = 120 * boost,
    bh = 60 * boost;
  return (
    <svg
      className="sprite"
      width={bw}
      height={bh}
      viewBox="0 0 60 30"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="30" cy="16" rx="28" ry="14" fill="#5DADE2" opacity="0.8" />
      <ellipse cx="30" cy="16" rx="24" ry="11" fill="#85C1E9" opacity="0.5" />
      <rect x="18" y="12" width="10" height="2" fill="#AED6F1" opacity="0.6" rx="1" />
      <rect x="32" y="16" width="8" height="2" fill="#AED6F1" opacity="0.4" rx="1" />
      <ellipse cx="20" cy="18" rx="4" ry="2" fill="#27AE60" opacity="0.8" />
      <ellipse cx="40" cy="14" rx="3" ry="1.5" fill="#2ECC71" opacity="0.7" />
      <rect x="19" y="17" width="1" height="1" fill="#E74C3C" />
      <rect x="2" y="28" width="4" height="2" fill="#27AE60" />
      <rect x="54" y="28" width="4" height="2" fill="#27AE60" />
      <rect x="28" y="29" width="4" height="1" fill="#27AE60" />
    </svg>
  );
}

function PixelBench({ x, y, flip = false, boost = 1 }: { x: number; y: number; flip?: boolean; boost?: number }) {
  const bw = 70 * boost,
    bh = 36 * boost;
  return (
    <svg
      className="sprite"
      width={bw}
      height={bh}
      viewBox="0 0 35 18"
      style={{ position: 'absolute', left: x, top: y, transform: flip ? 'scaleX(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="7" width="31" height="3" fill="#A07040" />
      <rect x="2" y="10" width="31" height="2" fill="#C8935A" />
      <rect x="2" y="2" width="31" height="2" fill="#A07040" />
      <rect x="2" y="4" width="31" height="2" fill="#C8935A" />
      <rect x="4" y="12" width="3" height="6" fill="#7B5030" />
      <rect x="28" y="12" width="3" height="6" fill="#7B5030" />
      <rect x="3" y="17" width="5" height="1" fill="#5A3820" />
      <rect x="27" y="17" width="5" height="1" fill="#5A3820" />
    </svg>
  );
}

function PixelGrass({ x, y, width, boost = 1 }: { x: number; y: number; width: number; boost?: number }) {
  const blades = Math.floor(width / 8);
  const w = width * boost,
    gh = 24 * boost;
  return (
    <svg
      className="sprite"
      width={w}
      height={gh}
      viewBox={`0 0 ${Math.round(width / 2)} 12`}
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: blades }, (_, i) => {
        const bx = i * 4;
        const h = 4 + (i % 3) * 2;
        const shade = i % 2 === 0 ? '#27AE60' : '#2ECC71';
        return <rect key={i} x={bx} y={12 - h} width="2" height={h} fill={shade} rx="1" />;
      })}
    </svg>
  );
}

export default function PlazaZone({
  playerState: _playerState,
  statusColor: _statusColor,
  userInputLocked,
  zoneNavLocked,
  onWorldBackgroundClick,
  onOpenCharacterChat,
  onNavigateToZone,
}: PlazaZoneProps) {
  const [plazaScale, setPlazaScale] = useState(1);
  const stageWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = stageWrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w < 8) return;
      // 仅按宽度适配整舞台，避免 h/752 把人物与道具压得过小（仍只影响 Plaza 本文件内舞台）
      setPlazaScale(Math.min(1, w / PLAZA_LAYOUT_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleStageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (userInputLocked || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a, [role="dialog"], [role="button"]')) return;
      const rect = e.currentTarget.getBoundingClientRect();
      onWorldBackgroundClick(e.clientX - rect.left, e.clientY - rect.top, rect.height);
    },
    [onWorldBackgroundClick, userInputLocked],
  );

  const plazaGradient = 'linear-gradient(180deg, #C8E6C9 0%, #E6F4EA 40%, #A5D6A7 100%)';

  // 抵消舞台 scale(plazaScale)：屏幕上身形 ≈ Studio Orion（24×2.2）；窄屏原先被 Math.min(3.4,…) 截断会仍偏小
  const p = Math.max(plazaScale, 0.2);
  const rawBoost = PLAZA_READABILITY_MUL / p;
  const maxBoost = 5.2 / PLAZA_NPC_BASE_SCALE;
  const contentBoost = plazaScale >= 0.998 ? 1 : Math.min(maxBoost, rawBoost);
  const npcSpriteScale = Math.min(5.2, PLAZA_NPC_BASE_SCALE * contentBoost);
  const liftPx =
    contentBoost > 1.012 ? Math.min(58, Math.round(12 + (contentBoost - 1) * 52)) : 0;

  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        minHeight: 0,
        position: 'relative',
        overflow: 'visible',
        isolation: 'isolate',
      }}
    >
      <div aria-hidden style={zoneBleedBackgroundLayer(plazaGradient)} />
      <div
        ref={stageWrapRef}
        role="presentation"
        onClick={handleStageClick}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          // 勿 hidden：人物/道具经 scale+boost 后会超出可视盒，hidden 会在底部裁出「蒙版」感
          overflow: 'visible',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <button
          type="button"
          aria-label="前往 Lounge"
          disabled={zoneNavLocked}
          onClick={e => {
            e.stopPropagation();
            onNavigateToZone(1);
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: '28%',
            width: 46,
            height: '42%',
            zIndex: 6,
            border: 'none',
            margin: 0,
            padding: 0,
            cursor: zoneNavLocked ? 'not-allowed' : 'pointer',
            WebkitTapHighlightColor: 'transparent',
            background: 'linear-gradient(270deg, transparent, rgba(237,232,224,0.35))',
            borderRight: '3px solid #C8B89A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="zone-badge" style={{ writingMode: 'vertical-rl', opacity: 0.35, transform: 'rotate(180deg)' }}>
            ← Lounge
          </span>
        </button>
        <div
          style={{
            width: PLAZA_LAYOUT_W,
            height: PLAZA_LAYOUT_H,
            position: 'relative',
            flexShrink: 0,
            transform: `translateY(-${liftPx}px) scale(${plazaScale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* ── Trees — clustered left & right ── */}
          <PixelTree x={8} y={310 - PLAZA_SCENE_NUDGE_UP_PX} size={1.2} boost={contentBoost} />
          <PixelTree x={46} y={385 - PLAZA_SCENE_NUDGE_UP_PX} size={0.9} boost={contentBoost} />
          <PixelTree x={300} y={318 - PLAZA_SCENE_NUDGE_UP_PX} size={1.1} boost={contentBoost} />
          <PixelTree x={326} y={392 - PLAZA_SCENE_NUDGE_UP_PX} size={0.85} boost={contentBoost} />
          <PixelTree x={162} y={300 - PLAZA_SCENE_NUDGE_UP_PX} size={1.0} boost={contentBoost} />

          <PixelPond x={133} y={462 - PLAZA_SCENE_NUDGE_UP_PX} boost={contentBoost} />

          <PixelGrass x={0} y={588 - PLAZA_SCENE_NUDGE_UP_PX} width={393} boost={contentBoost} />
          <PixelGrass x={48} y={658 - PLAZA_SCENE_NUDGE_UP_PX} width={310} boost={contentBoost} />
          <PixelGrass x={110} y={728 - PLAZA_SCENE_NUDGE_UP_PX} width={220} boost={contentBoost} />

          <PixelBench x={68} y={550 - PLAZA_SCENE_NUDGE_UP_PX} boost={contentBoost} />
          <PixelBench x={240} y={535 - PLAZA_SCENE_NUDGE_UP_PX} flip boost={contentBoost} />

          <div
            role="button"
            tabIndex={0}
            aria-label="与 OPC_07 聊天"
            onClick={e => {
              e.stopPropagation();
              onOpenCharacterChat('visitor1');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onOpenCharacterChat('visitor1');
              }
            }}
            style={{ position: 'absolute', left: 68, top: 472 - PLAZA_SCENE_NUDGE_UP_PX, cursor: 'pointer' }}
          >
            <PixelSprite variant="visitor1" name="OPC_07" statusColor="#FF9800" scale={npcSpriteScale} />
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label="与 OPC_23 聊天"
            onClick={e => {
              e.stopPropagation();
              onOpenCharacterChat('visitor2');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onOpenCharacterChat('visitor2');
              }
            }}
            style={{ position: 'absolute', left: 252, top: 455 - PLAZA_SCENE_NUDGE_UP_PX, cursor: 'pointer' }}
          >
            <PixelSprite variant="visitor2" name="OPC_23" statusColor="#2196F3" scale={npcSpriteScale} flip />
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label="与 OPC_42 聊天"
            onClick={e => {
              e.stopPropagation();
              onOpenCharacterChat('visitor3');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onOpenCharacterChat('visitor3');
              }
            }}
            style={{ position: 'absolute', left: 156, top: 524 - PLAZA_SCENE_NUDGE_UP_PX, cursor: 'pointer' }}
          >
            <PixelSprite variant="visitor3" name="OPC_42" statusColor="#E91E63" scale={npcSpriteScale} />
          </div>
        </div>
        <button
          type="button"
          aria-label="前往 Studio"
          disabled={zoneNavLocked}
          onClick={e => {
            e.stopPropagation();
            onNavigateToZone(0);
          }}
          style={{
            position: 'absolute',
            right: 0,
            top: '28%',
            width: 46,
            height: '42%',
            zIndex: 6,
            border: 'none',
            margin: 0,
            padding: 0,
            cursor: zoneNavLocked ? 'not-allowed' : 'pointer',
            WebkitTapHighlightColor: 'transparent',
            background: 'linear-gradient(90deg, rgba(214,207,196,0.25), transparent)',
            borderLeft: '3px solid #C8B89A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="zone-badge" style={{ writingMode: 'vertical-rl', opacity: 0.35 }}>
            Studio →
          </span>
        </button>
      </div>
    </div>
  );
}
