interface Props {
  choices: number[]
  feedback: Record<number, 'correct' | 'wrong' | null>
  disabled: boolean
  onSelect: (choice: number) => void
}

export default function ChoiceButtons({ choices, feedback, disabled, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {choices.map((choice, idx) => {
        const state = feedback[choice]
        let cls =
          'choice-btn h-14 text-2xl font-semibold rounded-xl border-2 transition-colors duration-150 '
        if (state === 'correct') cls += 'bg-green-500 border-green-500 text-white'
        else if (state === 'wrong') cls += 'bg-red-500 border-red-500 text-white'
        else cls += 'bg-white border-[var(--accent)] text-[var(--text-primary)] hover:bg-gray-50 active:bg-gray-100'

        return (
          <button
            key={`${choice}-${idx}`}
            className={cls}
            disabled={disabled}
            onClick={() => onSelect(choice)}
            // 桌機鍵盤快捷鍵：1/2/3/4
            data-key={idx + 1}
          >
            {choice}
          </button>
        )
      })}
    </div>
  )
}
