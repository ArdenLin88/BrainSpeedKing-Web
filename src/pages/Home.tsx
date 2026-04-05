import { loadData } from '../lib/storage'
import { useLanguage } from '../contexts/LanguageContext'
import { t, levelNames } from '../lib/i18n'
import { ACHIEVEMENTS } from '../lib/achievements'
import ProgressChart from '../components/ProgressChart'
import TipCard from '../components/TipCard'

interface Props {
  onStart: () => void
  onPractice: () => void
  onLevelMap: () => void
}

const TOTAL_LEVELS = 22

export default function Home({ onStart, onPractice, onLevelMap }: Props) {
  const data = loadData()
  const { streak, currentLevel, sessions, unlockedAchievements = [], levelBests = {} } = data
  const currentBest = levelBests[currentLevel] ?? null
  const { lang } = useLanguage()
  const tr = t[lang]

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-8 max-w-sm mx-auto">
      {/* 品牌名 + 關卡地圖按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          {tr.brand}
        </p>
        <button
          onClick={onLevelMap}
          title={lang === 'zh' ? '關卡地圖' : 'Level Map'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     bg-indigo-50 border border-indigo-100
                     text-indigo-600 text-xs font-semibold
                     hover:bg-indigo-100 transition-colors"
        >
          <span>🗺️</span>
          <span>{tr.levelMapBtn(currentLevel, TOTAL_LEVELS)}</span>
        </button>
      </div>

      {/* Streak 橫幅 */}
      {streak.count > 0 && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-semibold text-amber-800">
            {lang === 'zh'
              ? `${streak.count} 天連續訓練`
              : `${streak.count}-Day Streak`}
          </span>
        </div>
      )}

      {/* 當前等級 + 最佳紀錄 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-1">{tr.currentLevel}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">
          Level {currentLevel}
          <span className="text-base font-normal text-[var(--text-secondary)] ml-2">
            {levelNames[lang][currentLevel]}
          </span>
        </p>
        {currentBest && (
          <div className="mt-2 flex gap-4 text-xs text-[var(--text-secondary)]">
            <span>
              {tr.pbScore}：
              <span className="font-semibold text-[var(--text-primary)]">
                {currentBest.score} / 10
              </span>
            </span>
            {currentBest.avgReactionMs != null && (
              <span>
                {tr.pbReaction}：
                <span className="font-semibold text-[var(--text-primary)]">
                  {(currentBest.avgReactionMs / 1000).toFixed(2)}s
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 按鈕群 */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={onStart}
          className="flex-1 h-14 bg-[var(--text-primary)] text-white text-lg font-semibold rounded-xl
                     hover:bg-gray-800 active:bg-gray-900 transition-colors"
        >
          {tr.startTraining}
        </button>
        <button
          onClick={onPractice}
          title={tr.practiceSubtitle}
          className="h-14 px-4 border-2 border-gray-200 text-[var(--text-secondary)] text-sm
                     font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors
                     flex flex-col items-center justify-center leading-tight"
        >
          <span className="text-base">📖</span>
          <span>{tr.practiceMode}</span>
        </button>
      </div>

      {/* 本關技巧 */}
      <div className="mb-6">
        <TipCard level={currentLevel} defaultOpen={false} />
      </div>

      {/* 進度圖表 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-2">{tr.recentProgress}</p>
        <ProgressChart sessions={sessions} />
      </div>

      {/* 成就 */}
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          {lang === 'zh' ? '成就' : 'Achievements'}
          <span className="ml-1 text-indigo-400">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.map(a => {
            const unlocked = unlockedAchievements.includes(a.id)
            const info = lang === 'zh' ? a.zh : a.en
            return (
              <div
                key={a.id}
                title={`${info.title}：${info.desc}`}
                className={`flex flex-col items-center gap-1 rounded-xl py-3 px-1
                  ${unlocked
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-gray-50 border border-gray-100 opacity-40'
                  }`}
              >
                <span className="text-xl leading-none">{a.icon}</span>
                <span className={`text-[9px] text-center leading-tight font-medium
                  ${unlocked ? 'text-amber-800' : 'text-gray-400'}`}>
                  {info.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
