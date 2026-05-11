import { useCallback } from 'react';
import { motion } from 'framer-motion';
import PixelSprite from '../PixelSprite';
import type { PlayerState } from '../../hooks/usePlayerState';

interface LoungeZoneProps {
  playerState: PlayerState;
  statusColor: string;
  onMessengerClick: () => void;
  messengerActive: boolean;
  userInputLocked: boolean;
  onWorldBackgroundClick: (localX: number, localY: number, zoneInnerHeightPx: number) => void;
  onOpenCharacterChat: (characterId: string) => void;
}

function PixelSofa({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="68" height="38"
      viewBox="0 0 70 40"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="66" height="18" fill="#E8A87C" rx="3" />
      <rect x="2" y="4" width="66" height="3" fill="#F5C5A3" rx="2" />
      <rect x="4" y="22" width="28" height="14" fill="#F5C5A3" rx="2" />
      <rect x="38" y="22" width="28" height="14" fill="#F5C5A3" rx="2" />
      <rect x="4" y="22" width="28" height="2" fill="#FDE9D9" />
      <rect x="38" y="22" width="28" height="2" fill="#FDE9D9" />
      <rect x="0" y="8" width="6" height="28" fill="#D4875A" rx="2" />
      <rect x="64" y="8" width="6" height="28" fill="#D4875A" rx="2" />
      <rect x="3" y="36" width="4" height="4" fill="#8B6040" />
      <rect x="63" y="36" width="4" height="4" fill="#8B6040" />
      <rect x="13" y="36" width="4" height="4" fill="#8B6040" />
      <rect x="53" y="36" width="4" height="4" fill="#8B6040" />
      <rect x="32" y="20" width="6" height="8" fill="#9B59B6" rx="1" />
      <rect x="33" y="21" width="4" height="1" fill="#C39BD3" />
    </svg>
  );
}

function PixelSofaSmall({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="52" height="32"
      viewBox="0 0 52 32"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="48" height="14" fill="#B8997A" rx="3" />
      <rect x="2" y="4" width="48" height="2" fill="#D4B896" rx="2" />
      <rect x="4" y="18" width="20" height="10" fill="#D4B896" rx="2" />
      <rect x="28" y="18" width="20" height="10" fill="#D4B896" rx="2" />
      <rect x="0" y="6" width="5" height="22" fill="#A07858" rx="2" />
      <rect x="47" y="6" width="5" height="22" fill="#A07858" rx="2" />
      <rect x="3" y="28" width="3" height="3" fill="#7B5030" />
      <rect x="46" y="28" width="3" height="3" fill="#7B5030" />
    </svg>
  );
}

function PixelArtFrame({ x, y, color1 = '#FF6B6B', color2 = '#4ECDC4' }: { x: number; y: number; color1?: string; color2?: string }) {
  return (
    <svg
      className="sprite"
      width="36" height="28"
      viewBox="0 0 35 28"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="35" height="28" fill="#8B6040" rx="1" />
      <rect x="2" y="2" width="31" height="24" fill="#F5F5DC" />
      <rect x="3" y="3" width="8" height="6" fill={color1} />
      <rect x="11" y="3" width="8" height="6" fill={color2} />
      <rect x="19" y="3" width="11" height="6" fill={color1} opacity="0.6" />
      <rect x="3" y="9" width="14" height="8" fill={color2} opacity="0.7" />
      <rect x="17" y="9" width="13" height="8" fill={color1} opacity="0.8" />
      <rect x="3" y="17" width="10" height="8" fill={color2} />
      <rect x="13" y="17" width="8" height="8" fill={color1} opacity="0.5" />
      <rect x="21" y="17" width="9" height="8" fill={color2} opacity="0.9" />
      <rect x="28" y="23" width="3" height="2" fill="#333" opacity="0.3" />
    </svg>
  );
}

