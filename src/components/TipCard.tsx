import { useState } from 'react'
import { levelTips } from '../lib/tips'
import { levelTipsEn } from '../lib/tips_en'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../lib/i18n'

interface Props {
  level: number
  defaultOpen?: boolean
}

export default function TipCard({ level, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const { lang } = useLanguage()
  const tr = t[lang]
  const tips = lang === 'zh' ? levelTips : levelTipsEn
  const tip = tips[level]
  if (!tip) return null

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="text-sm font-semibold text-indigo-800">
            {tr.tipLabel(level, tip.title)}
          </span>
        </div>
        <span className="text-indigo-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-white/70 rounded-lg px-3 py-2">
            <p className="text-xs text-indigo-500 mb-1 font-medium">{tr.formula}</p>
            <p className="text-sm font-mono text-indigo-900">{tip.formula}</p>
          </div>

          <div>
            <p className="text-xs text-indigo-500 mb-1 font-medium">{tr.steps}</p>
            <ol className="space-y-1">
              {tip.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-indigo-800">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-indigo-200 text-indigo-700
                                   text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-indigo-100/60 rounded-lg px-3 py-2">
            <p className="text-xs text-indigo-500 mb-1 font-medium">{tr.example}</p>
            <p className="text-sm text-indigo-900">{tip.example}</p>
          </div>
        </div>
      )}
    </div>
  )
}
