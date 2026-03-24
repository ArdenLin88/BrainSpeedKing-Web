export const MIN_LEVEL = 1
export const MAX_LEVEL = 20

/**
 * 根據最近一場訓練的成績評估難度調整。
 * 每 10 題評估一次（非即時）。
 *
 * 正確率 ≥ 80% → 升一級
 * 正確率 ≤ 50% → 降一級
 * 其餘 → 保持不變
 */
export function evaluateLevel(
  currentLevel: number,
  score: number,
  totalQuestions: number = 10
): { newLevel: number; changed: 'up' | 'down' | 'same' } {
  const rate = score / totalQuestions

  if (rate >= 0.8 && currentLevel < MAX_LEVEL) {
    return { newLevel: currentLevel + 1, changed: 'up' }
  }
  if (rate <= 0.5 && currentLevel > MIN_LEVEL) {
    return { newLevel: currentLevel - 1, changed: 'down' }
  }
  return { newLevel: currentLevel, changed: 'same' }
}
