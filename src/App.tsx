import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import LevelMap from './pages/LevelMap'
import { toggleMusic, isMusicPlaying } from './lib/bgMusic'
import { loadData, updateLevel } from './lib/storage'
import type { QuizResult } from './pages/Quiz'

type Page = 'home' | 'quiz' | 'results' | 'levelmap'

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

  function handleSelectLevel(level: number) {
    updateLevel(level)
    setPage('quiz')
  }

  // 確保 isMusicPlaying 與 state 同步（首次互動後 AudioContext 可能自啟）
  const playing = musicOn || isMusicPlaying()

  const pageNode = (() => {
    if (page === 'quiz') return <Quiz onComplete={handleQuizComplete} onExit={() => setPage('home')} />
    if (page === 'results' && lastResult) {
      return (
        <Results
          result={lastResult}
          onRestart={() => setPage('quiz')}
          onHome={() => setPage('home')}
        />
      )
    }
    if (page === 'levelmap') {
      return (
        <LevelMap
          currentLevel={loadData().currentLevel}
          onBack={() => setPage('home')}
          onSelectLevel={handleSelectLevel}
        />
      )
    }
    return <Home onStart={() => setPage('quiz')} onLevelMap={() => setPage('levelmap')} />
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