function PixelCoffeeTable({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="64" height="32"
      viewBox="0 0 40 20"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="36" height="12" fill="#C8935A" rx="2" />
      <rect x="2" y="2" width="36" height="2" fill="#E0A870" rx="1" />
      <rect x="10" y="4" width="5" height="6" fill="#E74C3C" />
      <rect x="10" y="4" width="5" height="2" fill="#922B21" />
      <rect x="16" y="5" width="8" height="4" fill="#F5F5F5" rx="1" />
      <rect x="26" y="3" width="5" height="7" fill="#2C3E50" rx="1" />
      <rect x="27" y="4" width="3" height="5" fill="#3498DB" opacity="0.6" />
      <rect x="4" y="14" width="3" height="6" fill="#A07040" />
      <rect x="33" y="14" width="3" height="6" fill="#A07040" />
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

export default function LoungeZone({
  playerState: _playerState,
  statusColor: _statusColor,
  onMessengerClick,
  messengerActive,
  userInputLocked,
  onWorldBackgroundClick,
  onOpenCharacterChat,
}: LoungeZoneProps) {
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
        background: 'linear-gradient(180deg, #EDE8E0 36%, #D4B896 36%)',
        overflow: 'hidden',
      }}
    >
      {/* Warm wood floor grain lines */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: `${36 + i * 9}%`,
            width: '100%',
            height: 1,
            background: 'rgba(160,112,60,0.15)',
          }}
        />
      ))}

      {/* Art frames on wall — spread across portrait width */}
      <PixelArtFrame x={18} y={62} color1="#FF6B6B" color2="#4ECDC4" />
      <PixelArtFrame x={160} y={52} color1="#A29BFE" color2="#FD79A8" />
      <PixelArtFrame x={298} y={62} color1="#FDCB6E" color2="#6C5CE7" />

      {/* Main seating area — centred */}
      <PixelSofa x={158} y={305} />
      <PixelCoffeeTable x={162} y={382} />

      {/* Second relaxation nook — lower section */}
      <PixelSofaSmall x={52} y={530} />
      <PixelSofaSmall x={278} y={530} />
      <PixelCoffeeTable x={154} y={555} />

      {/* Floor plants */}
      <PixelPlant x={306} y={372} size={0.9} />
      <PixelPlant x={14} y={360} size={0.85} />

      {/* Hermes — in doorway zone, clickable */}
      <motion.div
        style={{ position: 'absolute', left: 28, top: `${(312 / 600) * 100}%`, zIndex: 10 }}
        animate={{
          x: messengerActive ? 64 : 0,
          y: [0, -4, 0],
        }}
        transition={{
          x: { duration: 0.7, ease: 'easeOut' },
          y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <motion.button
          onClick={onMessengerClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'block',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelSprite variant="messenger" name="Hermes" statusColor="#FF9800" scale={1.02} animateIdle={false} />
        </motion.button>
      </motion.div>

      {/* Messenger dialog */}
      {messengerActive && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Hermes 对话"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="glass-panel"
          onClick={() => onOpenCharacterChat('hermes')}
          style={{
            position: 'absolute',
            left: 18,
            top: 162,
            width: 'calc(100vw - 36px)',
            maxWidth: 348,
            padding: '14px 16px',
            zIndex: 30,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #FF9800, #FF5722)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14 }}>⚡</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>Hermes</div>
              <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888', fontWeight: 400 }}>Messenger Agent</div>
            </div>
          </div>
          <p className="ui-dialog" style={{ color: '#2c2c3e', lineHeight: 1.55 }}>
            Hey! A new collaboration request just arrived from <strong>OPC_Studio_47</strong>. Want me to schedule an intro call? 📬
          </p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
            <button
              type="button"
              style={{
                fontFamily: 'Inter', fontSize: 12, fontWeight: 600,
                background: '#1a1a2e', color: '#fff', border: 'none',
                borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              }}
            >
              Schedule
            </button>
            <button
              type="button"
              style={{
                fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
                background: 'rgba(0,0,0,0.06)', color: '#555', border: '0.33px solid rgba(0,0,0,0.12)',
                borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              }}
            >
              Later
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
