export type WorldUserMotionPhase = 'normal' | 'petWalk' | 'petHold';

export type WorldUserPos = { left: number; top: number };

/** 初始「You」在横滑画布上的位置（相对 300vw 总宽度的百分比） */
export const WORLD_USER_INITIAL: WorldUserPos = { left: 42, top: 58 };

/**
 * 点击某一 zone 的背景（该 div 宽 100vw）时，换算成横跨 Studio/Lounge/Plaza 画布上的百分比。
 */
export function worldUserPosFromZonePointer(
  zoneIndex: number,
  localX: number,
  localY: number,
  vw: number,
  vh: number,
): WorldUserPos {
  const globalX = zoneIndex * vw + localX;
  const left = Math.max(2, Math.min(98, Math.round((globalX / (3 * vw)) * 100)));
  const top = Math.max(6, Math.min(94, Math.round((localY / vh) * 100)));
  return { left, top };
}

/** 走到猫咪附近：用视口坐标换算成与点击一致的百分比系 */
export function worldUserPosNearCat(catWorldX: number, catWorldY: number, vw: number, vh: number): WorldUserPos {
  const left = Math.max(6, Math.min(92, Math.round((catWorldX / vw) * 100)));
  const top = Math.max(10, Math.min(88, Math.round((catWorldY / vh) * 100)));
  return { left, top };
}
