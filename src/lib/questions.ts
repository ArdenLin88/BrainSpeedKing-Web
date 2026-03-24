export interface Question {
  text: string
  answer: number
  choices: number[]
}

/** 從 BrainSpeedKing V3 移植的出題邏輯 */

function shuffleChoices(answer: number, distractors: number[]): number[] {
  // 去重、排除與答案相同的干擾選項
  const unique = [...new Set(distractors.filter(d => d !== answer && d > 0))]
  const pool = unique.slice(0, 3)
  // 補足到 3 個干擾選項
  let offset = 1
  while (pool.length < 3) {
    const candidate = answer + offset
    if (!pool.includes(candidate) && candidate !== answer) pool.push(candidate)
    offset++
  }
  const all = [answer, ...pool]
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

/** Level 1：個位數 × 個位數 (1–9 × 1–9) */
function genLevel1(): Question {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  const answer = a * b
  return {
    text: `${a} × ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + 9, answer - 9, answer + 1, answer - 1]),
  }
}

/** Level 2：個位數 + 兩位數 (1–9 + 10–99) */
function genLevel2(): Question {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 90) + 10
  const answer = a + b
  return {
    text: `${a} + ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + 10, answer - 10, answer + 1, answer - 1]),
  }
}

/** Level 3：×11 不進位 (個位=0 的兩位數) */
function genLevel3(): Question {
  // 個位為 0：10, 20, 30, …, 90
  const tens = Math.floor(Math.random() * 9) + 1
  const num = tens * 10
  const answer = num * 11
  return {
    text: `${num} × 11`,
    answer,
    choices: shuffleChoices(answer, [answer + 10, answer - 10, answer + 110, answer - 110]),
  }
}

/** Level 4：×11 進位 (11–99) */
function genLevel4(): Question {
  const num = Math.floor(Math.random() * 89) + 11
  const answer = num * 11
  return {
    text: `${num} × 11`,
    answer,
    choices: shuffleChoices(answer, [answer + 11, answer - 11, answer + 10, answer - 10]),
  }
}

/** Level 5：×9 速算 (11–99) */
function genLevel5(): Question {
  const num = Math.floor(Math.random() * 89) + 11
  const answer = num * 9
  return {
    text: `${num} × 9`,
    answer,
    choices: shuffleChoices(answer, [answer + 9, answer - 9, answer + 10, answer - 10]),
  }
}

/** Level 6：×25 速算 (2–40 偶數，÷4×100) */
function genLevel6(): Question {
  const num = (Math.floor(Math.random() * 20) + 1) * 2  // 2,4,6,...,40
  const answer = num * 25
  return {
    text: `${num} × 25`,
    answer,
    choices: shuffleChoices(answer, [answer + 25, answer - 25, answer + 50, answer - 50]),
  }
}

/** Level 7：11–19 的平方（(10+a)² 技巧） */
function genLevel7(): Question {
  const num = Math.floor(Math.random() * 9) + 11  // 11–19
  const answer = num * num
  return {
    text: `${num}²`,
    answer,
    choices: shuffleChoices(answer, [answer + 20, answer - 20, answer + 2, answer - 2]),
  }
}

/** Level 8：×99 速算 (11–60，n×100−n) */
function genLevel8(): Question {
  const num = Math.floor(Math.random() * 50) + 11
  const answer = num * 99
  return {
    text: `${num} × 99`,
    answer,
    choices: shuffleChoices(answer, [answer + 99, answer - 99, answer + num, answer - num]),
  }
}

/** Level 9：個位互補乘法（如 23×27，十位相同且個位和=10） */
function genLevel9(): Question {
  const tens = Math.floor(Math.random() * 8) + 1    // 1–8（十位）
  const b = Math.floor(Math.random() * 4) + 1       // 個位 1–4（互補後 6–9，避免 b=5 兩數相同）
  const c = 10 - b
  const num1 = tens * 10 + b
  const num2 = tens * 10 + c
  const answer = num1 * num2
  return {
    text: `${num1} × ${num2}`,
    answer,
    choices: shuffleChoices(answer, [answer + tens * 10, answer - tens * 10, answer + b * c, answer - b * c]),
  }
}

/** Level 10：兩位數×兩位數 完全隨機 (11–30 × 11–30) */
function genLevel10(): Question {
  const a = Math.floor(Math.random() * 20) + 11
  const b = Math.floor(Math.random() * 20) + 11
  const answer = a * b
  return {
    text: `${a} × ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + a, answer - a, answer + b, answer - b]),
  }
}

const generators: Record<number, () => Question> = {
  1: genLevel1,
  2: genLevel2,
  3: genLevel3,
  4: genLevel4,
  5: genLevel5,
  6: genLevel6,
  7: genLevel7,
  8: genLevel8,
  9: genLevel9,
  10: genLevel10,
}

export function generateQuestion(level: number): Question {
  const gen = generators[Math.min(Math.max(level, 1), 10)]
  return gen()
}
