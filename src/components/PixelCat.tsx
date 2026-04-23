import { motion } from 'framer-motion';

interface PixelCatProps {
  hideLabel?: boolean;
  /** 与 PixelSprite 名牌一致；默认 Mochi */
  name?: string;
  /** 名牌左侧状态点，与场景内其他角色一致 */
  statusColor?: string;
}

export default function PixelCat({ hideLabel = false, name = 'Mochi', statusColor }: PixelCatProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      {!hideLabel ? (
        <div className="name-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {statusColor ? <div className="status-dot" style={{ background: statusColor }} /> : null}
          <span>{name}</span>
        </div>
      ) : null}
      <motion.div
        animate={{
          scaleY: [1, 1.06, 1],
          scaleX: [1, 0.97, 1],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: 'bottom center', lineHeight: 0 }}
      >
        <svg
          className="sprite"
          width="40" height="36"
          viewBox="0 0 20 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <rect x="4" y="8" width="12" height="8" fill="#F5E6CC" />
          <rect x="3" y="9" width="1" height="6" fill="#F5E6CC" />
          <rect x="16" y="9" width="1" height="6" fill="#F5E6CC" />
          {/* Belly stripe */}
          <rect x="8" y="9" width="4" height="6" fill="#FFF8F0" />
          {/* Stripes */}
          <rect x="4" y="8" width="2" height="2" fill="#C8A87A" />
          <rect x="14" y="8" width="2" height="2" fill="#C8A87A" />
          <rect x="4" y="12" width="2" height="2" fill="#C8A87A" />
          <rect x="14" y="12" width="2" height="2" fill="#C8A87A" />
          {/* Legs */}
          <rect x="5" y="15" width="3" height="3" fill="#E8C89A" />
          <rect x="12" y="15" width="3" height="3" fill="#E8C89A" />
          {/* Paws */}
          <rect x="5" y="17" width="3" height="1" fill="#D4A875" />
          <rect x="12" y="17" width="3" height="1" fill="#D4A875" />
          {/* Tail */}
          <rect x="17" y="10" width="2" height="6" fill="#E8C89A" />
          <rect x="16" y="14" width="1" height="2" fill="#E8C89A" />
          {/* Head */}
          <rect x="5" y="2" width="10" height="8" fill="#F5E6CC" />
          {/* Ears */}
          <rect x="5" y="0" width="3" height="3" fill="#F5E6CC" />
          <rect x="12" y="0" width="3" height="3" fill="#F5E6CC" />
          <rect x="6" y="1" width="1" height="1" fill="#FFB6C1" />
          <rect x="13" y="1" width="1" height="1" fill="#FFB6C1" />
          {/* Outline ears */}
          <rect x="5" y="0" width="1" height="3" fill="#C8A87A" />
          <rect x="14" y="0" width="1" height="3" fill="#C8A87A" />
          {/* Eyes */}
          <rect x="7" y="4" width="2" height="2" fill="#2C3E50" />
          <rect x="11" y="4" width="2" height="2" fill="#2C3E50" />
          {/* Eye shine */}
          <rect x="8" y="4" width="1" height="1" fill="#fff" />
          <rect x="12" y="4" width="1" height="1" fill="#fff" />
          {/* Nose */}
          <rect x="9" y="6" width="2" height="1" fill="#FFB6C1" />
          {/* Mouth */}
          <rect x="8" y="7" width="1" height="1" fill="#C8A87A" />
          <rect x="11" y="7" width="1" height="1" fill="#C8A87A" />
          {/* Whiskers */}
          <rect x="3" y="6" width="3" height="1" fill="#C8A87A" />
          <rect x="14" y="6" width="3" height="1" fill="#C8A87A" />
          <rect x="2" y="5" width="3" height="1" fill="#C8A87A" />
          <rect x="15" y="5" width="3" height="1" fill="#C8A87A" />
        </svg>
      </motion.div>
    </div>
  );
}
