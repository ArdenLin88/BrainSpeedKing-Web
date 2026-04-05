import { useState } from 'react'
import { levelTips } from '../lib/tips'

const TOTAL_LEVELS = 22

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

interface Props {
  currentLevel: number
  onBack: () => void
  onSelectLevel: (level: number) => void
}

export default function LevelMap({ currentLevel, onBack, onSelectLevel }: Props) {
  const [tipLevel, setTipLevel] = useState<number | null>(null)

  function handleLevelClick(level: number) {
    if (level <= currentLevel) {
      onSelectLevel(level)
    } else {
      setTipLevel(level === tipLevel ? null : level)
    }
  }

  const tip = tipLevel !== null ? levelTips[tipLevel] : null

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* 頂部 */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 max-w-sm mx-auto w-full">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full
                     text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-lg"
          aria-label="返回"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase">
            關卡地圖
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            已解鎖 {currentLevel} / {TOTAL_LEVELS} 關
          </p>
        </div>
      </div>

      {/* 關卡網格 */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 max-w-sm mx-auto w-full">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map(level => {
            const unlocked = level <= currentLevel
            const isCurrent = level === currentLevel
            const isCompleted = level < currentLevel

            return (
              <button
                key={level}
                onClick={() => handleLevelClick(level)}
                className={`
                  relative flex flex-col items-center justify-center
                  rounded-2xl aspect-square p-2 transition-all active:scale-95
                  ${isCurrent
                    ? 'bg-[var(--accent)] shadow-md shadow-indigo-200'
                    : isCompleted
                      ? 'bg-indigo-50 border border-indigo-100'
                      : unlocked
                        ? 'bg-indigo-50 border border-indigo-100'
                        : 'bg-gray-50 border border-gray-100'
                  }
                `}
              >
                {/* 完成勾號 */}
                {isCompleted && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-indigo-400">✓</span>
                )}

                {/* 鎖頭 */}
                {!unlocked && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-gray-300">🔒</span>
                )}

                {/* 關卡號碼 */}
                <span
                  className={`text-xl font-bold tabular-nums leading-none mb-1
                    ${isCurrent ? 'text-white' : unlocked ? 'text-indigo-700' : 'text-gray-300'}
                  `}
                >
                  {level}
                </span>

                {/* 關卡名（短版） */}
                <span
                  className={`text-[9px] leading-tight text-center px-1
                    ${isCurrent ? 'text-indigo-100' : unlocked ? 'text-indigo-500' : 'text-gray-300'}
                  `}
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {levelNames[level]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部提示抽屜（點鎖定關卡時展開） */}
      {tip && tipLevel !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setTipLevel(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
                       max-w-sm mx-auto px-4 pt-4 pb-8"
            onClick={e => e.stopPropagation()}
          >
            {/* 把手 */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            {/* 標題 */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs text-gray-400">Level {tipLevel} — 尚未解鎖</p>
                <p className="text-base font-bold text-gray-800">{tip.title}</p>
              </div>
            </div>

            {/* 公式 */}
            <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-indigo-400 font-medium mb-1">公式</p>
              <p className="text-sm font-mono text-indigo-900">{tip.formula}</p>
            </div>

            {/* 步驟 */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 font-medium mb-2">計算步驟</p>
              <ol className="space-y-1.5">
                {tip.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600
                                     text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* 例題 */}
            <div className="bg-amber-50 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-500 font-medium mb-1">例題</p>
              <p className="text-sm text-amber-900">{tip.example}</p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              繼續訓練解鎖此關 — 點任意處關閉
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
