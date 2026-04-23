import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlayerStatus } from '../hooks/usePlayerState';
import {
  getCharacterThread,
  getLastChatMessagePreview,
  searchChatThreads,
  speakerLabel,
} from '../characterChatThreads';
import { peerAvatarSpec } from '../characterAvatars';
import PixelSprite, { type SpriteVariant } from './PixelSprite';
import PixelCat from './PixelCat';

const CHAT_DRAWER_TOTAL_WIDTH = 250;
const CHAT_NAV_RAIL_WIDTH = 50;
const CHAT_LIST_PANEL_WIDTH = 200;
const CHAT_DRAWER_Z = 180;
const CHAT_DRAWER_BG = '#f5f5f5';
const CHAT_NAV_RAIL_BG = '#ebebeb';
const WECHAT_GREEN = '#07C160';
const CHAT_DRAWER_ROW_SELECTED = 'rgba(7, 193, 96, 0.18)';
const CHAT_QUICK_MENU_BG = '#ffffff';
const CHAT_QUICK_MENU_BORDER = '#e8e8e8';

const CHAT_AVATAR_BUST_BG = '#d8d6d0';
const CHAT_AVATAR_SPRITE_BUST_SCALE = 1.62;
const CHAT_AVATAR_SPRITE_TOP_NUDGE = 4;
const CHAT_AVATAR_CAT_BUST_SCALE = 1.32;
const CHAT_AVATAR_CAT_TOP_NUDGE = 1;

type MockChatAvatar =
  | { type: 'sprite'; variant: SpriteVariant; statusColor: string }
  | { type: 'cat' }
  | { type: 'group'; memberIds: string[] };

const MOCK_CHATS: {
  id: string;
  name: string;
  time: string;
  unread?: number;
  /** 置顶：折叠后从列表区隐藏，仅保留底部展开入口 */
  pinned?: boolean;
  avatar: MockChatAvatar;
}[] = [
  {
    id: 'team-core',
    name: 'Studio 核心群',
    time: '刚刚',
    unread: 2,
    pinned: true,
    avatar: { type: 'group', memberIds: ['user', 'hermes', 'orion', 'nova'] },
  },
  {
    id: 'hermes',
    name: 'Hermes',
    time: '09:20',
    unread: 6,
    pinned: true,
    avatar: { type: 'sprite', variant: 'messenger', statusColor: '#FF9800' },
  },
  {
    id: 'orion',
    name: 'Orion',
    time: '昨天',
    pinned: true,
    avatar: { type: 'sprite', variant: 'assistant2', statusColor: '#2196F3' },
  },
  {
    id: 'nova',
    name: 'Nova',
    time: '星期二',
    pinned: true,
    avatar: { type: 'sprite', variant: 'assistant1', statusColor: '#4CAF50' },
  },
  { id: 'mochi', name: 'Mochi', time: '08:12', pinned: true, avatar: { type: 'cat' } },
  { id: 'opc-qinglan', name: 'OPC_青岚', time: '11:02', pinned: true, avatar: { type: 'sprite', variant: 'visitor1', statusColor: '#FF9800' } },
  { id: 'opc-xuesong', name: 'OPC_雪松', time: '10:48', pinned: true, avatar: { type: 'sprite', variant: 'visitor2', statusColor: '#1ABC9C' } },
  { id: 'opc-chaoxi', name: 'OPC_潮汐', time: '昨天', pinned: true, avatar: { type: 'sprite', variant: 'visitor3', statusColor: '#E91E63' } },
  { id: 'opc-yanchi', name: 'OPC_砚池', time: '周一', pinned: true, avatar: { type: 'sprite', variant: 'agent', statusColor: '#9B59B6' } },
  { id: 'opc-xingzhu', name: 'OPC_星渚', time: '周日', unread: 1, pinned: true, avatar: { type: 'sprite', variant: 'visitor1', statusColor: '#F39C12' } },
  { id: 'opc-baiyu', name: 'OPC_白榆', time: '10:20', avatar: { type: 'sprite', variant: 'visitor2', statusColor: '#2196F3' } },
  { id: 'opc-mozhu', name: 'OPC_墨竹', time: '09:55', avatar: { type: 'sprite', variant: 'assistant2', statusColor: '#27AE60' } },
  { id: 'opc-hupo', name: 'OPC_琥珀', time: '09:40', unread: 3, avatar: { type: 'sprite', variant: 'visitor3', statusColor: '#E67E22' } },
  { id: 'opc-liuying', name: 'OPC_流萤', time: '09:12', avatar: { type: 'sprite', variant: 'agent', statusColor: '#8E44AD' } },
  { id: 'opc-beichen', name: 'OPC_北宸', time: '08:50', avatar: { type: 'sprite', variant: 'visitor1', statusColor: '#16A085' } },
  { id: 'opc-zhike', name: 'OPC_枳壳', time: '08:44', avatar: { type: 'sprite', variant: 'assistant1', statusColor: '#E74C3C' } },
  { id: 'opc-yinhe', name: 'OPC_银禾', time: '08:30', avatar: { type: 'sprite', variant: 'visitor2', statusColor: '#3498DB' } },
  { id: 'opc-qianyu', name: 'OPC_浅屿', time: '08:22', avatar: { type: 'sprite', variant: 'visitor3', statusColor: '#C0392B' } },
  { id: 'opc-wanzhao', name: 'OPC_晚照', time: '08:18', avatar: { type: 'sprite', variant: 'assistant2', statusColor: '#2980B9' } },
  { id: 'opc-tinglan', name: 'OPC_听澜', time: '08:05', avatar: { type: 'sprite', variant: 'visitor1', statusColor: '#D35400' } },
];

