/**
 * Shared isometric pixel-art primitives.
 * All SVG elements use image-rendering: pixelated via the .sprite class.
 */

import type { ReactElement } from 'react';

/** Isometric floor tile grid — warm wood planks */
export function IsoFloor({
  x, y, cols, rows, tileW = 64, tileH = 32,
  color1 = '#C8935A', color2 = '#B8834A', lineColor = '#A07038',
}: {
  x: number; y: number; cols: number; rows: number;
  tileW?: number; tileH?: number;
  color1?: string; color2?: string; lineColor?: string;
}) {
  const tiles: ReactElement[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tx = x + (col - row) * (tileW / 2);
      const ty = y + (col + row) * (tileH / 2);
      const fill = (col + row) % 2 === 0 ? color1 : color2;
      tiles.push(
        <polygon
          key={`${col}-${row}`}
          points={`
            ${tx + tileW / 2},${ty}
            ${tx + tileW},${ty + tileH / 2}
            ${tx + tileW / 2},${ty + tileH}
            ${tx},${ty + tileH / 2}
          `}
          fill={fill}
          stroke={lineColor}
          strokeWidth="0.5"
        />
      );
    }
  }
  return <>{tiles}</>;
}

/** Isometric wall — left face */
export function IsoWallLeft({
  x, y, w, h, fill = '#D0C8BC', shadowFill = '#B8B0A4',
}: {
  x: number; y: number; w: number; h: number;
  fill?: string; shadowFill?: string;
}) {
  return (
    <>
      <polygon
        points={`${x},${y} ${x + w},${y - w / 2} ${x + w},${y - w / 2 + h} ${x},${y + h}`}
        fill={fill}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.5"
      />
      {/* Dado rail */}
      <polygon
        points={`${x},${y + h * 0.6} ${x + w},${y - w / 2 + h * 0.6} ${x + w},${y - w / 2 + h * 0.6 + 4} ${x},${y + h * 0.6 + 4}`}
        fill={shadowFill}
      />
    </>
  );
}

/** Isometric wall — right face */
export function IsoWallRight({
  x, y, w, h, fill = '#C0B8AC',
}: {
  x: number; y: number; w: number; h: number; fill?: string;
}) {
  return (
    <polygon
      points={`${x},${y} ${x - w},${y - w / 2} ${x - w},${y - w / 2 + h} ${x},${y + h}`}
      fill={fill}
      stroke="rgba(0,0,0,0.15)"
      strokeWidth="0.5"
    />
  );
}

/** Drop shadow under a sprite */
export function SpriteShadow({ cx, cy, rx = 16, ry = 6 }: { cx: number; cy: number; rx?: number; ry?: number }) {
  return (
    <ellipse
      cx={cx} cy={cy}
      rx={rx} ry={ry}
      fill="rgba(0,0,0,0.18)"
    />
  );
}

/** Pixel window with light glow */
export function PixelWindow({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="sprite"
      width="80" height="70"
      viewBox="0 0 40 35"
      style={{ position: 'absolute', left: x, top: y }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Frame */}
      <rect x="0" y="0" width="40" height="35" fill="#8B7355" />
      <rect x="2" y="2" width="36" height="31" fill="#AED6F1" />
      {/* Panes */}
      <rect x="2" y="2" width="17" height="14" fill="#85C1E9" />
      <rect x="21" y="2" width="17" height="14" fill="#AED6F1" />
      <rect x="2" y="18" width="17" height="15" fill="#AED6F1" />
      <rect x="21" y="18" width="17" height="15" fill="#7FB3D3" />
      {/* Dividers */}
      <rect x="0" y="15" width="40" height="3" fill="#8B7355" />
      <rect x="18" y="0" width="4" height="35" fill="#8B7355" />
      {/* Light reflection */}
      <rect x="4" y="4" width="5" height="10" fill="rgba(255,255,255,0.35)" />
      <rect x="23" y="4" width="3" height="6" fill="rgba(255,255,255,0.25)" />
      {/* Glow effect on floor below */}
      <rect x="0" y="34" width="40" height="2" fill="rgba(174,214,241,0.3)" />
    </svg>
  );
}
