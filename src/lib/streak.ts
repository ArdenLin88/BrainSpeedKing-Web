import type { AppData } from './storage'

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

function yesterday(today: string): string {
  const d = new Date(today + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() - 1)
  return toDateString(d)
}

/**
 * 根據今天日期和上次訓練日期計算新的 streak。
 *
 * 規則：
 * - 今天已訓練過（lastTrainedDate == today）→ 不重複累加
 * - 昨天有訓練 → streak + 1
 * - 更早或從未訓練 → streak 重置為 1（本次算第一天）
 */
export function calculateStreak(
  data: AppData,
  today: string = toDateString(new Date())
): { count: number; lastTrainedDate: string } {
  const { lastTrainedDate, count } = data.streak

  if (lastTrainedDate === today) {
    // 今天已計過，不重複
    return { count, lastTrainedDate }
  }

  if (lastTrainedDate === yesterday(today)) {
    // 昨天有練，今天繼續
    return { count: count + 1, lastTrainedDate: today }
  }

  // 中斷或第一次
  return { count: 1, lastTrainedDate: today }
}
