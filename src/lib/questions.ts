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

/** Level 4：×11 不用進位（b≠0 且 a+b<10，如 32×11=352） */
function genLevel4(): Question {
  let num: number
  do {
    num = Math.floor(Math.random() * 89) + 11  // 11–99
    const a = Math.floor(num / 10)
    const b = num % 10
    if (b !== 0 && a + b < 10) break
  } while (true)
  const answer = num * 11
  return {
    text: `${num} × 11`,
    answer,
    choices: shuffleChoices(answer, [answer + 11, answer - 11, answer + 10, answer - 10]),
  }
}

/** Level 5：×11 需進位（a+b≥10，如 75×11=825） */
function genLevel5(): Question {
  let num: number
  do {
    num = Math.floor(Math.random() * 89) + 11  // 11–99
    const a = Math.floor(num / 10)
    const b = num % 10
    if (a + b >= 10) break
  } while (true)
  const answer = num * 11
  return {
    text: `${num} × 11`,
    answer,
    choices: shuffleChoices(answer, [answer + 11, answer - 11, answer + 10, answer - 10]),
  }
}

/** Level 6：×9 不需退位（個位>十位，如 59×9，減法不向百位借位） */
function genLevel6(): Question {
  let num: number
  do {
    num = Math.floor(Math.random() * 89) + 11  // 11–99
    const a = Math.floor(num / 10)
    const b = num % 10
    if (b > a) break
  } while (true)
  const answer = num * 9
  return {
    text: `${num} × 9`,
    answer,
    choices: shuffleChoices(answer, [answer + 9, answer - 9, answer + 10, answer - 10]),
  }
}

/** Level 7：×9 需退位（個位≤十位，如 52×9，需向百位借位） */
function genLevel7(): Question {
  let num: number
  do {
    num = Math.floor(Math.random() * 89) + 11  // 11–99
    const a = Math.floor(num / 10)
    const b = num % 10
    if (b <= a) break
  } while (true)
  const answer = num * 9
  return {
    text: `${num} × 9`,
    answer,
    choices: shuffleChoices(answer, [answer + 9, answer - 9, answer + 10, answer - 10]),
  }
}

/** Level 8：×25 速算 (2–40 偶數，÷4×100) */
function genLevel8(): Question {
  const num = (Math.floor(Math.random() * 20) + 1) * 2  // 2,4,6,...,40
  const answer = num * 25
  return {
    text: `${num} × 25`,
    answer,
    choices: shuffleChoices(answer, [answer + 25, answer - 25, answer + 50, answer - 50]),
  }
}

/** Level 9：11–19 的平方（(10+a)² 技巧） */
function genLevel9(): Question {
  const num = Math.floor(Math.random() * 9) + 11  // 11–19
  const answer = num * num
  return {
    text: `${num}²`,
    answer,
    choices: shuffleChoices(answer, [answer + 20, answer - 20, answer + 2, answer - 2]),
  }
}

/** Level 10：×99 速算 (11–60，n×100−n) */
function genLevel10(): Question {
  const num = Math.floor(Math.random() * 50) + 11
  const answer = num * 99
  return {
    text: `${num} × 99`,
    answer,
    choices: shuffleChoices(answer, [answer + 99, answer - 99, answer + num, answer - num]),
  }
}

/** Level 11：個位互補乘法（如 23×27，十位相同且個位和=10） */
function genLevel11(): Question {
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

/** Level 12：兩位數×兩位數 完全隨機 (11–30 × 11–30) */
function genLevel12(): Question {
  const a = Math.floor(Math.random() * 20) + 11
  const b = Math.floor(Math.random() * 20) + 11
  const answer = a * b
  return {
    text: `${a} × ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + a, answer - a, answer + b, answer - b]),
  }
}

/** Level 13：兩位數 × 個位數（分拆法，11–50 × 2–9）*/
function genLevel13(): Question {
  const a = Math.floor(Math.random() * 40) + 11
  const b = Math.floor(Math.random() * 8) + 2
  const answer = a * b
  return {
    text: `${a} × ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + a, answer - a, answer + b * 10, answer - b]),
  }
}

