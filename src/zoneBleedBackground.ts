import type { CSSProperties } from 'react';
import { WORLD_BOTTOM_PLAY_RESERVE_PX, WORLD_TOP_UI_RESERVE_PX } from './worldUserLayout';

/** 与 App 内 `--world-top-reserve` / `--world-bottom-reserve` 配合，使渐变铺满整列视口高度 */
export function zoneBleedBackgroundLayer(gradient: string): CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: `calc(-1 * var(--world-top-reserve, ${WORLD_TOP_UI_RESERVE_PX}px))`,
    width: '100%',
    height: `calc(100% + var(--world-top-reserve, ${WORLD_TOP_UI_RESERVE_PX}px) + var(--world-bottom-reserve, ${WORLD_BOTTOM_PLAY_RESERVE_PX}px))`,
    zIndex: 0,
    pointerEvents: 'none',
    background: gradient,
  };
}
