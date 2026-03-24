import { loadData } from '../lib/storage'
import ProgressChart from '../components/ProgressChart'

interface Props {
  onStart: () => void
}

export default function Home({ onStart }: Props) {
  const data = loadData()
  const { streak, currentLevel, sessions } = data

  const levelNames: Record<number, string> = {
    1: '個位數乘法',
    2: '個位數加兩位數',
    3: '×11 不進位',
    4: '×11 進位',
    5: '×9 速算',
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-8 max-w-sm mx-auto">
      {/* 品牌名 */}
      <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase mb-6">
        BrainSpeedKing
      </p>

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

      {/* 進度圖表 */}
      <div>
        <p className="text-xs text-[var(--text-secondary)] mb-2">最近進度</p>
        <ProgressChart sessions={sessions} />
      </div>
    </div>
  )
}
