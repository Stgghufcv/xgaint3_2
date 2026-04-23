export type ChatBubble = {
  from: 'me' | 'them';
  text: string;
  /** 群聊里对方消息是谁发的，用于头像（单聊可省略） */
  speakerId?: string;
};

export type CharacterThread = {
  name: string;
  subtitle: string;
  messages: ChatBubble[];
};

export const CHARACTER_THREADS: Record<string, CharacterThread> = {
  hermes: {
    name: 'Hermes',
    subtitle: 'Messenger Agent',
    messages: [
      { from: 'them', text: 'Hey! A new collaboration request just arrived from OPC_Studio_47.' },
      { from: 'them', text: 'Want me to schedule an intro call this week? 📬' },
      { from: 'me', text: '先发个时间档我看看。' },
      { from: 'them', text: '好，我拉三个 slot 给你选。' },
    ],
  },
  orion: {
    name: 'Orion',
    subtitle: 'Studio · Build',
    messages: [
      { from: 'them', text: 'main 分支绿构建通过了。' },
      { from: 'me', text: 'Nice，今晚能发 v1.2 吗？' },
      { from: 'them', text: '差最后一个文案替换，半小时内可合并。' },
    ],
  },
  nova: {
    name: 'Nova',
    subtitle: 'Studio · Assistant',
    messages: [
      { from: 'them', text: '老板早上好 ☀️' },
      { from: 'me', text: '早，今天优先处理哪块？' },
      { from: 'them', text: 'PRD 第三节我标了三个待确认点，在文档里。' },
    ],
  },
  mochi: {
    name: 'Mochi',
    subtitle: 'Studio · 宠物',
    messages: [
      { from: 'them', text: '喵～（盯着你键盘）' },
      { from: 'me', text: '粮在柜子里自己开。' },
      { from: 'them', text: '……再摸五分钟。' },
    ],
  },
  visitor1: {
    name: 'OPC_07',
    subtitle: 'Plaza · Visitor',
    messages: [
      { from: 'them', text: '这边草坪光线不错，适合拍产品图。' },
      { from: 'me', text: '你们展位在几号？' },
      { from: 'them', text: '东门进来左转第三棵树下。' },
    ],
  },
  visitor2: {
    name: 'OPC_23',
    subtitle: 'Plaza · Visitor',
    messages: [
      { from: 'them', text: '最近海贼好抽象啊 😂' },
      { from: 'me', text: '同感，下周一起吐槽？' },
      { from: 'them', text: '行，我请你咖啡。' },
    ],
  },
  visitor3: {
    name: 'OPC_42',
    subtitle: 'Plaza · Visitor',
    messages: [
      { from: 'them', text: 'Launch v1.2 的 checklist 我发你了。' },
      { from: 'me', text: '收到，晚上对一下。' },
      { from: 'them', text: 'OK，我留到 22:00 在线。' },
    ],
  },
  'team-core': {
    name: 'Studio 核心群',
    subtitle: 'You、Hermes、Orion、Nova',
    messages: [
      { from: 'them', text: '大家早，站会改到 10:30，会议室我锁好了。', speakerId: 'nova' },
      { from: 'them', text: '收到，我先看一眼 main 上 CI。', speakerId: 'orion' },
      { from: 'me', text: 'OK，PRD 链接我补在置顶了。' },
      { from: 'them', text: '协作邮件已发，记得查垃圾箱 📬', speakerId: 'hermes' },
      { from: 'them', text: '那我把 demo 分支也跑一遍绿构建。', speakerId: 'orion' },
      { from: 'them', text: '辛苦各位，中午我请咖啡 ☕', speakerId: 'nova' },
    ],
  },
  'opc-qinglan': {
    name: 'OPC_青岚',
    subtitle: 'Lounge',
    messages: [
      { from: 'them', text: '投影仪遥控器在你那边吗？' },
      { from: 'me', text: '在的，要我拿过去吗？' },
      { from: 'them', text: '麻烦放前台就好，谢谢！' },
    ],
  },
  'opc-xuesong': {
    name: 'OPC_雪松',
    subtitle: 'Studio',
    messages: [{ from: 'them', text: '今晚联调我晚到 15 分钟。' }, { from: 'me', text: 'OK，我帮你跟 Orion 说一声。' }],
  },
  'opc-chaoxi': {
    name: 'OPC_潮汐',
    subtitle: 'Plaza',
    messages: [{ from: 'them', text: '长椅这边有人占了插座…' }, { from: 'me', text: '我去看看能不能协调。' }],
  },
  'opc-yanchi': {
    name: 'OPC_砚池',
    subtitle: 'Studio',
    messages: [{ from: 'them', text: '设计稿 v3 已同步到共享盘。' }, { from: 'me', text: '收到，下午过一遍。' }],
  },
  'opc-xingzhu': {
    name: 'OPC_星渚',
    subtitle: 'Lounge',
    messages: [{ from: 'them', text: '咖啡机又卡豆了 😅' }, { from: 'me', text: '我报修了，工单号发你。' }],
  },
  'opc-baiyu': {
    name: 'OPC_白榆',
    subtitle: 'Plaza',
    messages: [{ from: 'them', text: '借个充电宝五分钟就还！' }, { from: 'me', text: '在包里自己拿。' }],
  },
  'opc-mozhu': {
    name: 'OPC_墨竹',
    subtitle: 'Studio',
    messages: [{ from: 'them', text: 'CI badge 我换成新的了。' }],
  },
  'opc-hupo': {
    name: 'OPC_琥珀',
    subtitle: 'Lounge',
    messages: [{ from: 'them', text: '周五团建统计人数截止到今晚。' }, { from: 'me', text: '我填好了。' }],
  },
  'opc-liuying': {
    name: 'OPC_流萤',
    subtitle: 'Plaza',
    messages: [{ from: 'them', text: '东门快递我帮你签收了。' }],
  },
  'opc-beichen': {
    name: 'OPC_北宸',
    subtitle: 'Studio',
    messages: [{ from: 'them', text: 'release note 模板要改一版吗？' }, { from: 'me', text: '先按旧的来，下周再统一。' }],
  },
  'opc-zhike': {
    name: 'OPC_枳壳',
    subtitle: 'Lounge',
    messages: [{ from: 'them', text: '微波炉里是谁的饭盒忘拿了？' }],
  },
  'opc-yinhe': {
    name: 'OPC_银禾',
    subtitle: 'Plaza',
    messages: [{ from: 'them', text: '草坪活动报名链接发我一下～' }],
  },
  'opc-qianyu': {
    name: 'OPC_浅屿',
    subtitle: 'Studio',
    messages: [{ from: 'them', text: 'mock 数据我补了 20 条。' }, { from: 'me', text: 'Nice。' }],
  },
  'opc-wanzhao': {
    name: 'OPC_晚照',
    subtitle: 'Lounge',
    messages: [{ from: 'them', text: '空调有点冷，有人同感吗' }],
  },
  'opc-tinglan': {
    name: 'OPC_听澜',
    subtitle: 'Plaza',
    messages: [{ from: 'them', text: 'Plaza 晚上有露天电影吗？' }, { from: 'me', text: '海报写的是本周五。' }],
  },
};

