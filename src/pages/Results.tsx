import { useEffect, useState, useCallback } from 'react'
import { evaluateLevel } from '../lib/adaptive'
import { loadData, appendSession, updateLevel, saveData, updateLevelStars, updateLevelBests, unlockAchievements } from '../lib/storage'
import type { PBResult } from '../lib/storage'
import { calculateStreak } from '../lib/streak'
import { calcStars } from '../lib/stars'
import { ACHIEVEMENTS, checkNewAchievements } from '../lib/achievements'
import { useLanguage } from '../contexts/LanguageContext'
import { t, levelNames } from '../lib/i18n'
import ProgressChart from '../components/ProgressChart'
import TipCard from '../components/TipCard'
import type { QuizResult, WrongQuestion } from './Quiz'

interface Props {
  result: QuizResult
  onRestart: () => void
  onHome: () => void
}

export default function Results({ result, onRestart, onHome }: Props) {
  const { score, reactionTimes, level, wrongQuestions } = result
  const totalQuestions = 10
  const { lang } = useLanguage()
  const tr = t[lang]

  // 計算平均反應時間（排除超時的 0）
  const validTimes = reactionTimes.filter(t => t > 0)
  const avgReactionMs = validTimes.length > 0
    ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
    : null

  const { newLevel, changed } = evaluateLevel(level, score, totalQuestions)
  const stars = calcStars(score, totalQuestions, avgReactionMs)

  const [sessions, setSessions] = useState(loadData().sessions)
  const [isPB, setIsPB] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pbResult, setPbResult] = useState<PBResult | null>(null)
  const [bestAfter, setBestAfter] = useState<{ score: number; avgReactionMs: number | null } | null>(null)
  const [newAchievements, setNewAchievements] = useState<string[]>([])

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

    // 更新最佳紀錄
    const pb = updateLevelBests(level, score, avgReactionMs)
    setPbResult(pb)
    const afterData = loadData()
    setBestAfter(afterData.levelBests[level] ?? null)

    // 更新星數（只在有進步時回傳 true）
    const gotPB = updateLevelStars(level, stars)
    setIsPB(gotPB)

    // 檢查成就（在所有更新完成後用最新資料檢查）
    const finalData = loadData()
    const latestSession = finalData.sessions[finalData.sessions.length - 1]
    const newIds = checkNewAchievements(finalData, latestSession, finalData.unlockedAchievements)
    if (newIds.length > 0) {
      unlockAchievements(newIds)
      setNewAchievements(newIds)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const accuracy = Math.round((score / totalQuestions) * 100)

  const buildShareText = useCallback(() => {
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars)
    const lvName = levelNames[lang][level]
    const reactionStr = avgReactionMs != null
      ? (lang === 'zh' ? `⚡ 反應 ${(avgReactionMs / 1000).toFixed(2)}s` : `⚡ Reaction ${(avgReactionMs / 1000).toFixed(2)}s`)
      : ''
    const streakData = loadData().streak
    const streakStr = streakData.count > 1
      ? (lang === 'zh' ? `🔥 ${streakData.count} 天連續訓練` : `🔥 ${streakData.count}-Day Streak`)
      : ''

    const lines = [
      lang === 'zh' ? '腦速王 BrainSpeedKing' : 'BrainSpeedKing',
      `Lv.${level} ${lvName}`,
      '',
      `${starStr}  ${score}/${totalQuestions}`,
      reactionStr,
      streakStr,
      '',
      tr.shareUrl,
    ].filter(l => l !== undefined)

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  }, [lang, level, stars, score, totalQuestions, avgReactionMs, tr])

  async function handleShare() {
    const text = buildShareText()
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // 用戶取消或不支援，降級到複製
      }
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-8 max-w-sm mx-auto">
      <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase mb-6">
        {tr.resultsTitle}
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
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {tr.accuracy(accuracy)}
        {avgReactionMs != null && (
          <> &nbsp;·&nbsp; {tr.avgReaction((avgReactionMs / 1000).toFixed(2))}</>
        )}
      </p>

      {/* 最佳紀錄卡 */}
      {pbResult && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
          <p className="text-xs text-indigo-400 font-semibold mb-2">{tr.pbTitle}</p>
          {pbResult.isFirst ? (
            <p className="text-sm font-bold text-indigo-700">{tr.pbFirst}</p>
          ) : (
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-indigo-400 mb-0.5">{tr.pbScore}</p>
                <p className="text-lg font-bold tabular-nums text-indigo-800">
                  {bestAfter?.score ?? score}
                  <span className="text-xs font-normal text-indigo-400"> / 10</span>
                </p>
                {pbResult.scorePB && (
                  <p className="text-xs text-green-600 font-bold">{tr.pbNewScore}</p>
                )}
              </div>
              {bestAfter?.avgReactionMs != null && (
                <div>
                  <p className="text-xs text-indigo-400 mb-0.5">{tr.pbReaction}</p>
                  <p className="text-lg font-bold tabular-nums text-indigo-800">
                    {(bestAfter.avgReactionMs / 1000).toFixed(2)}s
                  </p>
                  {pbResult.reactionPB && (
                    <p className="text-xs text-green-600 font-bold">{tr.pbNewReaction}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 星級 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3].map(s => (
            <span
              key={s}
              className={`text-3xl transition-all ${s <= stars ? 'text-amber-400' : 'text-gray-200'}`}
            >
              ★
            </span>
          ))}
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[var(--text-primary)]">{tr.starsEarned(stars)}</p>
          {isPB && stars > 0 && (
            <p className="text-amber-500 text-xs font-bold">{tr.starsPB}</p>
          )}
          {stars < 2 && (
            <p className="text-[var(--text-secondary)] text-xs">{tr.starsHint2}</p>
          )}
          {stars === 2 && (
            <p className="text-[var(--text-secondary)] text-xs">{tr.starsHint3}</p>
          )}
        </div>
      </div>

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
            {changed === 'up' ? tr.levelUp(level, newLevel) : tr.levelDown(level, newLevel)}
          </span>
        </div>
      )}

      {/* 新成就解鎖通知 */}
      {newAchievements.length > 0 && (
        <div className="mb-6 space-y-2">
          {newAchievements.map(id => {
            const a = ACHIEVEMENTS.find(x => x.id === id)
            if (!a) return null
            const info = lang === 'zh' ? a.zh : a.en
            return (
              <div key={id} className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-xs text-amber-500 font-bold tracking-wide uppercase">
                    {lang === 'zh' ? '成就解鎖！' : 'Achievement Unlocked!'}
                  </p>
                  <p className="text-sm font-bold text-amber-900">{info.title}</p>
                  <p className="text-xs text-amber-700">{info.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 錯題回顧 */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-secondary)] mb-2">{tr.wrongReviewTitle}</p>
        {wrongQuestions.length === 0 ? (
          <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold flex items-center gap-2">
            <span>🎉</span> {tr.wrongReviewEmpty}
          </div>
        ) : (
          <div className="space-y-2">
            {wrongQuestions.map((q: WrongQuestion, i: number) => (
              <div key={i} className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
                <p className="text-base font-bold text-gray-800 mb-2 font-mono">{q.text} = ?</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-red-500">
                    ✗ {q.chosen === null ? tr.wrongTimeout : q.chosen}
                  </span>
                  <span className="text-green-600 font-semibold">
                    ✓ {q.answer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 本關技巧（有錯題才預設展開） */}
      <div className="mb-6">
        <TipCard level={level} defaultOpen={wrongQuestions.length > 0} />
      </div>

      {/* 進度圖表 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-2">{tr.recentProgress}</p>
        <ProgressChart sessions={sessions} />
      </div>

      {/* 分享按鈕 */}
      <button
        onClick={handleShare}
        className="w-full h-12 mb-3 rounded-xl border-2 border-indigo-200 text-indigo-600
                   text-sm font-semibold flex items-center justify-center gap-2
                   hover:bg-indigo-50 transition-colors"
      >
        {copied ? (
          <><span>✓</span> {tr.shareCopied}</>
        ) : (
          <><span>📤</span> {tr.shareBtn}</>
        )}
      </button>

      {/* 按鈕 */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 h-14 bg-[var(--text-primary)] text-white text-base font-semibold
                     rounded-xl hover:bg-gray-800 transition-colors"
        >
          {tr.tryAgain}
        </button>
        <button
          onClick={onHome}
          className="flex-1 h-14 border-2 border-[var(--accent)] text-[var(--text-primary)]
                     text-base font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          {tr.home}
        </button>
      </div>
    </div>
  )
}
