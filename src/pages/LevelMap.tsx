import { useState } from 'react'
import { levelTips } from '../lib/tips'
import { levelTipsEn } from '../lib/tips_en'
import { loadData } from '../lib/storage'
import { useLanguage } from '../contexts/LanguageContext'
import { t, levelNames } from '../lib/i18n'

const TOTAL_LEVELS = 22

interface Props {
  currentLevel: number
  onBack: () => void
  onSelectLevel: (level: number) => void
}

export default function LevelMap({ currentLevel, onBack, onSelectLevel }: Props) {
  const [tipLevel, setTipLevel] = useState<number | null>(null)
  const { lang } = useLanguage()
  const tr = t[lang]
  const tips = lang === 'zh' ? levelTips : levelTipsEn
  const levelStars = loadData().levelStars

  function handleLevelClick(level: number) {
    if (level <= currentLevel) {
      onSelectLevel(level)
    } else {
      setTipLevel(level === tipLevel ? null : level)
    }
  }

  const tip = tipLevel !== null ? tips[tipLevel] : null

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* 頂部 */}
      <div className="flex items-center gap-3 px-4 pt-8 pb-4 max-w-sm mx-auto w-full">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full
                     text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-lg"
          aria-label={tr.back}
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase">
            {tr.levelMapTitle}
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {tr.unlocked(currentLevel, TOTAL_LEVELS)}
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
                {isCompleted && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-indigo-400">✓</span>
                )}
                {!unlocked && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-gray-300">🔒</span>
                )}

                <span
                  className={`text-xl font-bold tabular-nums leading-none mb-1
                    ${isCurrent ? 'text-white' : unlocked ? 'text-indigo-700' : 'text-gray-300'}
                  `}
                >
                  {level}
                </span>

                <span
                  className={`text-[9px] leading-tight text-center px-1
                    ${isCurrent ? 'text-indigo-100' : unlocked ? 'text-indigo-500' : 'text-gray-300'}
                  `}
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {levelNames[lang][level]}
                </span>

                {/* 星星（只有解鎖過的關卡才顯示） */}
                {unlocked && (
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3].map(s => (
                      <span
                        key={s}
                        className={`text-[10px] leading-none ${
                          s <= (levelStars[level] ?? 0)
                            ? isCurrent ? 'text-amber-200' : 'text-amber-400'
                            : isCurrent ? 'text-indigo-300/50' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部技巧抽屜 */}
      {tip && tipLevel !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setTipLevel(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
                       max-w-sm mx-auto px-4 pt-4 pb-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs text-gray-400">Level {tipLevel} — {tr.lockedLabel}</p>
                <p className="text-base font-bold text-gray-800">{tip.title}</p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-3">
              <p className="text-xs text-indigo-400 font-medium mb-1">{tr.formula}</p>
              <p className="text-sm font-mono text-indigo-900">{tip.formula}</p>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-400 font-medium mb-2">{tr.steps}</p>
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

            <div className="bg-amber-50 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-500 font-medium mb-1">{tr.example}</p>
              <p className="text-sm text-amber-900">{tip.example}</p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">{tr.lockedHint}</p>
          </div>
        </div>
      )}
    </div>
  )
}
