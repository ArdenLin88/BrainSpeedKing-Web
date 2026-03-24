// Web Audio API 合成音效 — 無需外部檔案
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  // 部分瀏覽器需要使用者互動後才能啟動
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** 答對：兩段上揚 ding（880 → 1320 Hz） */
export function playCorrect() {
  try {
    const c = getCtx()
    const t = c.currentTime

    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.setValueAtTime(1320, t + 0.1)

    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.28, t + 0.02)
    gain.gain.setValueAtTime(0.28, t + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

    osc.start(t)
    osc.stop(t + 0.35)
  } catch {/* 靜默失敗（無 AudioContext 環境） */}
}

/** 答錯：低沉 sawtooth buzz（220 → 110 Hz） */
export function playWrong() {
  try {
    const c = getCtx()
    const t = c.currentTime

    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.25)

    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

    osc.start(t)
    osc.stop(t + 0.3)
  } catch {}
}

/** 超時：短促中性 beep */
export function playTimeout() {
  try {
    const c = getCtx()
    const t = c.currentTime

    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, t)

    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

    osc.start(t)
    osc.stop(t + 0.18)
  } catch {}
}
