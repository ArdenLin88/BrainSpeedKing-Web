import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import LevelMap from './pages/LevelMap'
import Practice from './pages/Practice'
import { toggleMusic, isMusicPlaying } from './lib/bgMusic'
import { loadData, updateLevel } from './lib/storage'
import { useLanguage } from './contexts/LanguageContext'
import { t } from './lib/i18n'
import type { QuizResult } from './pages/Quiz'

type Page = 'home' | 'quiz' | 'results' | 'levelmap' | 'practice'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [lastResult, setLastResult] = useState<QuizResult | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const { lang, toggle: toggleLang } = useLanguage()
  const tr = t[lang]

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
    if (page === 'practice') return <Practice onExit={() => setPage('home')} />
    return <Home onStart={() => setPage('quiz')} onPractice={() => setPage('practice')} onLevelMap={() => setPage('levelmap')} />
  })()

  return (
    <>
      {pageNode}

      {/* 右上角固定按鈕群 */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* 語系切換 */}
        <button
          onClick={toggleLang}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200
                     shadow-sm flex items-center justify-center
                     text-xs font-bold text-gray-600 hover:bg-white transition-colors"
        >
          {tr.langToggle}
        </button>

        {/* 音樂 */}
        <button
          onClick={handleMusicToggle}
          title={playing ? tr.musicPause : tr.musicPlay}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200
                     shadow-sm flex items-center justify-center
                     text-lg hover:bg-white transition-colors"
        >
          {playing ? '🔊' : '🔇'}
        </button>
      </div>
    </>
  )
}