const DRAWER_THREAD_IDS = MOCK_CHATS.map(c => c.id);
const MOCK_CHATS_PINNED = MOCK_CHATS.filter(c => c.pinned);
const MOCK_CHATS_NORMAL = MOCK_CHATS.filter(c => !c.pinned);

function initialUnreadByThread(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const c of MOCK_CHATS) m[c.id] = c.unread ?? 0;
  return m;
}

const GROUP_CELL_SPRITE_BUST_SCALE = 1.22;
const GROUP_CELL_SPRITE_TOP_NUDGE = 1;
const GROUP_CELL_CAT_BUST_SCALE = 0.78;
const GROUP_CELL_CAT_TOP_NUDGE = 0;

function excerptAroundMatch(text: string, query: string, radius = 20): string {
  const q = query.trim();
  if (!q) return text.length > 44 ? `${text.slice(0, 44)}…` : text;
  const low = text.toLowerCase();
  const qi = q.toLowerCase();
  const idx = low.indexOf(qi);
  if (idx < 0) return text.length > 44 ? `${text.slice(0, 44)}…` : text;
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + q.length + radius);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const low = text.toLowerCase();
  const idx = low.indexOf(q.toLowerCase());
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fff59d', color: 'inherit', padding: '0 1px', borderRadius: 2 }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function SearchMagnifierIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth={2} />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function QuickMenuIconStartGroup({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M5 7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-2.5L10 20v-4H7a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuickMenuIconAddFriend({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 11a3 3 0 100-6 3 3 0 000 6zM4 20a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path d="M19 8v6M16 11h6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function QuickMenuIconNewNote({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M6 4h8l4 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M14 4v4h4M8 13h8M8 17h5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/** 微信 PC 左侧窄栏：头像 + 功能 icon + 底部手机 / 菜单（浅色） */
function WeChatDrawerNavRail({
  statusColor,
  totalUnread,
  onDemo,
}: {
  statusColor: string;
  totalUnread: number;
  onDemo: (msg: string) => void;
}) {
  const iconBtn = (active: boolean) =>
    ({
      width: 38,
      height: 38,
      borderRadius: 8,
      border: 'none',
      background: active ? 'rgba(7, 193, 96, 0.2)' : 'transparent',
      color: active ? WECHAT_GREEN : '#444444',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      position: 'relative',
      flexShrink: 0,
    }) as const;

  return (
    <nav
      aria-label="主导航"
      style={{
        width: CHAT_NAV_RAIL_WIDTH,
        flex: `0 0 ${CHAT_NAV_RAIL_WIDTH}px`,
        background: CHAT_NAV_RAIL_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        boxSizing: 'border-box',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#d8d6d0',
          marginBottom: 12,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ marginTop: 2, transform: 'scale(1.28)', transformOrigin: 'top center', lineHeight: 0 }}>
          <PixelSprite variant="user" name="You" statusColor={statusColor} scale={1} hideLabel animateIdle={false} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
        <motion.button
          type="button"
          aria-label="微信"
          title="微信"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(true)}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M5 7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2h-2.5L10 20v-4H7a2 2 0 01-2-2V7z"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
          </svg>
          {totalUnread > 0 ? (
            <span
              style={{
                position: 'absolute',
                top: -1,
                right: -1,
                minWidth: 15,
                height: 15,
                padding: '0 3px',
                borderRadius: 8,
                background: '#fa5151',
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          ) : null}
        </motion.button>

        <motion.button
          type="button"
          aria-label="通讯录"
          title="通讯录"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('通讯录（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M12 11a3 3 0 100-6 3 3 0 000 6zM4 20a8 8 0 0116 0"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          aria-label="收藏"
          title="收藏"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('收藏（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M5 10l7-4 7 4v7l-7 4-7-4v-7z"
              stroke="currentColor"
              strokeWidth={1.45}
              strokeLinejoin="round"
            />
            <path d="M12 6v8M5 10l7 4 7-4" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          aria-label="朋友圈"
          title="朋友圈"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('朋友圈（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.5} />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 4,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#fa5151',
              border: '1.5px solid #ebebeb',
            }}
            aria-hidden
          />
        </motion.button>

        <motion.button
          type="button"
          aria-label="看一看"
          title="看一看"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('看一看（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 4l8 8-8 8-8-8 8-8z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          aria-label="小程序"
          title="小程序"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('小程序（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <ellipse cx="9" cy="12" rx="5" ry="7" stroke="currentColor" strokeWidth={1.5} />
            <ellipse cx="15" cy="12" rx="5" ry="7" stroke="currentColor" strokeWidth={1.5} />
          </svg>
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
        <motion.button
          type="button"
          aria-label="手机"
          title="手机"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('手机（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth={1.5} />
            <path d="M10 6h4" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
          </svg>
        </motion.button>
        <motion.button
          type="button"
          aria-label="菜单与设置"
          title="更多"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          style={iconBtn(false)}
          onClick={() => onDemo('菜单与设置（演示）')}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M5 7h14M5 12h14M5 17h10" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
          </svg>
        </motion.button>
      </div>
    </nav>
  );
}

function GroupMiniMemberBust({ memberId }: { memberId: string }) {
  const spec = peerAvatarSpec(memberId);
  const label = speakerLabel(memberId);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        background: CHAT_AVATAR_BUST_BG,
      }}
    >
      {spec.kind === 'sprite' ? (
        <div
          style={{
            lineHeight: 0,
            marginTop: GROUP_CELL_SPRITE_TOP_NUDGE,
            transform: `scale(${GROUP_CELL_SPRITE_BUST_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <PixelSprite variant={spec.variant} name={label} statusColor={spec.statusColor} scale={1} hideLabel animateIdle={false} />
        </div>
      ) : (
        <div
          style={{
            lineHeight: 0,
            marginTop: GROUP_CELL_CAT_TOP_NUDGE,
            transform: `scale(${GROUP_CELL_CAT_BUST_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <PixelCat hideLabel />
        </div>
      )}
    </div>
  );
}

function GroupRowAvatar({ memberIds }: { memberIds: string[] }) {
  const cells = memberIds.slice(0, 4);
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 4,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 1,
        background: '#e5e5e5',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {cells.map(mid => (
        <div key={mid} style={{ minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
          <GroupMiniMemberBust memberId={mid} />
        </div>
      ))}
    </div>
  );
}

function ChatRowAvatar({ name, avatar }: { name: string; avatar: MockChatAvatar }) {
  if (avatar.type === 'group') return <GroupRowAvatar memberIds={avatar.memberIds} />;
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 4,
        background: CHAT_AVATAR_BUST_BG,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {avatar.type === 'sprite' ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
            marginTop: CHAT_AVATAR_SPRITE_TOP_NUDGE,
            transform: `scale(${CHAT_AVATAR_SPRITE_BUST_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <PixelSprite variant={avatar.variant} name={name} statusColor={avatar.statusColor} scale={1} hideLabel animateIdle={false} />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
            marginTop: CHAT_AVATAR_CAT_TOP_NUDGE,
            transform: `scale(${CHAT_AVATAR_CAT_BUST_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <PixelCat hideLabel />
        </div>
      )}
    </div>
  );
}

interface StatusHUDProps {
  currentStatus: PlayerStatus;
  statusLabel: string;
  statusColor: string;
  onStatusChange: (s: PlayerStatus) => void;
  transitioning: boolean;
  activeTask: string | null;
  onDismissTask: () => void;
  onOpenCharacterChat: (characterId: string, scrollToMessageIndex?: number) => void;
  activeThreadId?: string | null;
  /** 会话列表副标题行：覆盖为「最后一条消息」文案（与全屏聊天实时同步） */
  threadLastMessagePreview?: Record<string, string>;
}

const MODES: { status: PlayerStatus; emoji: string; label: string }[] = [
  { status: 'WORKING', emoji: '💻', label: 'Studio' },
  { status: 'SOCIALIZING', emoji: '☕', label: 'Lounge' },
  { status: 'EXPLORING', emoji: '🌿', label: 'Plaza' },
];

const STATUS_ZONE_INDEX: Record<PlayerStatus, number> = { WORKING: 0, SOCIALIZING: 1, EXPLORING: 2 };

export default function StatusHUD({
  currentStatus,
  statusLabel,
  statusColor,
  onStatusChange,
  transitioning,
  activeTask,
  onDismissTask,
  onOpenCharacterChat,
  activeThreadId = null,
  threadLastMessagePreview,
}: StatusHUDProps) {
  const zoneIndex = STATUS_ZONE_INDEX[currentStatus];
  const listPreviewLine = (threadId: string) =>
    threadLastMessagePreview?.[threadId] ?? getLastChatMessagePreview(threadId);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatQuickMenuOpen, setChatQuickMenuOpen] = useState(false);
  const [quickActionBanner, setQuickActionBanner] = useState<string | null>(null);
  /** true = 置顶区已折叠，列表中不展示置顶会话 */
  const [pinnedChatsCollapsed, setPinnedChatsCollapsed] = useState(false);
  const chatSearchInputRef = useRef<HTMLInputElement>(null);
  const chatQuickMenuWrapRef = useRef<HTMLDivElement>(null);
  const prevActiveThreadRef = useRef<string | null>(null);
  const [unreadById, setUnreadById] = useState<Record<string, number>>(initialUnreadByThread);

  const chatSearchTrim = chatSearchQuery.trim();
  const searchHits = useMemo(() => searchChatThreads(chatSearchQuery, DRAWER_THREAD_IDS), [chatSearchQuery]);
  const contactHits = useMemo(() => searchHits.filter(h => h.type === 'contact'), [searchHits]);
  const messageHits = useMemo(() => searchHits.filter(h => h.type === 'message'), [searchHits]);
  const totalUnread = useMemo(
    () => DRAWER_THREAD_IDS.reduce((s, id) => s + (unreadById[id] ?? 0), 0),
    [unreadById],
  );

  /** 离开某会话（关全屏或切到另一会话）后标为已读，清除列表红点 */
  useEffect(() => {
    const prev = prevActiveThreadRef.current;
    if (prev !== null && prev !== activeThreadId) {
      setUnreadById(u => ({ ...u, [prev]: 0 }));
    }
    prevActiveThreadRef.current = activeThreadId;
  }, [activeThreadId]);

  useEffect(() => {
    if (!chatDrawerOpen) {
      setChatSearchQuery('');
      setChatQuickMenuOpen(false);
      setQuickActionBanner(null);
    }
  }, [chatDrawerOpen]);

  useEffect(() => {
    if (!chatQuickMenuOpen) return;
    const onDocDown = (e: MouseEvent) => {
      const wrap = chatQuickMenuWrapRef.current;
      if (wrap && !wrap.contains(e.target as Node)) setChatQuickMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [chatQuickMenuOpen]);

  useEffect(() => {
    if (!quickActionBanner) return;
    const t = window.setTimeout(() => setQuickActionBanner(null), 2600);
    return () => window.clearTimeout(t);
  }, [quickActionBanner]);

  useEffect(() => {
    if (!chatDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeThreadId != null) return;
        if (chatQuickMenuOpen) {
          setChatQuickMenuOpen(false);
          return;
        }
        setChatDrawerOpen(false);
        setChatSearchQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatDrawerOpen, chatQuickMenuOpen, activeThreadId]);

  const rowBase = {
    width: '100%' as const,
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
    padding: '11px 12px',
    border: 'none' as const,
    cursor: 'pointer' as const,
    textAlign: 'left' as const,
    boxSizing: 'border-box' as const,
  };

  const renderChatDrawerRow = (row: (typeof MOCK_CHATS)[number]) => {
    const selected = activeThreadId != null && row.id === activeThreadId;
    const unread = unreadById[row.id] ?? 0;
    return (
      <motion.button
        key={row.id}
        type="button"
        onClick={() => {
          onOpenCharacterChat(row.id);
        }}
        whileHover={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.26)' : 'rgba(0,0,0,0.04)' }}
        whileTap={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.32)' : 'rgba(0,0,0,0.07)' }}
        style={{
          ...rowBase,
          background: selected ? CHAT_DRAWER_ROW_SELECTED : 'transparent',
          boxShadow: selected ? `inset 3px 0 0 ${WECHAT_GREEN}` : 'none',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ChatRowAvatar name={row.name} avatar={row.avatar} />
          {unread > 0 ? (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 8,
                background: '#fa5151',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {unread > 99 ? '99+' : unread}
            </span>
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
            <span
              style={{
                fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                fontSize: 13,
                fontWeight: 600,
                color: '#191919',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.name}
            </span>
            <span
              style={{
                fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                fontSize: 10,
                color: '#b2b2b2',
                flexShrink: 0,
              }}
            >
              {row.time}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
              fontSize: 11,
              color: '#888888',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {listPreviewLine(row.id)}
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingBottom: 4 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: zoneIndex === i ? 18 : 5,
                height: 5,
                borderRadius: 2.5,
                background: zoneIndex === i ? statusColor : 'rgba(0,0,0,0.18)',
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
          ))}
        </div>
        <motion.div
          className="glass-panel"
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {MODES.map(mode => {
            const active = currentStatus === mode.status;
            return (
              <motion.button
                key={mode.status}
                onClick={() => !transitioning && onStatusChange(mode.status)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '7px 13px',
                  borderRadius: 9,
                  border: active ? '0.33px solid rgba(0,0,0,0.15)' : '0.33px solid transparent',
                  background: active ? 'rgba(255,255,255,0.9)' : 'transparent',
                  cursor: transitioning ? 'not-allowed' : 'pointer',
                  color: active ? '#1a1a2e' : '#666',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  opacity: transitioning && !active ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 14 }}>{mode.emoji}</span>
                <span>{mode.label}</span>
                {active && (
                  <motion.div layoutId="activeStatusDot" style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor }} />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        style={{ position: 'fixed', top: 'calc(14px + env(safe-area-inset-top, 0px))', right: 16, zIndex: 100 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="glass-panel" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
          <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#1a1a2e' }}>{statusLabel}</span>
        </div>
      </motion.div>

      <motion.div
        style={{ position: 'fixed', top: 'calc(14px + env(safe-area-inset-top, 0px))', left: 16, zIndex: 100 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '8px 14px',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            boxSizing: 'border-box',
          }}
        >
          <motion.button
            type="button"
            aria-label="打开对话列表"
            aria-expanded={chatDrawerOpen}
            onClick={e => {
              e.stopPropagation();
              setChatDrawerOpen(v => !v);
            }}
            whileTap={{ scale: 0.92 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 14,
              height: 14,
              padding: 0,
              margin: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#1a1a2e',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '-0.3px',
              color: '#1a1a2e',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            OPC
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {chatDrawerOpen && (
          <>
            <motion.div
              key="chat-drawer-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setChatSearchQuery('');
                setChatQuickMenuOpen(false);
                setChatDrawerOpen(false);
              }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.42)', zIndex: CHAT_DRAWER_Z }}
            />
            <motion.aside
              key="chat-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="对话列表"
              initial={{ x: -CHAT_DRAWER_TOTAL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -CHAT_DRAWER_TOTAL_WIDTH }}
              transition={{ type: 'spring', damping: 30, stiffness: 380 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100dvh',
                width: CHAT_DRAWER_TOTAL_WIDTH,
                zIndex: CHAT_DRAWER_Z + 1,
                background: CHAT_NAV_RAIL_BG,
                boxShadow: '4px 0 20px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                boxSizing: 'border-box',
              }}
            >
              <WeChatDrawerNavRail statusColor={statusColor} totalUnread={totalUnread} onDemo={setQuickActionBanner} />
              <div
                style={{
                  width: CHAT_LIST_PANEL_WIDTH,
                  flex: `0 0 ${CHAT_LIST_PANEL_WIDTH}px`,
                  minWidth: 0,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  background: CHAT_DRAWER_BG,
                  borderLeft: '1px solid #e0e0e0',
                  boxSizing: 'border-box',
                }}
              >
              <div
                style={{
                  padding: '10px 12px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexShrink: 0,
                  borderBottom: '1px solid #ebebeb',
                  background: CHAT_DRAWER_BG,
                }}
              >
                <label
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#ffffff',
                    borderRadius: 4,
                    padding: '4px 8px',
                    border: '1px solid #e7e7e7',
                    boxSizing: 'border-box',
                    minWidth: 0,
                  }}
                >
                  <span style={{ color: '#b2b2b2', display: 'flex', flexShrink: 0 }}>
                    <SearchMagnifierIcon size={13} />
                  </span>
                  <input
                    ref={chatSearchInputRef}
                    type="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="搜索"
                    value={chatSearchQuery}
                    onChange={e => setChatSearchQuery(e.target.value)}
                    aria-label="搜索对话或聊天记录"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                      fontSize: 12,
                      color: '#191919',
                      padding: '2px 0',
                    }}
                  />
                  {chatSearchTrim ? (
                    <button
                      type="button"
                      aria-label="清除搜索"
                      onClick={e => {
                        e.preventDefault();
                        setChatSearchQuery('');
                        chatSearchInputRef.current?.focus();
                      }}
                      style={{
                        flexShrink: 0,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: 'none',
                        background: '#d4d4d4',
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  ) : null}
                </label>
                <div ref={chatQuickMenuWrapRef} style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    type="button"
                    title="快捷操作"
                    aria-label="快捷操作"
                    aria-haspopup="menu"
                    aria-expanded={chatQuickMenuOpen}
                    onClick={e => {
                      e.stopPropagation();
                      setChatQuickMenuOpen(v => !v);
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #e0e0e0',
                      background: '#ffffff',
                      color: '#333333',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    <PlusIcon size={15} />
                  </button>
                  {chatQuickMenuOpen ? (
                    <div role="menu" aria-label="快捷操作" style={{ position: 'absolute', top: 'calc(100% + 7px)', right: 0, width: 176, zIndex: 30, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.12))' }}>
                      <div
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: 8,
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderBottom: `6px solid ${CHAT_QUICK_MENU_BG}`,
                        }}
                        aria-hidden
                      />
                      <div
                        style={{
                          marginTop: 0,
                          background: CHAT_QUICK_MENU_BG,
                          borderRadius: 12,
                          border: `1px solid ${CHAT_QUICK_MENU_BORDER}`,
                          overflow: 'hidden',
                          padding: '4px 0',
                          boxSizing: 'border-box',
                        }}
                      >
                        <motion.button
                          type="button"
                          role="menuitem"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                          whileTap={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                          onClick={e => {
                            e.stopPropagation();
                            setChatQuickMenuOpen(false);
                            onOpenCharacterChat('team-core');
                          }}
                          style={{
                            ...rowBase,
                            borderBottom: `1px solid ${CHAT_QUICK_MENU_BORDER}`,
                            background: 'transparent',
                            color: '#191919',
                          }}
                        >
                          <span style={{ color: '#333', display: 'flex', flexShrink: 0 }}>
                            <QuickMenuIconStartGroup size={20} />
                          </span>
                          <span style={{ fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 15, fontWeight: 500 }}>发起群聊</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          role="menuitem"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                          whileTap={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                          onClick={e => {
                            e.stopPropagation();
                            setChatQuickMenuOpen(false);
                            setQuickActionBanner('已打开「添加朋友」（演示）');
                          }}
                          style={{
                            ...rowBase,
                            borderBottom: `1px solid ${CHAT_QUICK_MENU_BORDER}`,
                            background: 'transparent',
                            color: '#191919',
                          }}
                        >
                          <span style={{ color: '#333', display: 'flex', flexShrink: 0 }}>
                            <QuickMenuIconAddFriend size={20} />
                          </span>
                          <span style={{ fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 15, fontWeight: 500 }}>添加朋友</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          role="menuitem"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                          whileTap={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
                          onClick={e => {
                            e.stopPropagation();
                            setChatQuickMenuOpen(false);
                            setQuickActionBanner('已打开「新建笔记」（演示）');
                          }}
                          style={{ ...rowBase, background: 'transparent', color: '#191919' }}
                        >
                          <span style={{ color: '#333', display: 'flex', flexShrink: 0 }}>
                            <QuickMenuIconNewNote size={20} />
                          </span>
                          <span style={{ fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif', fontSize: 15, fontWeight: 500 }}>新建笔记</span>
                        </motion.button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {quickActionBanner ? (
                <div
                  role="status"
                  style={{
                    flexShrink: 0,
                    margin: '0 12px 8px',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.06)',
                    fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                    fontSize: 12,
                    color: '#555',
                    lineHeight: 1.4,
                  }}
                >
                  {quickActionBanner}
                </div>
              ) : null}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  background: CHAT_DRAWER_BG,
                }}
              >
                {!chatSearchTrim ? (
                  <>
                    {!pinnedChatsCollapsed && MOCK_CHATS_PINNED.length > 0 ? (
                      <>
                        <div
                          style={{
                            padding: '6px 12px 2px',
                            fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                            fontSize: 11,
                            color: '#888888',
                          }}
                        >
                          置顶聊天
                        </div>
                        {MOCK_CHATS_PINNED.map(renderChatDrawerRow)}
                        <div
                          style={{
                            height: 1,
                            margin: '4px 12px 6px',
                            background: 'linear-gradient(90deg, transparent, #e0e0e0 12%, #e0e0e0 88%, transparent)',
                          }}
                        />
                      </>
                    ) : null}
                    {MOCK_CHATS_NORMAL.map(renderChatDrawerRow)}
                  </>
                ) : searchHits.length === 0 ? (
                  <div
                    style={{
                      padding: '28px 14px',
                      textAlign: 'center',
                      fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                      fontSize: 12,
                      color: '#999999',
                      lineHeight: 1.5,
                    }}
                  >
                    未找到「{chatSearchTrim}」相关会话或聊天记录
                  </div>
                ) : (
                  <>
                    {contactHits.length > 0 ? (
                      <div
                        style={{
                          padding: '6px 12px 2px',
                          fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                          fontSize: 11,
                          color: '#888888',
                        }}
                      >
                        联系人
                      </div>
                    ) : null}
                    {contactHits.map(hit => {
                      const row = MOCK_CHATS.find(c => c.id === hit.threadId);
                      if (!row) return null;
                      const thread = getCharacterThread(row.id);
                      const subMatch =
                        thread.subtitle && thread.subtitle.toLowerCase().includes(chatSearchTrim.toLowerCase());
                      const selected = activeThreadId != null && row.id === activeThreadId;
                      const unread = unreadById[row.id] ?? 0;
                      return (
                        <motion.button
                          key={`search-contact-${row.id}`}
                          type="button"
                          onClick={() => {
                            onOpenCharacterChat(row.id);
                            setChatSearchQuery('');
                          }}
                          whileHover={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.26)' : 'rgba(0,0,0,0.04)' }}
                          whileTap={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.32)' : 'rgba(0,0,0,0.07)' }}
                          style={{
                            ...rowBase,
                            background: selected ? CHAT_DRAWER_ROW_SELECTED : 'transparent',
                            boxShadow: selected ? `inset 3px 0 0 ${WECHAT_GREEN}` : 'none',
                          }}
                        >
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <ChatRowAvatar name={row.name} avatar={row.avatar} />
                            {unread > 0 ? (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: -4,
                                  right: -4,
                                  minWidth: 16,
                                  height: 16,
                                  padding: '0 4px',
                                  borderRadius: 8,
                                  background: '#fa5151',
                                  color: '#fff',
                                  fontSize: 10,
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontFamily: 'system-ui, sans-serif',
                                }}
                              >
                                {unread > 99 ? '99+' : unread}
                              </span>
                            ) : null}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
                              <span
                                style={{
                                  fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#191919',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <HighlightMatch text={row.name} query={chatSearchTrim} />
                              </span>
                            </div>
                            <div
                              style={{
                                fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                                fontSize: 11,
                                color: '#888888',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {subMatch ? (
                                <HighlightMatch text={thread.subtitle} query={chatSearchTrim} />
                              ) : (
                                listPreviewLine(row.id)
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                    {messageHits.length > 0 ? (
                      <div
                        style={{
                          padding: '8px 12px 2px',
                          fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                          fontSize: 11,
                          color: '#888888',
                        }}
                      >
                        聊天记录
                      </div>
                    ) : null}
                    {messageHits.map(hit => {
                      const row = MOCK_CHATS.find(c => c.id === hit.threadId);
                      if (!row) return null;
                      const msg = getCharacterThread(hit.threadId).messages[hit.messageIndex];
                      const raw = msg?.text ?? '';
                      const excerpt = excerptAroundMatch(raw, chatSearchTrim);
                      const selected = activeThreadId != null && hit.threadId === activeThreadId;
                      return (
                        <motion.button
                          key={`search-msg-${hit.threadId}-${hit.messageIndex}`}
                          type="button"
                          onClick={() => {
                            onOpenCharacterChat(hit.threadId, hit.messageIndex);
                            setChatSearchQuery('');
                          }}
                          whileHover={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.26)' : 'rgba(0,0,0,0.04)' }}
                          whileTap={{ backgroundColor: selected ? 'rgba(7, 193, 96, 0.32)' : 'rgba(0,0,0,0.07)' }}
                          style={{
                            ...rowBase,
                            background: selected ? CHAT_DRAWER_ROW_SELECTED : 'transparent',
                            boxShadow: selected ? `inset 3px 0 0 ${WECHAT_GREEN}` : 'none',
                          }}
                        >
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <ChatRowAvatar name={row.name} avatar={row.avatar} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
                              <span
                                style={{
                                  fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#191919',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.name}
                              </span>
                              <span
                                style={{
                                  fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                                  fontSize: 10,
                                  color: '#b2b2b2',
                                  flexShrink: 0,
                                }}
                              >
                                记录
                              </span>
                            </div>
                            <div
                              style={{
                                fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                                fontSize: 11,
                                color: '#888888',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <HighlightMatch text={excerpt} query={chatSearchTrim} />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPinnedChatsCollapsed(c => !c)}
                disabled={MOCK_CHATS_PINNED.length === 0}
                aria-expanded={!pinnedChatsCollapsed}
                aria-label={pinnedChatsCollapsed ? '展开置顶聊天' : '折叠置顶聊天'}
                style={{
                  flexShrink: 0,
                  border: 'none',
                  borderTop: '1px solid #ebebeb',
                  padding: '8px 12px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: 'system-ui, "PingFang SC", "Microsoft YaHei", sans-serif',
                  fontSize: 11,
                  color: MOCK_CHATS_PINNED.length === 0 ? '#ccc' : '#999',
                  background: CHAT_DRAWER_BG,
                  cursor: MOCK_CHATS_PINNED.length === 0 ? 'default' : 'pointer',
                  userSelect: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: 12, opacity: 0.75 }} aria-hidden>
                  ☰
                </span>
                <span>
                  {pinnedChatsCollapsed
                    ? `展开置顶聊天（${MOCK_CHATS_PINNED.length}）`
                    : '折叠置顶聊天'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.6 }} aria-hidden>
                  {pinnedChatsCollapsed ? '▼' : '▲'}
                </span>
              </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {activeTask && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: 'calc(104px + env(safe-area-inset-bottom, 0px))',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 100,
            width: 'calc(100vw - 40px)',
            maxWidth: 360,
          }}
        >
          <span style={{ fontSize: 16 }}>📌</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 500, color: '#1a1a2e' }}>{activeTask}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 10, color: '#888' }}>Task selected · Focus mode</div>
          </div>
          <button
            onClick={onDismissTask}
            style={{
              fontFamily: 'Inter',
              fontSize: 11,
              fontWeight: 500,
              background: 'rgba(0,0,0,0.06)',
              border: '0.33px solid rgba(0,0,0,0.1)',
              borderRadius: 6,
              padding: '3px 8px',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </>
  );
}
