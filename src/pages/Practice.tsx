import { useState } from 'react'
import { generateQuestion, type Question } from '../lib/questions'
import { loadData } from '../lib/storage'
import { playCorrect, playWrong } from '../lib/sounds'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../lib/i18n'
import TipCard from '../components/TipCard'
import ChoiceButtons from '../components/ChoiceButtons'

interface Props {
  onExit: () => void
}

type AnswerState = 'waiting' | 'correct' | 'wrong'

export default function Practice({ onExit }: Props) {
  const level = loadData().currentLevel
  const { lang } = useLanguage()
  const tr = t[lang]

  const [question, setQuestion] = useState<Question>(() => generateQuestion(level))
  const [count, setCount] = useState(1)
  const [feedback, setFeedback] = useState<Record<number, 'correct' | 'wrong' | null>>({})
  const [answerState, setAnswerState] = useState<AnswerState>('waiting')
  const [correctCount, setCorrectCount] = useState(0)

  function handleAnswer(selected: number) {
    if (answerState !== 'waiting') return
    const isCorrect = selected === question.answer
    if (isCorrect) {
      playCorrect()
      setFeedback({ [selected]: 'correct' })
      setAnswerState('correct')
      setCorrectCount(c => c + 1)
    } else {
      playWrong()
      setFeedback({ [selected]: 'wrong', [question.answer]: 'correct' })
      setAnswerState('wrong')
    }
  }

  function handleNext() {
    setQuestion(generateQuestion(level))
    setCount(c => c + 1)
    setFeedback({})
    setAnswerState('waiting')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-6 max-w-sm mx-auto">
      {/* 頂部 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-lg leading-none"
            aria-label={tr.finishPractice}
          >
            ✕
          </button>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              Lv.{level} · {tr.practiceMode}
            </span>
          </div>
        </div>
        <span className="text-sm text-[var(--text-secondary)] tabular-nums">
          {correctCount} ✓ &nbsp;·&nbsp; {tr.practiceCount(count)}
        </span>
      </div>

      {/* 技巧卡（預設折疊，可點開複習） */}
      <div className="mb-4">
        <TipCard level={level} defaultOpen={false} />
      </div>

      {/* 題目 */}
      <div className="flex-1 flex items-center justify-center">
        <p className="quiz-question text-center select-none">
          {question.text}
        </p>
      </div>

      {/* 答題回饋訊息 */}
      <div className="h-10 flex items-center justify-center mb-2">
        {answerState === 'correct' && (
          <p className="text-green-600 font-bold text-base">{tr.practiceCorrect}</p>
        )}
        {answerState === 'wrong' && (
          <p className="text-red-500 font-bold text-base">{tr.practiceWrong(question.answer)}</p>
        )}
      </div>

      {/* 選項按鈕 */}
      <div className="pb-2">
        <ChoiceButtons
          choices={question.choices}
          feedback={feedback}
          disabled={answerState !== 'waiting'}
          onSelect={handleAnswer}
        />
      </div>

      {/* 下一題 / 結束 按鈕 */}
      <div className="pb-6 pt-3 flex gap-3">
        {answerState !== 'waiting' && (
          <button
            onClick={handleNext}
            className="flex-1 h-12 bg-[var(--accent)] text-white font-semibold
                       rounded-xl hover:bg-gray-800 transition-colors"
          >
            {tr.nextQuestion}
          </button>
        )}
        <button
          onClick={onExit}
          className={`h-12 border-2 border-gray-200 text-[var(--text-secondary)]
                     font-semibold rounded-xl hover:bg-gray-50 transition-colors
                     ${answerState !== 'waiting' ? 'px-5' : 'flex-1'}`}
        >
          {tr.finishPractice}
        </button>
      </div>
    </div>
  )
}
