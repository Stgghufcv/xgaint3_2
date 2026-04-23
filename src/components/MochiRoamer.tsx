import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PixelCat from './PixelCat';

/** 移动速度降为原来的 15%（降低 85%）→ 同样路程动画时长约为原来的 1/0.15 倍 */
const CAT_MOVE_SLOWDOWN = 1 / (1 - 0.85);

type RoamPos = { zone: 0 | 1; lx: number; ly: number };

function randomPos(): RoamPos {
  return {
    zone: Math.random() > 0.45 ? 0 : 1,
    lx: 0.12 + Math.random() * 0.58,
    ly: 0.38 + Math.random() * 0.42,
  };
}

/** 慵懒小挪步：多半留在同 zone，坐标微移 */
function nudgePos(cur: RoamPos): RoamPos {
  const sameZone = Math.random() < 0.84 ? cur.zone : cur.zone === 0 ? 1 : 0;
  const lx = Math.max(0.1, Math.min(0.82, cur.lx + (Math.random() - 0.5) * 0.14));
  const ly = Math.max(0.34, Math.min(0.84, cur.ly + (Math.random() - 0.5) * 0.12));
  return { zone: sameZone as 0 | 1, lx, ly };
}

function toPixel(a: RoamPos, vw: number, vh: number) {
  return { x: a.zone * vw + a.lx * vw, y: a.ly * vh };
}

function pixelDist(a: RoamPos, b: RoamPos, vw: number, vh: number) {
  const p = toPixel(a, vw, vh);
  const q = toPixel(b, vw, vh);
  return Math.hypot(q.x - p.x, q.y - p.y);
}

interface MochiRoamerProps {
  pettingActive: boolean;
  onPetCat: (clientX: number, clientY: number) => void;
}

export default function MochiRoamer({ pettingActive, onPetCat }: MochiRoamerProps) {
  const [pos, setPos] = useState<RoamPos>(randomPos);
  const [moveDuration, setMoveDuration] = useState(3.8 * CAT_MOVE_SLOWDOWN);
  const hoverPause = useRef(false);
  const posRef = useRef(pos);
  const pettingRef = useRef(pettingActive);
  const timerRef = useRef(0);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    pettingRef.current = pettingActive;
  }, [pettingActive]);

  useEffect(() => {
    if (pettingActive) return;

    const clear = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };

    const schedule = (delayMs: number, fn: () => void) => {
      clear();
      timerRef.current = window.setTimeout(fn, delayMs);
    };

    const wanderTick = () => {
      if (pettingRef.current) return;

      if (hoverPause.current) {
        schedule(700 + Math.random() * 500, wanderTick);
        return;
      }

      const dice = Math.random();
      // 发呆：不移动，只等一阵
      if (dice < 0.44) {
        const restMs = 4800 + Math.random() * 9000;
        schedule(restMs, wanderTick);
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cur = posRef.current;
      const next = dice < 0.86 ? nudgePos(cur) : randomPos();
      const dist = pixelDist(cur, next, vw, vh);
      // 基础时长再按 CAT_MOVE_SLOWDOWN 拉长（速度降为 15%）
      const baseDur = Math.min(6.8, Math.max(2.7, 2.2 + dist / 95));
      const dur = Math.min(95, Math.max(17, baseDur * CAT_MOVE_SLOWDOWN));
      setMoveDuration(dur);
      setPos(next);

      const afterArrival = 900 + Math.random() * 2800;
      schedule(dur * 1000 + afterArrival, wanderTick);
    };

    // 开场先愣一会儿再开始逛
    schedule(1200 + Math.random() * 3800, wanderTick);

    return () => clear();
  }, [pettingActive]);

  const [hover, setHover] = useState(false);
  useEffect(() => {
    hoverPause.current = hover;
  }, [hover]);

  const vw = typeof window !== 'undefined' ? window.innerWidth : 375;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const leftPx = pos.zone * vw + pos.lx * vw;
  const topPx = pos.ly * vh;
  const btnLeft = Math.max(12, leftPx - 22);
  const btnTop = Math.max(72, topPx - 40);

  return (
    <motion.button
      type="button"
      aria-label="摸摸 Mochi"
      initial={false}
      animate={{ left: btnLeft, top: btnTop }}
      transition={{
        duration: moveDuration,
        ease: [0.2, 0.45, 0.28, 1],
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={e => {
        e.stopPropagation();
        onPetCat(e.clientX, e.clientY);
      }}
      style={{
        position: 'absolute',
        zIndex: 50,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 8,
      }}
    >
      <div style={{ pointerEvents: 'none', transform: hover ? 'scale(1.03)' : undefined, transition: 'transform 0.2s' }}>
        <PixelCat hideLabel />
      </div>
    </motion.button>
  );
}
