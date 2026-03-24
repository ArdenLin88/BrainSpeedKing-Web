import { useEffect, useState } from 'react'
import { evaluateLevel } from '../lib/adaptive'
import { loadData, appendSession, updateLevel, saveData } from '../lib/storage'
import { calculateStreak } from '../lib/streak'
import ProgressChart from '../components/ProgressChart'
import type { QuizResult } from './Quiz'

interface Props {
  result: QuizResult
  onRestart: () => void
  onHome: () => void
}

export default function Results({ result, onRestart, onHome }: Props) {
  const { score, reactionTimes, level } = result
  const totalQuestions = 10

  // 計算平均反應時間（排除超時的 0）
  const validTimes = reactionTimes.filter(t => t > 0)
  const avgReactionMs = validTimes.length > 0
    ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
    : null

  const { newLevel, changed } = evaluateLevel(level, score, totalQuestions)

  const [sessions, setSessions] = useState(loadData().sessions)

  useEffect(() => {
    // 儲存本場結果 + 更新 streak + 更新等級
    const today = new Date().toISOString().slice(0, 10)
    const data = loadData()
    const newStreak = calculateStreak(data, today)

    const updated = appendSession({
      date: new Date().toISOString(),
      level,
      score,
      avgReactionMs,
      questions: totalQuestions,
    })
    // 更新 streak
    updated.streak = newStreak
    updateLevel(newLevel)
    updated.currentLevel = newLevel

    // 直接 saveData 完整更新
    saveData(updated)
    setSessions(updated.sessions)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const accuracy = Math.round((score / totalQuestions) * 100)

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-8 max-w-sm mx-auto">
      <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase mb-6">
        本場結果
      </p>

      {/* 分數 */}
      <div className="mb-2">
        <span className="text-6xl font-extrabold tabular-nums text-[var(--text-primary)]">
          {score}
        </span>
        <span className="text-2xl font-semibold text-[var(--text-secondary)]">
          &nbsp;/ {totalQuestions}
        </span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        正確率 {accuracy}%
        {avgReactionMs != null && (
          <> &nbsp;·&nbsp; 平均反應 {(avgReactionMs / 1000).toFixed(2)}s</>
        )}
      </p>

      {/* 升降級通知 */}
      {changed !== 'same' && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl border flex items-center gap-2 ${
            changed === 'up'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}
        >
          <span className="text-xl">{changed === 'up' ? '🎉' : '💪'}</span>
          <span className="font-semibold">
            Level {level} → Level {newLevel}
            {changed === 'up' ? '　難度提升！' : '　繼續練習！'}
          </span>
        </div>
      )}

      {/* 進度圖表 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-2">最近進度</p>
        <ProgressChart sessions={sessions} />
      </div>

      {/* 按鈕 */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 h-14 bg-[var(--text-primary)] text-white text-base font-semibold
                     rounded-xl hover:bg-gray-800 transition-colors"
        >
          再練一次
        </button>
        <button
          onClick={onHome}
          className="flex-1 h-14 border-2 border-[var(--accent)] text-[var(--text-primary)]
                     text-base font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          首頁
        </button>
      </div>
    </div>
  )
}
