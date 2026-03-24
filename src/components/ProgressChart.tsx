import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { SessionRecord } from '../lib/storage'

interface Props {
  sessions: SessionRecord[]
}

export default function ProgressChart({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 text-center text-[var(--text-secondary)] text-sm px-4">
        <p>完成更多場訓練後，</p>
        <p>進度曲線會在這裡出現 📈</p>
      </div>
    )
  }

  // 只取最近 14 場
  const recent = sessions.slice(-14).map((s, i) => ({
    session: i + 1,
    avgSec: s.avgReactionMs != null ? +(s.avgReactionMs / 1000).toFixed(2) : null,
    accuracy: +((s.score / s.questions) * 100).toFixed(0),
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={recent} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="session"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          label={{ value: '場次', position: 'insideBottomRight', offset: 0, fontSize: 11 }}
        />
        {/* 左 Y 軸：反應時間（秒） */}
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          label={{ value: '秒', angle: -90, position: 'insideLeft', offset: 20, fontSize: 11 }}
        />
        {/* 右 Y 軸：正確率（%） */}
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          label={{ value: '%', angle: 90, position: 'insideRight', offset: 8, fontSize: 11 }}
        />
        <Tooltip
          formatter={(value, name) =>
            name === '反應時間' ? [`${value}s`, name] : [`${value}%`, name]
          }
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="avgSec"
          name="反應時間"
          stroke="#1a1a1a"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="accuracy"
          name="正確率"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
