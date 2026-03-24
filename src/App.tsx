import { useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import type { QuizResult } from './pages/Quiz'

type Page = 'home' | 'quiz' | 'results'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [lastResult, setLastResult] = useState<QuizResult | null>(null)

  function handleQuizComplete(result: QuizResult) {
    setLastResult(result)
    setPage('results')
  }

  if (page === 'quiz') {
    return <Quiz onComplete={handleQuizComplete} />
  }

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
}
