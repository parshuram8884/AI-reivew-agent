import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaRobot, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import { callGemini } from '../lib/geminiApi'
import { wordCount } from '../utils/textProcessing'
import DocUploadZone from '../components/submission/DocUploadZone'
import ApiKeyInput from '../components/submission/ApiKeyInput'
import ApiKeyModal from '../components/submission/ApiKeyModal'
import EvaluatingSkeleton from '../components/submission/EvaluatingSkeleton'
import ReviewResult from '../components/submission/ReviewResult'

const CONTENT_CATEGORIES = [
    'Blog Posts & Articles', 'Technical Documentation', 'Marketing Copy',
    'Business Proposals', 'Research Summaries', 'Email Drafts',
    'Reports', 'Scripts', 'Essays', 'General Writing',
]

/**
 * Employee submission page
 */
function EmployeeSubmit() {
    const { agentId: token } = useParams()
    const [agent, setAgent] = useState(null)
    const [form, setForm] = useState({
        employeeName: '', title: '', category: '', content: '', notes: '',
    })
    const [apiKey, setApiKey] = useState(
        sessionStorage.getItem('gemini_api_key') || ''
    )
    const [phase, setPhase] = useState('form')
    const [result, setResult] = useState(null)
    const [errors, setErrors] = useState({})
    const [submitError, setSubmitError] = useState('')


    

console.log("FULL PARAMS:", params)



console.log("TOKEN:", token)

  useEffect(() => {
    console.log("Current URL:", window.location.pathname)
    console.log("Token:", token)

    if (!token) {
        console.error("No token found in URL")
        setAgent(false)
        return
    }

    const loadAgent = async () => {
        try {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .eq('share_token', token)
                .single()

            console.log("Supabase response:", data, error)

            if (data) {
                setAgent({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    instructions: data.instructions,
                    criteria: data.criteria || [],
                    threshold: data.threshold || 75,
                    model: data.model || 'gemini-2.5-flash',
                    shareToken: data.share_token,
                })
                return
            }

            setAgent(false)
        } catch (err) {
            console.error(err)
            setAgent(false)
        }
    }

    loadAgent()
}, [token])

    const update = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.employeeName.trim()) e.employeeName = 'Name is required'
        if (!form.title.trim()) e.title = 'Title is required'
        if (!form.content.trim() || wordCount(form.content) < 30)
            e.content = 'Please provide at least 30 words of content'
        if (!apiKey.trim()) e.apiKey = 'A Gemini API key is required to run the AI review'
        return e
    }

    const handleSubmit = async () => {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }

        setSubmitError('')
        setPhase('evaluating')
        try {
            const parsed = await callGemini(agent, form, apiKey.trim())
            const escalated = parsed.confidenceScore < (agent?.threshold || 75)
            const finalResult = { ...parsed, escalated }
            setResult(finalResult)

            try {
                
                const criteriaScores = Array.isArray(parsed.criteriaScores) ? parsed.criteriaScores : []
                console.log(criteriaScores, parsed)
                const submissionPayload = {
                    share_token: agent?.shareToken,
                    employee_name: form.employeeName,
                    title: form.title,
                    category: form.category,
                    content: form.content,
                    summary: parsed.critique || '',
                    overall_score: parsed.overallScore || 0,
                    confidence_score: parsed.confidenceScore || 0,
                    criteria_scores: criteriaScores,
                    strengths: parsed.strengths || [],
                    weaknesses: parsed.weaknesses || [],
                    suggestions: parsed.suggestions || [],
                }

                await supabase.from('submissions').insert([submissionPayload])
            } catch (dbErr) {
                console.warn('Failed to persist submission:', dbErr)
            }
            setPhase('result')
        } catch (err) {
            console.error(err)
            const isKeyError =
                err.message?.toLowerCase().includes('api key') ||
                err.message?.toLowerCase().includes('invalid') ||
                err.message?.toLowerCase().includes('401') ||
                err.message?.toLowerCase().includes('403')
            setSubmitError(
                isKeyError
                    ? `Invalid or unauthorized API key: ${err.message}. Please double-check your Gemini API key.`
                    : `Evaluation failed: ${err.message || 'Unknown error. Please try again.'}`
            )
            setPhase('form')
        }
    }

    const handleResubmit = () => { setPhase('form'); setResult(null) }

    if (agent === false) {
        return (
            <div className='min-h-screen bg-[#0F172A] flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-white text-3xl font-bold'>
                        Invalid Review Link
                    </h1>
                    <p className='text-slate-400 mt-3'>
                        This review agent does not exist.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#0F172A]'>
            {!apiKey && (
                <ApiKeyModal
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                />
            )}

            <header className='bg-[#111827] border-b border-slate-800 px-6 py-4 sticky top-0 z-20'>
                <div className='max-w-3xl mx-auto flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center'>
                            <FaRobot className='text-blue-400 text-sm' />
                        </div>
                        <div>
                            <p className='text-white text-sm font-semibold leading-tight'>{agent?.name || 'Loading...'}</p>
                            {agent?.category && <p className='text-slate-500 text-xs'>{agent?.category}</p>}
                        </div>
                    </div>
                    <span className='text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full'>● Live</span>
                </div>
            </header>

            <main className='max-w-3xl mx-auto px-4 py-10'>
                {phase === 'evaluating' && agent && <EvaluatingSkeleton agentName={agent.name} />}

                {phase === 'result' && result && (
                    <>
                        <div className='mb-8'>
                            <h1 className='text-2xl font-bold text-white'>Review Results</h1>
                            <p className='text-slate-400 text-sm mt-1'>
                                AI feedback for <span className='text-white'>"{form.title}"</span>
                            </p>
                        </div>
                        <ReviewResult result={result} agentName={agent?.name || 'Review Agent'} onResubmit={handleResubmit} />
                    </>
                )}

                {phase === 'form' && (
                    <>
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-white'>Submit Your Work</h1>
                            <p className='text-slate-400 mt-2 leading-relaxed'>
                                {agent?.description || 'Submit your written content for AI-powered review and feedback.'}
                            </p>
                        </div>

                        <div className='space-y-6'>
                            {/* Author details */}
                            <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                                <h2 className='text-white font-semibold mb-5'>Your Details</h2>
                                <div className='grid sm:grid-cols-2 gap-5'>
                                    <div>
                                        <label className='text-slate-300 text-sm block mb-2'>Your Name <span className='text-red-400'>*</span></label>
                                        <input
                                            value={form.employeeName}
                                            onChange={e => update('employeeName', e.target.value)}
                                            placeholder='e.g. Sarah Johnson'
                                            className={`w-full bg-[#1E293B] border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none transition-colors ${errors.employeeName ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
                                                }`}
                                        />
                                        {errors.employeeName && <p className='text-red-400 text-xs mt-1'>{errors.employeeName}</p>}
                                    </div>
                                    <div>
                                        <label className='text-slate-300 text-sm block mb-2'>Submission Title <span className='text-red-400'>*</span></label>
                                        <input
                                            value={form.title}
                                            onChange={e => update('title', e.target.value)}
                                            placeholder='e.g. Q4 Marketing Strategy'
                                            className={`w-full bg-[#1E293B] border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none transition-colors ${errors.title ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
                                                }`}
                                        />
                                        {errors.title && <p className='text-red-400 text-xs mt-1'>{errors.title}</p>}
                                    </div>
                                    <div className='sm:col-span-2'>
                                        <label className='text-slate-300 text-sm block mb-2'>Content Category</label>
                                        <select
                                            value={form.category}
                                            onChange={e => update('category', e.target.value)}
                                            className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors appearance-none'
                                        >
                                            <option value=''>Select a category…</option>
                                            {CONTENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Document upload zone */}
                            <DocUploadZone
                                content={form.content}
                                onContentChange={v => update('content', v)}
                                error={errors.content}
                            />

                            {/* Notes */}
                            <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                                <h2 className='text-white font-semibold mb-2'>Additional Notes</h2>
                                <p className='text-slate-400 text-sm mb-4'>Optional context — target audience, purpose, constraints, etc.</p>
                                <textarea
                                    value={form.notes}
                                    onChange={e => update('notes', e.target.value)}
                                    placeholder='"This is for our B2B audience. Tone should be formal but approachable…"'
                                    rows={3}
                                    className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed'
                                />
                            </section>

                            {/* API Key section */}
                            <ApiKeyInput
                                value={apiKey}
                                onChange={setApiKey}
                                error={errors.apiKey}
                            />

                            {/* What happens next */}
                            <div className='bg-blue-500/5 border border-blue-500/15 rounded-xl p-4'>
                                <p className='text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3'>What happens next</p>
                                <div className='grid sm:grid-cols-3 gap-3'>
                                    {[
                                        { icon: '🤖', title: 'AI evaluates', desc: 'The agent scores your content against defined criteria' },
                                        { icon: '📊', title: 'Feedback generated', desc: 'Strengths, weaknesses, and actionable suggestions' },
                                        { icon: '🔁', title: 'Revise & resubmit', desc: 'Improve your content and submit again for a fresh review' },
                                    ].map((item, i) => (
                                        <div key={i} className='flex items-start gap-2'>
                                            <span className='text-lg flex-shrink-0 mt-0.5'>{item.icon}</span>
                                            <div>
                                                <p className='text-white text-xs font-medium'>{item.title}</p>
                                                <p className='text-slate-500 text-xs mt-0.5 leading-relaxed'>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {submitError && (
                                <div className='rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3'>
                                    <FaExclamationTriangle className='text-red-400 flex-shrink-0 mt-0.5' />
                                    <p className='text-red-200 text-sm'>{submitError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={!form.employeeName || !form.title || !form.content || !apiKey}
                                className='w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all text-base'
                            >
                                <FaPaperPlane className='text-sm' />
                                Submit for AI Review
                            </button>
                        </div>
                    </>
                )}
            </main>

            <footer className='text-center py-8'>
                <p className='text-slate-600 text-xs'>Powered by ReviewBridge AI · Confidential</p>
            </footer>
        </div>
    )
}

export default EmployeeSubmit
