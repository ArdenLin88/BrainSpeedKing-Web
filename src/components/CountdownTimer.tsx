interface Props {
  seconds: number
  total?: number
}

export default function CountdownTimer({ seconds }: Props) {
  // 顏色依設計規格：>3s 黑，2-3s 橙，≤1s 紅
  let colorClass = 'text-[var(--text-primary)]'
  if (seconds <= 1) colorClass = 'text-[var(--timer-critical)]'
  else if (seconds <= 3) colorClass = 'text-[var(--timer-warn)]'

  return (
    <span
      className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${colorClass}`}
      aria-label={`剩餘 ${seconds} 秒`}
    >
      {seconds}
    </span>
  )
}