export function getCharacterThread(characterId: string): CharacterThread {
  return (
    CHARACTER_THREADS[characterId] ?? {
      name: '对话',
      subtitle: '',
      messages: [
        { from: 'them', text: '（暂无更多记录）' },
        { from: 'me', text: '…' },
      ],
    }
  );
}

/** 会话列表预览：与某角色的最后一条消息（我方或对方），与全屏线程同源 */
export function getLastChatMessagePreview(characterId: string): string {
  const { messages } = getCharacterThread(characterId);
  if (messages.length === 0) return '';
  return messages[messages.length - 1].text;
}

export function speakerLabel(speakerId: string): string {
  if (speakerId === 'user') return 'You';
  return getCharacterThread(speakerId).name;
}

/** 会话列表内：联系人名 / 副标题 / 任意消息文本匹配（大小写不敏感） */
export type ChatSearchHit =
  | { type: 'contact'; threadId: string }
  | { type: 'message'; threadId: string; messageIndex: number };

function textMatches(haystack: string, needle: string): boolean {
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function searchChatThreads(query: string, threadIds: readonly string[]): ChatSearchHit[] {
  const q = query.trim();
  if (!q) return [];

  const contacts: ChatSearchHit[] = [];
  const messages: Extract<ChatSearchHit, { type: 'message' }>[] = [];
  const contactSeen = new Set<string>();

  for (const threadId of threadIds) {
    const thread = getCharacterThread(threadId);
    if (textMatches(thread.name, q) || textMatches(thread.subtitle, q)) {
      if (!contactSeen.has(threadId)) {
        contactSeen.add(threadId);
        contacts.push({ type: 'contact', threadId });
      }
    }
    thread.messages.forEach((m, messageIndex) => {
      if (textMatches(m.text, q)) {
        messages.push({ type: 'message', threadId, messageIndex });
      }
    });
  }

  contacts.sort((a, b) => getCharacterThread(a.threadId).name.localeCompare(getCharacterThread(b.threadId).name));
  messages.sort((a, b) => {
    const n = getCharacterThread(a.threadId).name.localeCompare(getCharacterThread(b.threadId).name);
    if (n !== 0) return n;
    return a.messageIndex - b.messageIndex;
  });

  return [...contacts, ...messages] as ChatSearchHit[];
}