/** Level 14：末位 5 的數平方（n5² = n×(n+1)×100 + 25）*/
function genLevel14(): Question {
  const n = Math.floor(Math.random() * 8) + 1  // 1–8 → 15,25,...,85
  const num = n * 10 + 5
  const answer = num * num
  return {
    text: `${num}²`,
    answer,
    choices: shuffleChoices(answer, [answer + 100, answer - 100, answer + 200, answer - 200]),
  }
}

/** Level 15：偶數 × 5 速算（n÷2×10）*/
function genLevel15(): Question {
  const n = (Math.floor(Math.random() * 44) + 6) * 2  // 12,14,...,100
  const answer = n * 5
  return {
    text: `${n} × 5`,
    answer,
    choices: shuffleChoices(answer, [answer + 25, answer - 25, answer + 50, answer - 50]),
  }
}

/** Level 16：5 的倍數 ÷ 5 速算（n×2÷10）*/
function genLevel16(): Question {
  const result = Math.floor(Math.random() * 38) + 3  // 答案 3–40
  const num = result * 5
  return {
    text: `${num} ÷ 5`,
    answer: result,
    choices: shuffleChoices(result, [result + 2, result - 2, result + 5, result - 5]),
  }
}

/** Level 17：兩位數加法（必進位）*/
function genLevel17(): Question {
  let a: number, b: number
  do {
    a = Math.floor(Math.random() * 61) + 15
    b = Math.floor(Math.random() * 61) + 15
  } while ((a % 10) + (b % 10) < 10)
  const answer = a + b
  return {
    text: `${a} + ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + 1, answer - 1, answer + 10, answer - 10]),
  }
}

/** Level 18：兩位數減法（必借位）*/
function genLevel18(): Question {
  let a: number, b: number
  do {
    a = Math.floor(Math.random() * 50) + 50  // 50–99
    b = Math.floor(Math.random() * 40) + 11  // 11–50
  } while (a % 10 >= b % 10)
  const answer = a - b
  return {
    text: `${a} − ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + 1, answer - 1, answer + 10, answer - 10]),
  }
}

/** Level 19：×15 速算（n×10 + n×5，偶數）*/
function genLevel19(): Question {
  const n = (Math.floor(Math.random() * 18) + 2) * 2  // 4,6,...,40
  const answer = n * 15
  return {
    text: `${n} × 15`,
    answer,
    choices: shuffleChoices(answer, [answer + 15, answer - 15, answer + 30, answer - 30]),
  }
}

/** Level 20：×125 速算（n÷8×1000，8 的倍數）*/
function genLevel20(): Question {
  const k = Math.floor(Math.random() * 10) + 1  // 1–10
  const n = k * 8
  const answer = n * 125
  return {
    text: `${n} × 125`,
    answer,
    choices: shuffleChoices(answer, [answer + 125, answer - 125, answer + 1000, answer - 1000]),
  }
}

/** Level 21：近百乘法（91–99 × 91–99，補數法）*/
function genLevel21(): Question {
  const a = Math.floor(Math.random() * 9) + 91
  const b = Math.floor(Math.random() * 9) + 91
  const da = 100 - a
  const db = 100 - b
  const answer = a * b
  return {
    text: `${a} × ${b}`,
    answer,
    choices: shuffleChoices(answer, [answer + da * db, answer - da * db, answer + 100, answer - 100]),
  }
}

/** Level 22：兩位數×兩位數（大範圍，31–60 × 31–60）*/
function genLevel22(): Question {
  const a = Math.floor(Math.random() * 30) + 31
  const b = Math.floor(Math.random() * 30) + 31
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
  11: genLevel11,
  12: genLevel12,
  13: genLevel13,
  14: genLevel14,
  15: genLevel15,
  16: genLevel16,
  17: genLevel17,
  18: genLevel18,
  19: genLevel19,
  20: genLevel20,
  21: genLevel21,
  22: genLevel22,
}

export function generateQuestion(level: number): Question {
  const gen = generators[Math.min(Math.max(level, 1), 22)]
  return gen()
}
