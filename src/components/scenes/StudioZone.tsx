import { useCallback } from 'react';
import PixelSprite from '../PixelSprite';
import type { PlayerState } from '../../hooks/usePlayerState';

interface StudioZoneProps {
  playerState: PlayerState;
  statusColor: string;
  userInputLocked: boolean;
  zoneNavLocked: boolean;
  onWorldBackgroundClick: (localX: number, localY: number, zoneInnerHeightPx: number) => void;
  onOpenCharacterChat: (characterId: string) => void;
  onNavigateToZone: (zoneIndex: 0 | 1 | 2) => void;
}

function PixelDesk({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <svg
      className="sprite"
      width="72" height="44"
      viewBox="0 0 36 22"
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="36" height="14" fill="#C8935A" />
      <rect x="0" y="0" width="36" height="2" fill="#E0A870" />
      <rect x="0" y="0" width="2" height="14" fill="#A87040" />
      <rect x="10" y="0" width="16" height="10" fill="#2C3E50" />
      <rect x="11" y="1" width="14" height="8" fill="#1a6ba0" />
      <rect x="17" y="10" width="2" height="3" fill="#34495e" />
      <rect x="14" y="13" width="8" height="1" fill="#34495e" />
      <rect x="13" y="3" width="10" height="4" fill="#2196F3" opacity="0.6" />
      <rect x="13" y="3" width="6" height="1" fill="#64B5F6" opacity="0.8" />
      <rect x="13" y="5" width="8" height="1" fill="#64B5F6" opacity="0.5" />
      <rect x="8" y="11" width="10" height="3" fill="#95A5A6" />
      <rect x="9" y="12" width="8" height="1" fill="#7F8C8D" />
      <rect x="20" y="11" width="4" height="3" fill="#95A5A6" rx="1" />
      <rect x="2" y="8" width="4" height="5" fill="#E74C3C" />
      <rect x="2" y="8" width="4" height="2" fill="#c0392b" />
      <rect x="6" y="9" width="1" height="2" fill="#c0392b" />
      <rect x="1" y="14" width="2" height="8" fill="#8B6040" />
      <rect x="33" y="14" width="2" height="8" fill="#8B6040" />
      <rect x="1" y="21" width="4" height="1" fill="#6B4A30" />
      <rect x="31" y="21" width="4" height="1" fill="#6B4A30" />
    </svg>
  );
}

function PixelBookshelf({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="60" height="80"
      viewBox="0 0 30 40"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="30" height="40" fill="#8B6040" />
      <rect x="1" y="1" width="28" height="38" fill="#A0724A" />
      <rect x="0" y="12" width="30" height="2" fill="#8B6040" />
      <rect x="0" y="26" width="30" height="2" fill="#8B6040" />
      <rect x="2" y="2" width="3" height="10" fill="#E74C3C" />
      <rect x="5" y="3" width="4" height="9" fill="#3498DB" />
      <rect x="9" y="2" width="3" height="10" fill="#F39C12" />
      <rect x="12" y="4" width="4" height="8" fill="#27AE60" />
      <rect x="16" y="2" width="3" height="10" fill="#9B59B6" />
      <rect x="19" y="3" width="4" height="9" fill="#E67E22" />
      <rect x="23" y="2" width="3" height="10" fill="#1ABC9C" />
      <rect x="26" y="3" width="2" height="9" fill="#E74C3C" />
      <rect x="2" y="14" width="4" height="12" fill="#2ECC71" />
      <rect x="6" y="15" width="3" height="11" fill="#E91E63" />
      <rect x="9" y="14" width="5" height="12" fill="#FF5722" />
      <rect x="14" y="15" width="3" height="11" fill="#607D8B" />
      <rect x="17" y="14" width="4" height="12" fill="#795548" />
      <rect x="21" y="15" width="3" height="11" fill="#00BCD4" />
      <rect x="24" y="14" width="4" height="12" fill="#CDDC39" />
      <rect x="2" y="28" width="5" height="10" fill="#FF9800" />
      <rect x="7" y="29" width="4" height="9" fill="#673AB7" />
      <rect x="11" y="28" width="3" height="10" fill="#009688" />
      <rect x="14" y="29" width="4" height="9" fill="#F44336" />
      <rect x="18" y="28" width="5" height="10" fill="#2196F3" />
      <rect x="23" y="29" width="3" height="9" fill="#4CAF50" />
      <rect x="26" y="28" width="2" height="10" fill="#FFC107" />
    </svg>
  );
}

function PixelRug({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="160" height="90"
      viewBox="0 0 80 45"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="80" height="45" fill="#5C6BC0" opacity="0.7" rx="4" />
      <rect x="2" y="2" width="76" height="41" fill="none" stroke="#7986CB" strokeWidth="1.5" />
      <rect x="4" y="4" width="72" height="37" fill="none" stroke="#9FA8DA" strokeWidth="0.5" />
      <rect x="37" y="2" width="6" height="6" fill="#9FA8DA" transform="rotate(45,40,5)" opacity="0.6" />
      <rect x="37" y="37" width="6" height="6" fill="#9FA8DA" transform="rotate(45,40,40)" opacity="0.6" />
      <rect x="2" y="19" width="6" height="6" fill="#9FA8DA" transform="rotate(45,5,22)" opacity="0.6" />
      <rect x="72" y="19" width="6" height="6" fill="#9FA8DA" transform="rotate(45,75,22)" opacity="0.6" />
      <rect x="34" y="18" width="12" height="9" fill="#7986CB" opacity="0.5" rx="2" />
      <rect x="37" y="19" width="6" height="7" fill="#C5CAE9" opacity="0.4" />
    </svg>
  );
}

