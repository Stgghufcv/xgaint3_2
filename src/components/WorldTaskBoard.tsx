import { motion } from 'framer-motion';
import { WORLD_TASK_BOARD_TOP_PX } from '../worldUserLayout';

const TASKS = [
  { id: 'launch', emoji: '🚀', label: 'Launch v1.2', tag: 'TODAY', color: '#E74C3C' },
  { id: 'review', emoji: '📋', label: 'Review PRD', tag: 'IN PROGRESS', color: '#F39C12' },
  { id: 'pitch', emoji: '💼', label: 'Investor Pitch Deck', tag: 'UPCOMING', color: '#3498DB' },
  { id: 'collab', emoji: '🤝', label: 'Collab: OPC_Studio_47', tag: 'NEW', color: '#9B59B6' },
];

interface WorldTaskBoardProps {
  onTaskClick: (task: string) => void;
}

/** 固定在视口顶部，随空间横滑仍留在最上层（`top` 与 `WORLD_TASK_BOARD_TOP_PX` 一致） */
export default function WorldTaskBoard({ onTaskClick }: WorldTaskBoardProps) {
  return (
    <motion.div
      onClick={e => e.stopPropagation()}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      className="glass-panel"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        top: `calc(${WORLD_TASK_BOARD_TOP_PX}px + env(safe-area-inset-top, 0px))`,
        padding: '14px 14px',
        zIndex: 72,
        maxWidth: 440,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            📌
          </div>
          <div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>OPC Task Board</div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888', fontWeight: 400 }}>Q2 Sprint · 4 active</div>
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Inter',
            fontSize: 10,
            fontWeight: 600,
            color: '#27AE60',
            background: 'rgba(39,174,96,0.1)',
            borderRadius: 100,
            padding: '2px 8px',
            border: '0.33px solid rgba(39,174,96,0.3)',
          }}
        >
          LIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {TASKS.map(task => (
          <motion.button
            key={task.id}
            onClick={() => onTaskClick(task.label)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.03)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 5,
              padding: '9px 10px',
              background: 'rgba(255,255,255,0.55)',
              border: '0.33px solid rgba(0,0,0,0.08)',
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{task.emoji}</span>
              <div
                style={{
                  fontFamily: 'Inter',
                  fontSize: 8,
                  fontWeight: 700,
                  color: task.color,
                  background: `${task.color}18`,
                  border: `0.33px solid ${task.color}50`,
                  borderRadius: 100,
                  padding: '1px 5px',
                  letterSpacing: '0.3px',
                }}
              >
                {task.tag}
              </div>
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: '#1a1a2e', lineHeight: 1.3 }}>{task.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
