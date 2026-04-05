import { loadData } from '../lib/storage'
import ProgressChart from '../components/ProgressChart'
import TipCard from '../components/TipCard'

interface Props {
  onStart: () => void
  onLevelMap: () => void
}

export default function Home({ onStart, onLevelMap }: Props) {
  const data = loadData()
  const { streak, currentLevel, sessions } = data

  const levelNames: Record<number, string> = {
    1: '個位數乘法',
    2: '個位數加兩位數',
    3: '×11 入門（含0）',
    4: '×11 不用進位',
    5: '×11 需進位',
    6: '×9 不需退位',
    7: '×9 需退位',
    8: '×25 速算',
    9: '11–19 平方',
    10: '×99 速算',
    11: '個位互補乘法',
    12: '兩位數完全乘法',
    13: '兩位數×個位數',
    14: '末位 5 的平方',
    15: '偶數 ×5 速算',
    16: '÷5 速算',
    17: '兩位數加法進位',
    18: '兩位數減法借位',
    19: '×15 速算',
    20: '×125 速算',
    21: '近百乘法',
    22: '大數完全乘法',
  }

  const TOTAL_LEVELS = 22

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-8 max-w-sm mx-auto">
      {/* 品牌名 + 關卡地圖按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase">
          BrainSpeedKing
        </p>
        <button
          onClick={onLevelMap}
          title="關卡地圖"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     bg-indigo-50 border border-indigo-100
                     text-indigo-600 text-xs font-semibold
                     hover:bg-indigo-100 transition-colors"
        >
          <span>🗺️</span>
          <span>{currentLevel}/{TOTAL_LEVELS} 關</span>
        </button>
      </div>

      {/* Streak 橫幅 */}
      {streak.count > 0 && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-semibold text-amber-800">{streak.count} 天連續訓練</span>
        </div>
      )}

      {/* 當前等級 */}
      <div className="mb-8">
        <p className="text-xs text-[var(--text-secondary)] mb-1">當前等級</p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">
          Level {currentLevel}
          <span className="text-base font-normal text-[var(--text-secondary)] ml-2">
            {levelNames[currentLevel]}
          </span>
        </p>
      </div>

      {/* 開始按鈕 */}
      <button
        onClick={onStart}
        className="w-full h-14 bg-[var(--text-primary)] text-white text-lg font-semibold rounded-xl
                   hover:bg-gray-800 active:bg-gray-900 transition-colors mb-8"
      >
        開始訓練
      </button>

      {/* 本關技巧（預設折疊，點開複習） */}
      <div className="mb-6">
        <TipCard level={currentLevel} defaultOpen={false} />
      </div>

      {/* 進度圖表 */}
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-2">最近進度</p>
        <ProgressChart sessions={sessions} />
      </div>
    </div>
  )
}
