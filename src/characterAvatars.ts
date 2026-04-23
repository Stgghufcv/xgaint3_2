import type { SpriteVariant } from './components/PixelSprite';

export type PeerAvatarSpec =
  | { kind: 'sprite'; variant: SpriteVariant; statusColor: string }
  | { kind: 'cat' };

const SPRITE = (variant: SpriteVariant, statusColor: string): PeerAvatarSpec => ({
  kind: 'sprite',
  variant,
  statusColor,
});

/** 会话列表 / 群聊格子里用的小头像规格 */
export function peerAvatarSpec(memberId: string): PeerAvatarSpec {
  switch (memberId) {
    case 'user':
      return SPRITE('user', '#4CAF50');
    case 'hermes':
      return SPRITE('messenger', '#FF9800');
    case 'orion':
      return SPRITE('assistant2', '#2196F3');
    case 'nova':
      return SPRITE('assistant1', '#4CAF50');
    case 'mochi':
      return { kind: 'cat' };
    default:
      return SPRITE('assistant1', '#888888');
  }
}
