export type WorldUserMotionPhase = 'normal' | 'petWalk' | 'petHold';

export type WorldUserPos = { left: number; top: number };

/**
 * 任务板 `WorldTaskBoard`：`fixed` 的 `top`（像素，不含 safe-area，交给 CSS `env(safe-area-inset-top)`）。
 */
export const WORLD_TASK_BOARD_TOP_PX = 52;

/**
 * 任务板主体估算高度（标题、meta、2×2 任务格、padding）。若改 `WorldTaskBoard` 布局请同步。
 */
export const WORLD_TASK_BOARD_EST_HEIGHT_PX = 178;

/** 任务板下沿与可玩区顶之间隙 */
export const WORLD_TASK_BOARD_GAP_BELOW_PX = 14;

/**
 * App 游戏层 `marginTop`、`--world-top-reserve`、人物/猫纵向换算等与任务板占位一致，由上面三项相加得到。
 */
export const WORLD_TOP_UI_RESERVE_PX =
  WORLD_TASK_BOARD_TOP_PX + WORLD_TASK_BOARD_EST_HEIGHT_PX + WORLD_TASK_BOARD_GAP_BELOW_PX;

/**
 * 为底部「站点切换」glass-panel 预留：含 safe-area、圆点行与面板估高，
 * 并保证可玩区域底边至少在该面板顶边之上约 100px（与 StatusHUD 底栏结构一致，可微调）。
 */
export const WORLD_BOTTOM_PLAY_RESERVE_PX = 172;

/** 横滑游戏层内部可用高度（用于点击换算与猫/人纵向百分比） */
export function worldPlayInnerHeightPx(vh: number): number {
  return Math.max(280, vh - WORLD_TOP_UI_RESERVE_PX - WORLD_BOTTOM_PLAY_RESERVE_PX);
}

/** 初始「You」在横滑画布上的位置（相对 300vw 总宽度的百分比） */
export const WORLD_USER_INITIAL: WorldUserPos = { left: 42, top: 58 };

/**
 * 点击某一 zone 的背景时，换算成横跨 Studio/Lounge/Plaza 画布上的百分比。
 * `zoneInnerHeightPx` 须为该 zone 根节点 `getBoundingClientRect().height`（与 App 内游戏层实际高度一致）。
 */
export function worldUserPosFromZonePointer(
  zoneIndex: number,
  localX: number,
  localY: number,
  vw: number,
  zoneInnerHeightPx: number,
): WorldUserPos {
  const globalX = zoneIndex * vw + localX;
  const left = Math.max(2, Math.min(98, Math.round((globalX / (3 * vw)) * 100)));
  const zh = Math.max(1, zoneInnerHeightPx);
  const top = Math.max(4, Math.min(94, Math.round((localY / zh) * 100)));
  return { left, top };
}

/** 走到猫咪附近：`clientY` 为视口坐标；纵向按游戏层内高换算 */
export function worldUserPosNearCat(catWorldX: number, catWorldY: number, vw: number, vh: number): WorldUserPos {
  const playH = worldPlayInnerHeightPx(vh);
  const yInPlay = catWorldY - WORLD_TOP_UI_RESERVE_PX;
  const left = Math.max(6, Math.min(92, Math.round((catWorldX / vw) * 100)));
  const top = Math.max(6, Math.min(88, Math.round((yInPlay / playH) * 100)));
  return { left, top };
}
