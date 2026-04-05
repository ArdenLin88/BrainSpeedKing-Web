export interface SessionRecord {
  date: string        // ISO 8601
  level: number
  score: number
  avgReactionMs: number | null
  questions: number
}

export interface AppData {
  version: 1
  currentLevel: number
  streak: {
    count: number
    lastTrainedDate: string  // YYYY-MM-DD
  }
  sessions: SessionRecord[]
  levelStars: Record<number, number>  // best star rating per level (0–3)
  levelBests: Record<number, { score: number; avgReactionMs: number | null }>
  unlockedAchievements: string[]
}

const STORAGE_KEY = 'bsk_data'

const DEFAULT_DATA: AppData = {
  version: 1,
  currentLevel: 1,
  streak: { count: 0, lastTrainedDate: '' },
  sessions: [],
  levelStars: {},
  levelBests: {},
  unlockedAchievements: [],
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DATA, streak: { ...DEFAULT_DATA.streak } }
    const parsed = JSON.parse(raw) as AppData
    // 版本遷移占位（未來擴充用）
    if (!parsed.version) return { ...DEFAULT_DATA }
    // 補上舊資料可能缺少的欄位
    if (!parsed.levelStars) parsed.levelStars = {}
    if (!parsed.levelBests) parsed.levelBests = {}
    if (!parsed.unlockedAchievements) parsed.unlockedAchievements = []
    return parsed
  } catch {
    // localStorage 損毀：靜默重置，不崩潰
    return { ...DEFAULT_DATA, streak: { ...DEFAULT_DATA.streak } }
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // 私密瀏覽或儲存空間不足：忽略（不影響當前訓練）
  }
}

export function appendSession(session: SessionRecord): AppData {
  const data = loadData()
  data.sessions = [...data.sessions, session]
  saveData(data)
  return data
}

export function updateLevel(newLevel: number): void {
  const data = loadData()
  data.currentLevel = newLevel
  saveData(data)
}

export function unlockAchievements(ids: string[]): void {
  if (ids.length === 0) return
  const data = loadData()
  const set = new Set(data.unlockedAchievements)
  ids.forEach(id => set.add(id))
  data.unlockedAchievements = [...set]
  saveData(data)
}

export interface PBResult {
  scorePB: boolean      // 分數破紀錄
  reactionPB: boolean   // 反應時間破紀錄
  isFirst: boolean      // 此關第一次打
}

/** 更新本關最佳紀錄，回傳破了哪些 PB */
export function updateLevelBests(
  level: number,
  score: number,
  avgReactionMs: number | null
): PBResult {
  const data = loadData()
  const prev = data.levelBests[level]
  const isFirst = !prev

  const scorePB = isFirst || score > prev.score
  const reactionPB =
    avgReactionMs !== null &&
    (isFirst || prev.avgReactionMs === null || avgReactionMs < prev.avgReactionMs)

  const newBest = {
    score: isFirst ? score : Math.max(score, prev.score),
    avgReactionMs:
      avgReactionMs === null ? (isFirst ? null : prev.avgReactionMs) :
      isFirst ? avgReactionMs :
      prev.avgReactionMs === null ? avgReactionMs :
      Math.min(avgReactionMs, prev.avgReactionMs),
  }
  data.levelBests[level] = newBest
  saveData(data)
  return { scorePB, reactionPB, isFirst }
}

export function updateLevelStars(level: number, stars: number): boolean {
  const data = loadData()
  const prev = data.levelStars[level] ?? 0
  if (stars <= prev) return false  // 沒有破紀錄
  data.levelStars[level] = stars
  saveData(data)
  return true  // 破紀錄了
}
