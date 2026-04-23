import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';

export type SpriteVariant = 'user' | 'agent' | 'assistant1' | 'assistant2' | 'visitor1' | 'visitor2' | 'visitor3' | 'messenger';

interface PixelSpriteProps {
  variant: SpriteVariant;
  name: string;
  statusColor?: string;
  scale?: number;
  flip?: boolean;
  animateIdle?: boolean;
  walking?: boolean;
  hideLabel?: boolean;
}

const PALETTE: Record<SpriteVariant, { skin: string; hair: string; shirt: string; pants: string; shoe: string; highlight: string }> = {
  user:       { skin: '#F5C5A3', hair: '#3D2B1F', shirt: '#4A90E2', pants: '#2C3E50', shoe: '#1a1a2e', highlight: '#6BB3F5' },
  agent:      { skin: '#F5C5A3', hair: '#8B4513', shirt: '#9B59B6', pants: '#2C3E50', shoe: '#1a1a2e', highlight: '#C39BD3' },
  assistant1: { skin: '#FFD5B8', hair: '#1a1a1a', shirt: '#E74C3C', pants: '#34495E', shoe: '#111',    highlight: '#F1948A' },
  assistant2: { skin: '#C68642', hair: '#F5C518', shirt: '#27AE60', pants: '#1A252F', shoe: '#0d0d0d', highlight: '#82E0AA' },
  visitor1:   { skin: '#FDBCB4', hair: '#4A0404', shirt: '#F39C12', pants: '#2C3E50', shoe: '#1a1a2e', highlight: '#F8C471' },
  visitor2:   { skin: '#D4A5A5', hair: '#2C2C2C', shirt: '#1ABC9C', pants: '#34495E', shoe: '#111',    highlight: '#76D7C4' },
  visitor3:   { skin: '#F4C2C2', hair: '#6B4226', shirt: '#E91E63', pants: '#37474F', shoe: '#1a1a2e', highlight: '#F48FB1' },
  messenger:  { skin: '#FFE0B2', hair: '#FF6F00', shirt: '#FF9800', pants: '#BF360C', shoe: '#7B0000', highlight: '#FFCC80' },
};

const WALK_FRAMES = [[0,0,0,0,0],[-2,2,2,-2,-1],[0,0,0,0,0],[2,-2,-2,2,-1]];

function SpriteBody({ variant, frame = 0, flip = false }: { variant: SpriteVariant; frame?: number; flip?: boolean }) {
  const c = PALETTE[variant];
  const [llY, rlY, laY, raY, bob] = WALK_FRAMES[frame % 4];
  const ol = '#1a1a2e';
  return (
    <svg className="sprite" width="24" height="40" viewBox="0 0 12 20"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
      xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="6" cy="20" rx="5" ry="1.5" fill="rgba(0,0,0,0.18)" />
      <rect x="3" y={12 + bob + llY} width="2" height="5" fill={c.pants} />
      <rect x="7" y={12 + bob + rlY} width="2" height="5" fill={c.pants} />
      <rect x="2" y={17 + bob + llY} width="3" height="2" fill={c.shoe} />
      <rect x="7" y={17 + bob + rlY} width="3" height="2" fill={c.shoe} />
      <rect x="2" y={6 + bob} width="8" height="7" fill={c.shirt} />
      <rect x="3" y={7 + bob} width="2" height="4" fill={c.highlight} opacity="0.35" />
      <rect x="5" y={6 + bob} width="2" height="2" fill={c.skin} />
      <rect x="0" y={7 + bob + laY} width="2" height="5" fill={c.shirt} />
      <rect x="0" y={11 + bob + laY} width="2" height="2" fill={c.skin} />
      <rect x="10" y={7 + bob + raY} width="2" height="5" fill={c.shirt} />
      <rect x="10" y={11 + bob + raY} width="2" height="2" fill={c.skin} />
      <rect x="2" y="1" width="8" height="6" fill={c.hair} rx="1" />
      <rect x="3" y="2" width="6" height="5" fill={c.skin} />
      <rect x="2" y="1" width="8" height="2" fill={c.hair} />
      <rect x="2" y="3" width="1" height="1" fill={c.hair} />
      <rect x="9" y="3" width="1" height="1" fill={c.hair} />
      <rect x="4" y="4" width="1" height="1" fill={ol} />
      <rect x="7" y="4" width="1" height="1" fill={ol} />
      <rect x="4" y="4" width="1" height="1" fill="rgba(255,255,255,0.45)" />
      <rect x="5" y="6" width="2" height="1" fill="#C07060" />
      <rect x="2" y="0" width="8" height="1" fill={ol} opacity="0.6" />
    </svg>
  );
}

export default function PixelSprite({ variant, name, statusColor, scale = 2.6, flip = false, animateIdle = true, walking = false, hideLabel = false }: PixelSpriteProps) {
  const [frame, setFrame] = useState(0);
  const elapsed = useRef(0);
  useAnimationFrame((_, delta) => {
    if (!walking) return;
    elapsed.current += delta;
    if (elapsed.current > 155) { elapsed.current = 0; setFrame(f => (f + 1) % 4); }
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {!hideLabel && (
        <div className="name-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {statusColor && <div className="status-dot" style={{ background: statusColor }} />}
          <span>{name}</span>
        </div>
      )}
      <motion.div
        animate={animateIdle && !walking ? { y: [0, -2, 0], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } } : {}}
        style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center', lineHeight: 0 }}
      >
        <SpriteBody variant={variant} frame={frame} flip={flip} />
      </motion.div>
    </div>
  );
}
