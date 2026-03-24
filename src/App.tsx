import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import { toggleMusic, isMusicPlaying } from './lib/bgMusic'
import type { QuizResult } from './pages/Quiz'

type Page = 'home' | 'quiz' | 'results'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [lastResult, setLastResult] = useState<QuizResult | null>(null)
  const [musicOn, setMusicOn] = useState(false)

  function handleQuizComplete(result: QuizResult) {
    setLastResult(result)
    setPage('results')
  }

  function handleMusicToggle() {
    const nowPlaying = toggleMusic()
    setMusicOn(nowPlaying)
  }

  // 確保 isMusicPlaying 與 state 同步（首次互動後 AudioContext 可能自啟）
  const playing = musicOn || isMusicPlaying()

  const pageNode = (() => {
    if (page === 'quiz') return <Quiz onComplete={handleQuizComplete} />
    if (page === 'results' && lastResult) {
      return (
        <Results
          result={lastResult}
          onRestart={() => setPage('quiz')}
          onHome={() => setPage('home')}
        />
      )
    }
    return <Home onStart={() => setPage('quiz')} />
  })()

  return (
    <>
      {pageNode}

      {/* 浮動音樂按鈕 — 右上角固定 */}
      <button
        onClick={handleMusicToggle}
        title={playing ? '暫停音樂' : '播放背景音樂'}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full
                   bg-white/80 backdrop-blur border border-gray-200
                   shadow-sm flex items-center justify-center
                   text-lg hover:bg-white transition-colors"
      >
        {playing ? '🔊' : '🔇'}
      </button>
    </>
  )
}
