import { FaExclamationTriangle, FaCheckCircle, FaRedo } from 'react-icons/fa'
import ScoreRing from './ScoreRing'

/**
 * Review results display component
 */
export default function ReviewResult({ result, agentName, onResubmit }) {
    const { overallScore, confidenceScore, strengths, weaknesses, suggestions, criteriaScores, escalated, critique } = result
    const scoreColor = overallScore >= 80 ? '#10B981' : overallScore >= 60 ? '#F59E0B' : '#EF4444'
    const confColor = confidenceScore >= 80 ? '#10B981' : confidenceScore >= 60 ? '#F59E0B' : '#EF4444'

    return (
        <div className='space-y-6'>
            {escalated ? (
                <div className='bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3'>
                    <FaExclamationTriangle className='text-amber-400 mt-0.5 flex-shrink-0' />
                    <div>
                        <p className='text-amber-300 font-semibold text-sm'>Escalated to Manager</p>
                        <p className='text-amber-400/80 text-xs mt-0.5'>
                            AI confidence was below the agent threshold. Your manager will review and provide additional feedback.
                        </p>
                    </div>
                </div>
            ) : (
                <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3'>
                    <FaCheckCircle className='text-emerald-400 mt-0.5 flex-shrink-0' />
                    <div>
                        <p className='text-emerald-300 font-semibold text-sm'>Review Complete</p>
                        <p className='text-emerald-400/80 text-xs mt-0.5'>
                            Evaluated by <span className='text-emerald-300'>{agentName}</span> with high confidence.
                        </p>
                    </div>
                </div>
            )}

            <div className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                <h3 className='text-white font-semibold mb-6'>Score Overview</h3>
                <div className='flex items-center justify-center gap-12 flex-wrap'>
                    <ScoreRing score={overallScore} label='Overall Score' color={scoreColor} />
                    <ScoreRing score={confidenceScore} label='AI Confidence' color={confColor} />
                </div>
            </div>

            {critique && (
                <div className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                    <h3 className='text-white font-semibold mb-4'>Critique Summary</h3>
                    <p className='text-slate-300 text-sm leading-relaxed'>{critique}</p>
                </div>
            )}

            {criteriaScores?.length > 0 && (
                <div className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                    <h3 className='text-white font-semibold mb-5'>Criteria Breakdown</h3>
                    <div className='space-y-4'>
                        {criteriaScores.map(({ name, score: s }, i) => {
                            const barColor = s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            const tc = s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400'
                            return (
                                <div key={i}>
                                    <div className='flex items-center justify-between mb-1.5'>
                                        <span className='text-slate-300 text-sm'>{name}</span>
                                        <span className={`text-sm font-semibold tabular-nums ${tc}`}>{s}%</span>
                                    </div>
                                    <div className='w-full bg-slate-700/40 rounded-full h-2'>
                                        <div
                                            className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
                                            style={{ width: `${s}%`, transitionDelay: `${i * 80}ms` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className='grid md:grid-cols-2 gap-5'>
                <div className='bg-[#111827] rounded-2xl border border-slate-800 p-5'>
                    <h3 className='text-white font-semibold mb-4 flex items-center gap-2'>
                        <span className='w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs'>✓</span>
                        Strengths
                    </h3>
                    <ul className='space-y-2'>
                        {strengths.map((s, i) => (
                            <li key={i} className='flex items-start gap-2 text-slate-300 text-sm'>
                                <span className='text-emerald-400 mt-1 flex-shrink-0'>•</span>{s}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='bg-[#111827] rounded-2xl border border-slate-800 p-5'>
                    <h3 className='text-white font-semibold mb-4 flex items-center gap-2'>
                        <span className='w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-xs'>!</span>
                        Weaknesses
                    </h3>
                    <ul className='space-y-2'>
                        {weaknesses.map((w, i) => (
                            <li key={i} className='flex items-start gap-2 text-slate-300 text-sm'>
                                <span className='text-red-400 mt-1 flex-shrink-0'>•</span>{w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='bg-[#111827] rounded-2xl border border-slate-800 p-5'>
                <h3 className='text-white font-semibold mb-4'>Improvement Suggestions</h3>
                <ol className='space-y-3'>
                    {suggestions.map((s, i) => (
                        <li key={i} className='flex items-start gap-3 text-slate-300 text-sm'>
                            <span className='w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5'>
                                {i + 1}
                            </span>
                            {s}
                        </li>
                    ))}
                </ol>
            </div>

            <div className='flex justify-center pt-2 pb-6'>
                <button
                    onClick={onResubmit}
                    className='flex items-center gap-2 bg-[#1E293B] hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm px-6 py-3 rounded-xl transition-all'
                >
                    <FaRedo className='text-xs' /> Revise & Resubmit
                </button>
            </div>
        </div>
    )
}
