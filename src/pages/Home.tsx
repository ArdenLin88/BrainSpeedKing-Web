import { loadData } from '../lib/storage'
import { useLanguage } from '../contexts/LanguageContext'
import { t, levelNames } from '../lib/i18n'
import ProgressChart from '../components/ProgressChart'
import TipCard from '../components/TipCard'

interface Props {
  onStart: () => void
  onLevelMap: () => void
}

const TOTAL_LEVELS = 22

export default function Home({ onStart, onLevelMap }: Props) {
  const data = loadData()
  const { streak, currentLevel, sessions } = data
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

      {/* 當前等級 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-1">{tr.currentLevel}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">
          Level {currentLevel}
          <span className="text-base font-normal text-[var(--text-secondary)] ml-2">
            {levelNames[lang][currentLevel]}
          </span>
        </p>
      </div>

      {/* 開始按鈕 */}
      <button
        onClick={onStart}
        className="w-full h-14 bg-[var(--text-primary)] text-white text-lg font-semibold rounded-xl
                   hover:bg-gray-800 active:bg-gray-900 transition-colors mb-8"
      >
        {tr.startTraining}
      </button>

      {/* 本關技巧 */}
      <div className="mb-6">
        <TipCard level={currentLevel} defaultOpen={false} />
      </div>

      {/* 進度圖表 */}
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-2">{tr.recentProgress}</p>
        <ProgressChart sessions={sessions} />
      </div>
    </div>
  )
}
