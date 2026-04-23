import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCharacterThread, speakerLabel } from '../characterChatThreads';
import { peerAvatarSpec } from '../characterAvatars';
import PixelSprite from './PixelSprite';
import PixelCat from './PixelCat';

const Z = 520;
const AVATAR = 40;
const AVATAR_GAP = 8;
const BUBBLE_MAX = 260;

const PEER_BUST = 1.35;
const ME_BUST = 1.35;
const CAT_BUST = 0.88;

function PeerAvatar({ characterId, displayName }: { characterId: string; displayName: string }) {
  const spec = peerAvatarSpec(characterId);
  return (
    <div
      style={{
        width: AVATAR,
        height: AVATAR,
        borderRadius: 4,
        overflow: 'hidden',
        background: '#d8d6d0',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {spec.kind === 'sprite' ? (
        <div
          style={{
            marginTop: 3,
            transform: `scale(${PEER_BUST})`,
            transformOrigin: 'top center',
            lineHeight: 0,
          }}
        >
          <PixelSprite
            variant={spec.variant}
            name={displayName}
            statusColor={spec.statusColor}
            scale={1}
            hideLabel
            animateIdle={false}
          />
        </div>
      ) : (
        <div style={{ transform: `scale(${CAT_BUST})`, lineHeight: 0 }}>
          <PixelCat hideLabel />
        </div>
      )}
    </div>
  );
}

function MeAvatar() {
  return (
    <div
      style={{
        width: AVATAR,
        height: AVATAR,
        borderRadius: 4,
        overflow: 'hidden',
        background: '#d8d6d0',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          marginTop: 3,
          transform: `scale(${ME_BUST})`,
          transformOrigin: 'top center',
          lineHeight: 0,
        }}
      >
        <PixelSprite
          variant="user"
          name="You"
          statusColor="#4CAF50"
          scale={1}
          hideLabel
          animateIdle={false}
        />
      </div>
    </div>
  );
}

interface FullScreenWeChatChatProps {
  characterId: string;
  scrollToMessageIndex?: number;
  onClose: () => void;
}

export default function FullScreenWeChatChat({
  characterId,
  scrollToMessageIndex,
  onClose,
}: FullScreenWeChatChatProps) {
  const thread = getCharacterThread(characterId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useLayoutEffect(() => {
    if (scrollToMessageIndex == null || scrollToMessageIndex < 0) return;
    const root = scrollAreaRef.current;
    if (!root) return;
    const el = root.querySelector(`[data-chat-msg="${scrollToMessageIndex}"]`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [characterId, scrollToMessageIndex, thread.messages.length]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`与 ${thread.name} 的聊天`}
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: Z,
        background: '#ededed',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box',
      }}
    >
      <header
        style={{
          flexShrink: 0,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#ededed',
          borderBottom: '1px solid #d4d4d4',
        }}
      >
        <button
          type="button"
          aria-label="返回"
          onClick={onClose}
          style={{
            position: 'absolute',
            left: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 22,
            color: '#191919',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: 'center', maxWidth: '62%' }}>
          <div
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 17,
              fontWeight: 600,
              color: '#000',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {thread.name}
          </div>
          {thread.subtitle ? (
            <div
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 11,
                color: '#888',
                marginTop: 1,
              }}
            >
              {thread.subtitle}
            </div>
          ) : null}
        </div>
      </header>

      <div
        ref={scrollAreaRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '12px 12px 72px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            alignSelf: 'center',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 12,
            color: '#b2b2b2',
            marginBottom: 4,
          }}
        >
          — 以下为演示对话 —
        </div>
        {thread.messages.map((m, i) => {
          const isMe = m.from === 'me';
          return (
            <div
              key={i}
              data-chat-msg={i}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: AVATAR_GAP,
                  maxWidth: 'min(100%, 520px)',
                }}
              >
                {!isMe ? (
                  <PeerAvatar
                    characterId={m.speakerId ?? characterId}
                    displayName={m.speakerId ? speakerLabel(m.speakerId) : thread.name}
                  />
                ) : null}
                <div
                  style={{
                    maxWidth: BUBBLE_MAX,
                    padding: '9px 11px',
                    borderRadius: 4,
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 16,
                    lineHeight: 1.45,
                    color: '#000',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.04)',
                    background: isMe ? '#95ec69' : '#fff',
                    border: !isMe ? '0.5px solid #e6e6e6' : 'none',
                    flexShrink: 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>
                {isMe ? <MeAvatar /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <footer
        style={{
          flexShrink: 0,
          minHeight: 52,
          background: '#f7f7f7',
          borderTop: '1px solid #dcdcdc',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: 22, opacity: 0.55, lineHeight: 1 }}>😊</span>
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: 6,
            border: '1px solid #e3e3e3',
            padding: '8px 12px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 15,
            color: '#b2b2b2',
          }}
        >
          发消息…
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#576b95', paddingRight: 4 }}>发送</span>
      </footer>
    </motion.div>
  );
}
