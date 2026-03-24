import { useState, useEffect, useCallback, useRef } from 'react'
import { generateQuestion, type Question } from '../lib/questions'
import { loadData } from '../lib/storage'
import { playCorrect, playWrong, playTimeout } from '../lib/sounds'
import CountdownTimer from '../components/CountdownTimer'
import ChoiceButtons from '../components/ChoiceButtons'

const TOTAL_QUESTIONS = 10
const SECONDS_PER_QUESTION = 5
const FEEDBACK_DURATION_MS = 800

export interface QuizResult {
  score: number
  reactionTimes: number[]  // ms per question (null-safe as 0 for timeout)
  level: number
}

interface Props {
  onComplete: (result: QuizResult) => void
  onExit: () => void
}

export default function Quiz({ onComplete, onExit }: Props) {
  const level = loadData().currentLevel

  const [questionIdx, setQuestionIdx] = useState(0)
  const [question, setQuestion] = useState<Question>(() => generateQuestion(level))
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION)
  const [feedback, setFeedback] = useState<Record<number, 'correct' | 'wrong' | null>>({})
  const [disabled, setDisabled] = useState(false)
  const [score, setScore] = useState(0)
  const [reactionTimes, setReactionTimes] = useState<number[]>([])

  const questionStartRef = useRef<number>(performance.now())
  const answeredRef = useRef(false)

  // 進入下一題
  const nextQuestion = useCallback(
    (newScore: number, newReactions: number[]) => {
      const next = questionIdx + 1
      if (next >= TOTAL_QUESTIONS) {
        onComplete({ score: newScore, reactionTimes: newReactions, level })
        return
      }
      setQuestion(generateQuestion(level))
      setQuestionIdx(next)
      setSecondsLeft(SECONDS_PER_QUESTION)
      setFeedback({})
      setDisabled(false)
      answeredRef.current = false
      questionStartRef.current = performance.now()
    },
    [questionIdx, level, onComplete]
  )

  // 計時器
  useEffect(() => {
    if (disabled) return
    if (secondsLeft <= 0) {
      // 時間到：算錯，無反應時間
      handleAnswer(null)
      return
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, disabled])

  // 鍵盤快捷鍵 1/2/3/4
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      const idx = parseInt(e.key) - 1
      if (idx >= 0 && idx < question.choices.length) {
        handleAnswer(question.choices[idx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [question.choices, disabled])

  function handleAnswer(selected: number | null) {
    if (answeredRef.current) return  // 防雙擊
    answeredRef.current = true
    setDisabled(true)

    const reactionMs = selected !== null
      ? Math.round(performance.now() - questionStartRef.current)
      : 0

    const isCorrect = selected === question.answer
    const newReactions = [...reactionTimes, reactionMs]
    const newScore = score + (isCorrect ? 1 : 0)

    // 音效 + 視覺回饋
    if (selected === null) {
      playTimeout()
    } else if (isCorrect) {
      playCorrect()
      setFeedback({ [selected]: 'correct' })
    } else {
      playWrong()
      setFeedback({ [selected]: 'wrong', [question.answer]: 'correct' })
    }

    setScore(newScore)
    setReactionTimes(newReactions)

    setTimeout(() => nextQuestion(newScore, newReactions), FEEDBACK_DURATION_MS)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-4 py-6 max-w-sm mx-auto">
      {/* 頂部：退出 + 進度 + 計時器 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (window.confirm('確定要結束這次訓練嗎？')) onExit() }}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-gray-200 transition-colors text-lg leading-none"
            aria-label="退出訓練"
          >
            ✕
          </button>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--accent)] text-white text-xs font-bold tracking-wide">
            Lv.{level}
          </span>
          <span className="text-sm text-[var(--text-secondary)]">
            Q{questionIdx + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>
        <CountdownTimer seconds={secondsLeft} />
      </div>

      {/* 題目進度條 */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-2">
        <div
          className="h-1 bg-[var(--accent)] rounded-full transition-all duration-300"
          style={{ width: `${(questionIdx / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* 計時進度條 */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          key={questionIdx}
          className="timer-bar"
          style={{ animationDuration: `${SECONDS_PER_QUESTION}s` }}
        />
      </div>

      {/* 題目（大字，表盤風格） */}
      <div className="flex-1 flex items-center justify-center">
        <p className="quiz-question text-center select-none">
          {question.text}
        </p>
      </div>

      {/* 4 個選項按鈕 */}
      <div className="pb-6">
        <ChoiceButtons
          choices={question.choices}
          feedback={feedback}
          disabled={disabled}
          onSelect={handleAnswer}
        />
      </div>
    </div>
  )
}
