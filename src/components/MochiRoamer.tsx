import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PixelCat from './PixelCat';
import { worldPlayInnerHeightPx } from '../worldUserLayout';

/** 移动速度降为原来的 15%（降低 85%）→ 同样路程动画时长约为原来的 1/0.15 倍 */
const CAT_MOVE_SLOWDOWN = 1 / (1 - 0.85);
/** 在以上基础上再加快 600%（即 7 倍速）→ 位移动画 duration 除以该系数 */
const CAT_MOVE_SPEEDUP = 1 + 6;

/** 猫咪只在 Studio / Lounge 游走，不进入 Plaza 列；Lounge 内靠右上限避免贴 Plaza 门洞 */
const MAX_LX_STUDIO = 0.82;
const MAX_LX_LOUNGE = 0.64;

type RoamPos = { zone: 0 | 1; lx: number; ly: number };

function clampLx(zone: 0 | 1, lx: number): number {
  const cap = zone === 1 ? MAX_LX_LOUNGE : MAX_LX_STUDIO;
  return Math.max(0.1, Math.min(cap, lx));
}

function minCatLyNorm(vh: number): number {
  const playH = worldPlayInnerHeightPx(vh);
  return Math.min(0.78, 96 / playH);
}

function randomPos(): RoamPos {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const lo = minCatLyNorm(vh);
  const hi = Math.max(lo + 0.06, 0.9);
  const zone = (Math.random() > 0.45 ? 0 : 1) as 0 | 1;
  const span = zone === 1 ? Math.max(0.08, MAX_LX_LOUNGE - 0.12) : 0.58;
  return {
    zone,
    lx: clampLx(zone, zone === 1 ? 0.12 + Math.random() * span : 0.12 + Math.random() * 0.58),
    ly: lo + Math.random() * (hi - lo),
  };
}

/** 慵懒小挪步：多半留在同 zone，坐标微移 */
function nudgePos(cur: RoamPos): RoamPos {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const lo = minCatLyNorm(vh);
  const sameZone = Math.random() < 0.84 ? cur.zone : cur.zone === 0 ? 1 : 0;
  const rawLx = cur.lx + (Math.random() - 0.5) * 0.14;
  const lx = clampLx(sameZone as 0 | 1, rawLx);
  const ly = Math.max(lo, Math.min(0.88, cur.ly + (Math.random() - 0.5) * 0.12));
  return { zone: sameZone as 0 | 1, lx, ly };
}

function toPixel(a: RoamPos, vw: number, vh: number) {
  const playH = worldPlayInnerHeightPx(vh);
  return { x: a.zone * vw + a.lx * vw, y: a.ly * playH };
}

function pixelDist(a: RoamPos, b: RoamPos, vw: number, vh: number) {
  const p = toPixel(a, vw, vh);
  const q = toPixel(b, vw, vh);
  return Math.hypot(q.x - p.x, q.y - p.y);
}

interface MochiRoamerProps {
  pettingActive: boolean;
  onPetCat: (clientX: number, clientY: number) => void;
  /** 当前视口所在列：Plaza(2) 不渲染猫，避免横滑过渡时猫出现在广场层 */
  viewportZoneIndex: number;
}

export default function MochiRoamer({ pettingActive, onPetCat, viewportZoneIndex }: MochiRoamerProps) {
  const [pos, setPos] = useState<RoamPos>(randomPos);
  const [moveDuration, setMoveDuration] = useState((3.8 * CAT_MOVE_SLOWDOWN) / CAT_MOVE_SPEEDUP);
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
      // 基础时长再按 CAT_MOVE_SLOWDOWN 拉长（速度降为 15%），再按 CAT_MOVE_SPEEDUP 加快
      const baseDur = Math.min(6.8, Math.max(2.7, 2.2 + dist / 95));
      const dur =
        Math.min(95, Math.max(17, baseDur * CAT_MOVE_SLOWDOWN)) / CAT_MOVE_SPEEDUP;
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
  const playH = worldPlayInnerHeightPx(vh);
  const leftPx = pos.zone * vw + pos.lx * vw;
  const topPx = pos.ly * playH;
  const btnLeft = Math.max(12, leftPx - 22);
  const minCatTopLocal = Math.max(8, minCatLyNorm(vh) * playH - 36);
  const btnTop = Math.max(minCatTopLocal, topPx - 40);

  if (viewportZoneIndex === 2) return null;

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
        <PixelCat name="Mochi" statusColor="#C8A87A" />
      </div>
    </motion.button>
  );
}
