export type Lang = 'zh' | 'en'

export const levelNames: Record<Lang, Record<number, string>> = {
  zh: {
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
  },
  en: {
    1: 'Single-digit ×',
    2: '1-digit + 2-digit',
    3: '×11 Basics',
    4: '×11 No Carry',
    5: '×11 With Carry',
    6: '×9 No Borrow',
    7: '×9 With Borrow',
    8: '×25 Speed',
    9: '11–19 Squares',
    10: '×99 Speed',
    11: 'Complement ×',
    12: 'Full 2-Digit ×',
    13: '2-Digit × 1-Digit',
    14: 'Ends-in-5 Square',
    15: 'Even × 5',
    16: '÷5 Speed',
    17: '2-Digit Add Carry',
    18: '2-Digit Sub Borrow',
    19: '×15 Speed',
    20: '×125 Speed',
    21: 'Near-100 ×',
    22: 'Large 2-Digit ×',
  },
}

export const t = {
  zh: {
    brand: '腦速王',
    levelMapBtn: (cur: number, total: number) => `${cur}/${total} 關`,
    langToggle: 'EN',

    // Home
    streakBanner: (n: number) => `${n} 天連續訓練`,
    currentLevel: '當前等級',
    startTraining: '開始訓練',
    recentProgress: '最近進度',

    // Quiz
    quitConfirm: '確定要結束這次訓練嗎？',
    quitLabel: '退出訓練',
    questionOf: (cur: number, total: number) => `Q${cur} / ${total}`,

    // Results
    resultsTitle: '本場結果',
    accuracy: (pct: number) => `正確率 ${pct}%`,
    avgReaction: (s: string) => `平均反應 ${s}s`,
    levelUp: (from: number, to: number) => `Level ${from} → Level ${to}　難度提升！`,
    levelDown: (from: number, to: number) => `Level ${from} → Level ${to}　繼續練習！`,
    tryAgain: '再練一次',
    home: '首頁',

    // LevelMap
    levelMapTitle: '關卡地圖',
    unlocked: (cur: number, total: number) => `已解鎖 ${cur} / ${total} 關`,
    back: '返回',
    lockedLabel: '尚未解鎖',
    formula: '公式',
    steps: '計算步驟',
    example: '例題',
    lockedHint: '繼續訓練解鎖此關 — 點任意處關閉',

    // TipCard
    tipLabel: (level: number, title: string) => `Level ${level} 技巧：${title}`,

    // Music
    musicPause: '暫停音樂',
    musicPlay: '播放背景音樂',

    // 最佳紀錄
    pbTitle: '本關最佳紀錄',
    pbFirst: '🎉 首次完成本關！',
    pbScore: '最高分',
    pbReaction: '最快反應',
    pbNewScore: '分數破紀錄 🎉',
    pbNewReaction: '速度破紀錄 🎉',

    // 星級評分
    starsEarned: (n: number) => n > 0 ? `本場獲得 ${'★'.repeat(n)}` : '本場未得星',
    starsPB: '最佳紀錄更新！',
    starsHint2: '正確率達 80% 可得 2 顆星',
    starsHint3: '全對且反應 ≤ 2 秒可得 3 顆星',

    // 練習模式
    practiceMode: '練習模式',
    practiceSubtitle: '無計時・慢慢來',
    nextQuestion: '下一題',
    finishPractice: '結束練習',
    practiceCorrect: '答對了！',
    practiceWrong: (ans: number) => `正確答案是 ${ans}`,
    practiceCount: (n: number) => `第 ${n} 題`,

    // 錯題回顧
    wrongReviewTitle: '錯題回顧',
    wrongReviewEmpty: '全部答對！',
    wrongTimeout: '⏰ 超時',
    wrongYourAnswer: '你的答案',
    wrongCorrect: '正確答案',
  },
  en: {
    brand: 'BrainSpeedKing',
    levelMapBtn: (cur: number, total: number) => `${cur}/${total} Lvl`,
    langToggle: '中',

    // Home
    streakBanner: (n: number) => `🔥 ${n}-Day Streak`,
    currentLevel: 'Current Level',
    startTraining: 'Start Training',
    recentProgress: 'Recent Progress',

    // Quiz
    quitConfirm: 'Are you sure you want to quit?',
    quitLabel: 'Quit',
    questionOf: (cur: number, total: number) => `Q${cur} / ${total}`,

    // Results
    resultsTitle: 'Results',
    accuracy: (pct: number) => `Accuracy ${pct}%`,
    avgReaction: (s: string) => `Avg. reaction ${s}s`,
    levelUp: (from: number, to: number) => `Level ${from} → Level ${to}  Leveled up!`,
    levelDown: (from: number, to: number) => `Level ${from} → Level ${to}  Keep going!`,
    tryAgain: 'Try Again',
    home: 'Home',

    // LevelMap
    levelMapTitle: 'Level Map',
    unlocked: (cur: number, total: number) => `Unlocked ${cur} / ${total}`,
    back: 'Back',
    lockedLabel: 'Locked',
    formula: 'Formula',
    steps: 'Steps',
    example: 'Example',
    lockedHint: 'Keep training to unlock — tap anywhere to close',

    // TipCard
    tipLabel: (level: number, title: string) => `Level ${level}: ${title}`,

    // Music
    musicPause: 'Pause Music',
    musicPlay: 'Play Music',

    // Personal best
    pbTitle: 'Level Best',
    pbFirst: '🎉 First time on this level!',
    pbScore: 'Best score',
    pbReaction: 'Best reaction',
    pbNewScore: 'Score PB! 🎉',
    pbNewReaction: 'Speed PB! 🎉',

    // Stars
    starsEarned: (n: number) => n > 0 ? `You earned ${'★'.repeat(n)}` : 'No stars this round',
    starsPB: 'New personal best!',
    starsHint2: 'Get 80%+ accuracy for 2 stars',
    starsHint3: 'Perfect score + avg ≤ 2s for 3 stars',

    // Practice mode
    practiceMode: 'Practice',
    practiceSubtitle: 'No timer · Go at your pace',
    nextQuestion: 'Next',
    finishPractice: 'Finish',
    practiceCorrect: 'Correct!',
    practiceWrong: (ans: number) => `Answer: ${ans}`,
    practiceCount: (n: number) => `Question ${n}`,

    // Wrong answer review
    wrongReviewTitle: 'Mistakes',
    wrongReviewEmpty: 'Perfect round!',
    wrongTimeout: '⏰ Timeout',
    wrongYourAnswer: 'Your answer',
    wrongCorrect: 'Correct',
  },
} as const
