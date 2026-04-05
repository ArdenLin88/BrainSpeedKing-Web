import type { AppData, SessionRecord } from './storage'

export interface Achievement {
  id: string
  icon: string
  zh: { title: string; desc: string }
  en: { title: string; desc: string }
  check: (data: AppData, session: SessionRecord) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perfect_round',
    icon: '🎯',
    zh: { title: '完美場次', desc: '單場 10 題全對' },
    en: { title: 'Perfect Round', desc: 'Answer all 10 questions correctly' },
    check: (_data, session) => session.score === session.questions,
  },
  {
    id: 'lightning',
    icon: '⚡',
    zh: { title: '閃電腦袋', desc: '單場平均反應時間 < 1 秒' },
    en: { title: 'Lightning Brain', desc: 'Average reaction time under 1 second' },
    check: (_data, session) =>
      session.avgReactionMs !== null && session.avgReactionMs < 1000,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    zh: { title: '三日連擊', desc: '連續訓練 3 天' },
    en: { title: '3-Day Streak', desc: 'Train for 3 consecutive days' },
    check: (data) => data.streak.count >= 3,
  },
  {
    id: 'streak_7',
    icon: '🔥🔥',
    zh: { title: '一週鬥士', desc: '連續訓練 7 天' },
    en: { title: 'Week Warrior', desc: 'Train for 7 consecutive days' },
    check: (data) => data.streak.count >= 7,
  },
  {
    id: 'dedicated',
    icon: '💪',
    zh: { title: '勤奮學生', desc: '累計完成 10 場訓練' },
    en: { title: 'Dedicated', desc: 'Complete 10 training sessions' },
    check: (data) => data.sessions.length >= 10,
  },
  {
    id: 'halfway',
    icon: '🚀',
    zh: { title: '過半達人', desc: '解鎖第 11 關' },
    en: { title: 'Halfway There', desc: 'Unlock Level 11' },
    check: (data) => data.currentLevel >= 11,
  },
  {
    id: 'triple_star',
    icon: '⭐',
    zh: { title: '三星玩家', desc: '在任一關卡獲得 3 顆星' },
    en: { title: 'Star Player', desc: 'Earn 3 stars on any level' },
    check: (data) => Object.values(data.levelStars).some(s => s >= 3),
  },
  {
    id: 'master',
    icon: '👑',
    zh: { title: '腦速王者', desc: '解鎖全部 22 關' },
    en: { title: 'Brain Master', desc: 'Unlock all 22 levels' },
    check: (data) => data.currentLevel >= 22,
  },
]

/**
 * 回傳本次新解鎖的成就 id 列表
 */
export function checkNewAchievements(
  data: AppData,
  session: SessionRecord,
  alreadyUnlocked: string[]
): string[] {
  const unlocked = new Set(alreadyUnlocked)
  return ACHIEVEMENTS
    .filter(a => !unlocked.has(a.id) && a.check(data, session))
    .map(a => a.id)
}
