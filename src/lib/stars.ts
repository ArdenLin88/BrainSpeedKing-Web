/**
 * 計算本場得到幾顆星
 * 0★ 正確率 < 60%
 * 1★ 正確率 ≥ 60%
 * 2★ 正確率 ≥ 80%
 * 3★ 全對（100%）且平均反應 ≤ 2 秒
 */
export function calcStars(score: number, totalQuestions: number, avgReactionMs: number | null): number {
  const rate = score / totalQuestions
  if (rate < 0.6) return 0
  if (rate === 1 && avgReactionMs !== null && avgReactionMs <= 2000) return 3
  if (rate >= 0.8) return 2
  return 1
}

export function renderStars(stars: number, total = 3): string {
  return '★'.repeat(stars) + '☆'.repeat(total - stars)
}
