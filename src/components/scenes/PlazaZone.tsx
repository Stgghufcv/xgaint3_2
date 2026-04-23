import { useCallback } from 'react';
import { motion } from 'framer-motion';
import PixelSprite from '../PixelSprite';
import type { PlayerState } from '../../hooks/usePlayerState';

interface PlazaZoneProps {
  playerState: PlayerState;
  statusColor: string;
  onTaskClick: (task: string) => void;
  userInputLocked: boolean;
  onWorldBackgroundClick: (localX: number, localY: number) => void;
  onOpenCharacterChat: (characterId: string) => void;
}

function PixelTree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const w = 40 * size, h = 56 * size;
  return (
    <svg
      className="sprite"
      width={w} height={h}
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

function PixelPond({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="120" height="60"
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

function PixelBench({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <svg
      className="sprite"
      width="70" height="36"
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

function PixelGrass({ x, y, width }: { x: number; y: number; width: number }) {
  const blades = Math.floor(width / 8);
  return (
    <svg
      className="sprite"
      width={width} height="24"
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

const TASKS = [
  { id: 'launch', emoji: '🚀', label: 'Launch v1.2', tag: 'TODAY', color: '#E74C3C' },
  { id: 'review', emoji: '📋', label: 'Review PRD', tag: 'IN PROGRESS', color: '#F39C12' },
  { id: 'pitch', emoji: '💼', label: 'Investor Pitch Deck', tag: 'UPCOMING', color: '#3498DB' },
  { id: 'collab', emoji: '🤝', label: 'Collab: OPC_Studio_47', tag: 'NEW', color: '#9B59B6' },
];

function TaskBoard({ onTaskClick }: { onTaskClick: (task: string) => void }) {
  return (
    <motion.div
      onClick={e => e.stopPropagation()}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-panel"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: 52,
        padding: '14px 14px',
        zIndex: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12,
          }}>📌</div>
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>OPC Task Board</div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888', fontWeight: 400 }}>Q2 Sprint · 4 active</div>
          </div>
        </div>
        <div style={{
          fontFamily: 'Inter', fontSize: 10, fontWeight: 600,
          color: '#27AE60', background: 'rgba(39,174,96,0.1)',
          borderRadius: 100, padding: '2px 8px',
          border: '0.33px solid rgba(39,174,96,0.3)',
        }}>LIVE</div>
      </div>

      {/* Task list — 2-column grid for portrait width */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {TASKS.map(task => (
          <motion.button
            key={task.id}
            onClick={() => onTaskClick(task.label)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.03)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5,
              padding: '9px 10px',
              background: 'rgba(255,255,255,0.55)',
              border: '0.33px solid rgba(0,0,0,0.08)',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{task.emoji}</span>
              <div style={{
                fontFamily: 'Inter', fontSize: 8, fontWeight: 700,
                color: task.color,
                background: `${task.color}18`,
                border: `0.33px solid ${task.color}50`,
                borderRadius: 100,
                padding: '1px 5px',
                letterSpacing: '0.3px',
              }}>{task.tag}</div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: '#1a1a2e', lineHeight: 1.3 }}>{task.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default function PlazaZone({
  playerState: _playerState,
  statusColor: _statusColor,
  onTaskClick,
  userInputLocked,
  onWorldBackgroundClick,
  onOpenCharacterChat,
}: PlazaZoneProps) {
  const handleZoneClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (userInputLocked || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a, [role="dialog"], [role="button"]')) return;
      const rect = e.currentTarget.getBoundingClientRect();
      onWorldBackgroundClick(e.clientX - rect.left, e.clientY - rect.top);
    },
    [onWorldBackgroundClick, userInputLocked],
  );

  return (
    <div
      onClick={handleZoneClick}
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        background: 'linear-gradient(180deg, #C8E6C9 0%, #E6F4EA 40%, #A5D6A7 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Task board — anchored to top in portrait */}
      <TaskBoard onTaskClick={onTaskClick} />

      {/* ── Trees — clustered left & right ── */}
      <PixelTree x={8}   y={310} size={1.2} />
      <PixelTree x={46}  y={385} size={0.9} />
      <PixelTree x={300} y={318} size={1.1} />
      <PixelTree x={326} y={392} size={0.85} />
      {/* Centre background tree */}
      <PixelTree x={162} y={300} size={1.0} />

      {/* Pond — horizontally centred */}
      <PixelPond x={133} y={462} />

      {/* Grass bands */}
      <PixelGrass x={0}  y={588} width={393} />
      <PixelGrass x={48} y={658} width={310} />
      <PixelGrass x={110} y={728} width={220} />

      {/* Benches */}
      <PixelBench x={68}  y={550} />
      <PixelBench x={240} y={535} flip />

      {/* Visitor OPCs */}
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
        style={{ position: 'absolute', left: 68, top: 472, cursor: 'pointer' }}
      >
        <PixelSprite variant="visitor1" name="OPC_07" statusColor="#FF9800" scale={2.0} />
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
        style={{ position: 'absolute', left: 252, top: 455, cursor: 'pointer' }}
      >
        <PixelSprite variant="visitor2" name="OPC_23" statusColor="#2196F3" scale={2.0} flip />
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
        style={{ position: 'absolute', left: 156, top: 524, cursor: 'pointer' }}
      >
        <PixelSprite variant="visitor3" name="OPC_42" statusColor="#E91E63" scale={2.0} />
      </div>

      {/* Doorway to Lounge — left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '28%',
          width: 46,
          height: '42%',
          background: 'linear-gradient(270deg, transparent, rgba(237,232,224,0.35))',
          borderRight: '3px solid #C8B89A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="zone-badge" style={{ writingMode: 'vertical-rl', opacity: 0.35, transform: 'rotate(180deg)' }}>← Lounge</div>
      </div>
    </div>
  );
}
