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
}

const STORAGE_KEY = 'bsk_data'

const DEFAULT_DATA: AppData = {
  version: 1,
  currentLevel: 3,
  streak: { count: 0, lastTrainedDate: '' },
  sessions: [],
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DATA, streak: { ...DEFAULT_DATA.streak } }
    const parsed = JSON.parse(raw) as AppData
    // 版本遷移占位（未來擴充用）
    if (!parsed.version) return { ...DEFAULT_DATA }
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
