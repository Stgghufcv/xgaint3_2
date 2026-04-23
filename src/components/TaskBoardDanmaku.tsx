import { useCallback, useEffect, useRef, useState } from 'react';
import {
  WORLD_TASK_BOARD_TOP_PX,
  WORLD_TASK_BOARD_EST_HEIGHT_PX,
} from '../worldUserLayout';

const DANMAKU_BELOW_TASKBOARD_PX = 30;

const ROWS: { id: string; text: string; durationSec: number }[] = [
  { id: 'r0', text: 'OPC_北辰：急求会 Blender 的同学帮渲一镜夜景，可有偿奶茶！', durationSec: 42 },
  { id: 'r1', text: 'OPC_松果：Lounge 投影仪 HDMI 无信号，求路过的大佬 5 分钟救命', durationSec: 50 },
  { id: 'r2', text: 'OPC_潮汐：谁有多余的 Type-C 转接头？现在在 Plaza 长椅这边', durationSec: 38 },
];

const DANMU_NS = 'taskboard-danmaku-marquee';

export default function TaskBoardDanmaku() {
  const [frozenRowId, setFrozenRowId] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ rowId: string; text: string; x: number; y: number } | null>(
    null,
  );
  const popRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(() => {
    setPopover(null);
    setFrozenRowId(null);
  }, []);

  useEffect(() => {
    if (!popover) return;
    const onDown = (e: MouseEvent) => {
      const el = popRef.current;
      if (el && el.contains(e.target as Node)) return;
      closePopover();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [popover, closePopover]);

  const topExpr = `calc(${WORLD_TASK_BOARD_TOP_PX}px + env(safe-area-inset-top, 0px) + ${WORLD_TASK_BOARD_EST_HEIGHT_PX}px + ${DANMAKU_BELOW_TASKBOARD_PX}px)`;

  return (
    <>
      <style>{`
        @keyframes ${DANMU_NS} {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        aria-label="OPC 求助弹幕"
        style={{
          position: 'fixed',
          left: 16,
          right: 16,
          top: topExpr,
          zIndex: 71,
          maxWidth: 440,
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROWS.map(row => {
            const frozen = frozenRowId === row.id;
            return (
              <div
                key={row.id}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const r = (e.target as HTMLElement).getBoundingClientRect();
                    setFrozenRowId(row.id);
                    setPopover({ rowId: row.id, text: row.text, x: r.left + r.width / 2, y: r.bottom });
                  }
                }}
                onClick={e => {
                  e.stopPropagation();
                  setFrozenRowId(row.id);
                  setPopover({ rowId: row.id, text: row.text, x: e.clientX, y: e.clientY });
                }}
                style={{
                  height: 26,
                  overflow: 'hidden',
                  position: 'relative',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'row',
                    whiteSpace: 'nowrap',
                    willChange: 'transform',
                    animation: `${DANMU_NS} ${row.durationSec}s linear infinite`,
                    animationPlayState: frozen ? 'paused' : 'running',
                  }}
                >
                  {[0, 1].map(i => (
                    <span
                      key={i}
                      style={{
                        paddingRight: 72,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: '26px',
                        color: '#ffffff',
                        textShadow:
                          '0 0 3px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.55), 0 0 1px rgba(0,0,0,1)',
                      }}
                    >
                      {row.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {popover && (
        <div
          ref={popRef}
          style={{
            position: 'fixed',
            left: Math.max(12, Math.min(popover.x - 100, typeof window !== 'undefined' ? window.innerWidth - 220 : 12)),
            top: popover.y + 10,
            zIndex: 85,
            width: 200,
            padding: '12px 12px 10px',
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
            boxSizing: 'border-box',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 11,
              color: '#888888',
              marginBottom: 8,
              lineHeight: 1.35,
              maxHeight: 56,
              overflow: 'hidden',
            }}
          >
            {popover.text}
          </div>
          <button
            type="button"
            onClick={() => {
              closePopover();
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#191919',
              background: '#f7f7f7',
              border: '1px solid #e7e7e7',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            查看详情
          </button>
        </div>
      )}
    </>
  );
}
