/**
 * 背景音樂引擎 — Web Audio API 程序性合成
 * C 大調五聲音階，輕快 lofi 風格，BPM 118
 */

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let active = false
let timerId: ReturnType<typeof setTimeout> | null = null
let nextTime = 0
let melodyIdx = 0
let bassIdx = 0

const BPM = 118
const BEAT = 60 / BPM       // ~0.508s
const LOOKAHEAD = 0.15
const INTERVAL_MS = 30

// 五聲音階頻率
const C4 = 261.63; const E4 = 329.63
const G4 = 392.00; const A4 = 440.00
const C5 = 523.25; const D5 = 587.33; const E5 = 659.25
const G5 = 783.99; const A5 = 880.00; const C6 = 1046.50
const REST = 0

// [頻率, 拍數] — 旋律
const MELODY: [number, number][] = [
  [E5, 0.5], [G5, 0.5], [A5, 0.5], [G5, 0.5],
  [E5, 0.5], [D5, 0.5], [E5, 1.0],
  [G5, 0.5], [A5, 0.5], [C6, 0.5], [A5, 0.5],
  [G5, 0.5], [E5, 0.5], [G5, 1.0],
  [A5, 0.5], [G5, 0.5], [E5, 0.5], [D5, 0.5],
  [E5, 0.5], [C5, 0.5], [D5, 1.0],
  [E5, 0.5], [G5, 0.5], [A5, 1.0],
  [G5, 0.5], [E5, 0.5], [C5, 0.5], [D5, 0.5],
  [C5, 2.0], [REST, 0.5],

  [D5, 0.5], [E5, 0.5], [G5, 0.5], [A5, 0.5],
  [G5, 0.5], [E5, 0.5], [D5, 1.0],
  [E5, 0.5], [G5, 0.5], [E5, 0.5], [D5, 0.5],
  [C5, 0.5], [D5, 0.5], [E5, 1.0],
  [G5, 0.5], [A5, 0.5], [G5, 0.5], [E5, 0.5],
  [D5, 0.5], [C5, 0.5], [D5, 1.0],
  [E5, 0.5], [G5, 0.5], [A5, 0.5], [G5, 0.5],
  [E5, 1.0],  [D5, 0.5], [C5, 1.0], [REST, 0.5],
]

// 低音：每 4 個旋律音換一次，輕柔根音脈衝
const BASS: [number, number][] = [
  [C4, 2], [G4, 2], [A4, 2], [E4, 2],
  [349.23, 2], [G4, 2], [C4, 2], [G4, 2],
]

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.027  // 背景音量（降低 70%）
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playMelodyNote(freq: number, dur: number, when: number) {
  if (!ctx || !masterGain || freq === REST) return
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  osc.connect(env)
  env.connect(masterGain)
  const noteDur = dur * BEAT
  env.gain.setValueAtTime(0, when)
  env.gain.linearRampToValueAtTime(1.0, when + 0.015)
  env.gain.setValueAtTime(1.0, when + noteDur * 0.6)
  env.gain.exponentialRampToValueAtTime(0.001, when + noteDur * 0.95)
  osc.start(when)
  osc.stop(when + noteDur)
}

function playBassNote(freq: number, dur: number, when: number) {
  if (!ctx || !masterGain) return
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  osc.connect(env)
  env.connect(masterGain)
  const noteDur = dur * BEAT
  env.gain.setValueAtTime(0.55, when)
  env.gain.exponentialRampToValueAtTime(0.001, when + noteDur * 0.7)
  osc.start(when)
  osc.stop(when + noteDur * 0.75)
}

function schedule() {
  if (!active || !ctx) return
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    const [mFreq, mDur] = MELODY[melodyIdx % MELODY.length]
    playMelodyNote(mFreq, mDur, nextTime)

    // 每 4 個旋律音配一個低音
    if (melodyIdx % 4 === 0) {
      const [bFreq, bDur] = BASS[bassIdx % BASS.length]
      playBassNote(bFreq, bDur, nextTime)
      bassIdx++
    }

    nextTime += mDur * BEAT
    melodyIdx++
  }
  timerId = setTimeout(schedule, INTERVAL_MS)
}

export function startMusic() {
  if (active) return
  const c = getCtx()
  active = true
  nextTime = c.currentTime + 0.08
  melodyIdx = 0
  bassIdx = 0
  schedule()
}

export function stopMusic() {
  if (!active) return
  active = false
  if (timerId !== null) { clearTimeout(timerId); timerId = null }
}

export function toggleMusic(): boolean {
  if (active) { stopMusic(); return false }
  startMusic(); return true
}

export function isMusicPlaying(): boolean {
  return active
}