function PixelPlant({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const w = 36 * size, h = 48 * size;
  return (
    <svg
      className="sprite"
      width={w} height={h}
      viewBox="0 0 18 24"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5" y="17" width="8" height="7" fill="#C0392B" />
      <rect x="4" y="16" width="10" height="2" fill="#E74C3C" />
      <rect x="5" y="23" width="8" height="1" fill="#922B21" />
      <rect x="5" y="17" width="8" height="2" fill="#4A2C0A" />
      <rect x="8" y="10" width="2" height="8" fill="#27AE60" />
      <rect x="3" y="6" width="6" height="8" fill="#2ECC71" rx="2" />
      <rect x="9" y="4" width="6" height="8" fill="#27AE60" rx="2" />
      <rect x="5" y="2" width="6" height="8" fill="#58D68D" rx="2" />
    </svg>
  );
}

function WallSection({ width, height }: { width: number; height: number }) {
  return (
    <svg
      className="sprite"
      width={width} height={height}
      viewBox={`0 0 ${Math.round(width / 2)} ${Math.round(height / 2)}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width={Math.round(width / 2)} height={Math.round(height / 4)} fill="#D6CFC4" />
      <rect x="0" y={Math.round(height / 4) - 2} width={Math.round(width / 2)} height="2" fill="#B8AFA3" />
      <rect x={Math.round(width / 8)} y="4" width={Math.round(width / 5)} height={Math.round(height / 6)} fill="#AED6F1" />
      <rect x={Math.round(width / 8)} y="4" width={Math.round(width / 5)} height="1" fill="#fff" opacity="0.5" />
      <rect x={Math.round(width / 8)} y="4" width="1" height={Math.round(height / 6)} fill="#fff" opacity="0.3" />
      <rect x="0" y={Math.round(height / 4)} width={Math.round(width / 2)} height={Math.round(height / 4)} fill="#C8935A" />
    </svg>
  );
}

export default function StudioZone({
  playerState: _playerState,
  statusColor: _statusColor,
  userInputLocked,
  zoneNavLocked,
  onWorldBackgroundClick,
  onOpenCharacterChat,
  onNavigateToZone,
}: StudioZoneProps) {
  const handleZoneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (userInputLocked || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a, [role="dialog"], [role="button"]')) return;
      const rect = e.currentTarget.getBoundingClientRect();
      onWorldBackgroundClick(e.clientX - rect.left, e.clientY - rect.top, rect.height);
    },
    [onWorldBackgroundClick, userInputLocked],
  );

  return (
    <div
      onClick={handleZoneClick}
      style={{
        width: '100vw',
        height: '100%',
        minHeight: 0,
        position: 'relative',
        background: 'linear-gradient(180deg, #D6CFC4 32%, #C8935A 32%)',
        overflow: 'hidden',
      }}
    >
      {/* Wall backdrop */}
      <WallSection width={1280} height={800} />

      {/* Bookshelf — left wall */}
      <PixelBookshelf x={8} y={52} />

      {/* Plants */}
      <PixelPlant x={316} y={88} size={0.85} />
      <PixelPlant x={302} y={358} />

      {/* Rug — between desk rows */}
      <PixelRug x={108} y={312} />

      {/* ── Desk Row 1: User (left) + Nova (right) ── */}
      <PixelDesk x={48} y={232} />
      <PixelDesk x={212} y={218} />

      {/* ── Desk Row 2: Orion (centre) ── */}
      <PixelDesk x={134} y={412} />

      {/* Doorway to Plaza — left edge（与 Lounge 右侧 Plaza 门镜像） */}
      <button
        type="button"
        aria-label="前往 Plaza"
        disabled={zoneNavLocked}
        onClick={e => {
          e.stopPropagation();
          onNavigateToZone(2);
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
          background: 'linear-gradient(90deg, rgba(166,216,155,0.25), transparent)',
          borderRight: '3px solid #8BC78A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="zone-badge" style={{ writingMode: 'vertical-rl', opacity: 0.35, transform: 'rotate(180deg)' }}>
          Plaza →
        </span>
      </button>

      {/* Doorway to Lounge — right edge（与 Lounge 门同宽） */}
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
          background: 'linear-gradient(90deg, transparent, rgba(230,244,234,0.4))',
          borderLeft: '3px solid #C8B89A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="zone-badge" style={{ writingMode: 'vertical-rl', opacity: 0.35 }}>
          Lounge →
        </span>
      </button>

      {/* Nova at desk 1-right */}
      <div
        role="button"
        tabIndex={0}
        aria-label="与 Nova 聊天"
        onClick={e => {
          e.stopPropagation();
          onOpenCharacterChat('nova');
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onOpenCharacterChat('nova');
          }
        }}
        style={{ position: 'absolute', left: 212, top: 163, cursor: 'pointer' }}
      >
        <PixelSprite variant="assistant1" name="Nova" statusColor="#4CAF50" scale={2.2} />
      </div>

      {/* Orion at desk 2 (lower centre) */}
      <div
        role="button"
        tabIndex={0}
        aria-label="与 Orion 聊天"
        onClick={e => {
          e.stopPropagation();
          onOpenCharacterChat('orion');
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onOpenCharacterChat('orion');
          }
        }}
        style={{ position: 'absolute', left: 134, top: 358, cursor: 'pointer' }}
      >
        <PixelSprite variant="assistant2" name="Orion" statusColor="#2196F3" scale={2.2} />
      </div>
    </div>
  );
}
