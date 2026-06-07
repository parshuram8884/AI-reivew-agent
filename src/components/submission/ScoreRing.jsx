/**
 * Score ring visualization component
 */
export default function ScoreRing({ score, label, size = 110, stroke = 11, color = '#3B82F6' }) {
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (score / 100) * circ

    return (
        <div className='flex flex-col items-center gap-2'>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill='none' stroke='#1E293B' strokeWidth={stroke} />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill='none' stroke={color} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap='round'
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <text
                    x='50%' y='50%' textAnchor='middle' dominantBaseline='middle'
                    style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: 'white', fontSize: size * 0.22, fontWeight: 700 }}
                >
                    {score}%
                </text>
            </svg>
            <p className='text-slate-400 text-xs text-center'>{label}</p>
        </div>
    )
}
