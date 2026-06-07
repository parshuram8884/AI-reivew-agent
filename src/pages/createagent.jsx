import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    FaArrowLeft, FaPlus, FaTrash, FaRobot,
    FaCopy, FaCheckCircle, FaExternalLinkAlt, FaTimes
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/layout/Sidebar'

const CATEGORIES = [
    'Blog Posts & Articles',
    'Technical Documentation',
    'Marketing Copy',
    'Business Proposals',
    'Research Summaries',
    'Email Drafts',
    'Reports',
    'Scripts',
    'Essays',
    'General Writing',
]

const MODELS = [
    { id: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite', badge: 'Fast', badgeColor: 'text-emerald-400 bg-emerald-400/10' },
    { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash', badge: 'Accurate', badgeColor: 'text-blue-400 bg-blue-400/10' },
    { id: 'gemini-3.5-pro', label: 'gemini-3.5-pro', badge: 'Powerful', badgeColor: 'text-violet-400 bg-violet-400/10' },
]

const AGENT_TEMPLATES = [
    {
        name: 'Blog Content Reviewer',
        description: 'Reviews blog posts for SEO, readability, and engagement.',
        category: 'Blog Posts & Articles',
        instructions: 'Review the blog post for clarity, SEO optimization, engagement hooks, and readability. Check for proper use of headings, keyword density, and audience alignment.',
        criteria: 'Grammar & Spelling\nReadability Score\nSEO Optimization\nAudience Alignment\nEngagement Hooks',
        threshold: 80,
    },
    {
        name: 'Technical Docs Reviewer',
        description: 'Evaluates technical documentation for accuracy and clarity.',
        category: 'Technical Documentation',
        instructions: 'Assess technical documentation for accuracy, completeness, code example correctness, and developer-friendliness. Flag ambiguous instructions and missing context.',
        criteria: 'Technical Accuracy\nCompleteness\nCode Examples\nClarity\nDeveloper Experience',
        threshold: 85,
    },
    {
        name: 'Marketing Copy Reviewer',
        description: 'Analyzes marketing content for conversion and brand alignment.',
        category: 'Marketing Copy',
        instructions: 'Evaluate marketing copy for persuasive language, brand voice consistency, CTA effectiveness, and target audience alignment. Check for compliance with brand guidelines.',
        criteria: 'Brand Voice\nPersuasive Language\nCTA Effectiveness\nCompliance\nAudience Targeting',
        threshold: 75,
    },
]

// ── Share Link Modal ──────────────────────────────────────────────────────────
function ShareModal({ agentName, shareLink, onClose }) {
    const [copied, setCopied] = useState(false)
    const navigate = useNavigate()

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
            <div className='w-full max-w-lg bg-[#111827] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden'>
                <div className='p-6 border-b border-slate-800 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center'>
                            <FaCheckCircle className='text-emerald-400' />
                        </div>
                        <div>
                            <h3 className='text-white font-semibold'>Agent Created!</h3>
                            <p className='text-slate-400 text-xs mt-0.5'>Share the link below with your team</p>
                        </div>
                    </div>
                    <button onClick={() => { onClose(); navigate('/dashboard') }} className='text-slate-500 hover:text-white transition-colors p-1'>
                        <FaTimes />
                    </button>
                </div>

                <div className='p-6 space-y-5'>
                    <div className='flex items-center gap-3 bg-[#1E293B] rounded-xl p-4'>
                        <div className='w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0'>
                            <FaRobot className='text-blue-400 text-sm' />
                        </div>
                        <div>
                            <p className='text-white text-sm font-medium'>{agentName}</p>
                            <p className='text-slate-400 text-xs'>Ready to receive submissions</p>
                        </div>
                        <span className='ml-auto text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex-shrink-0'>
                            ● Live
                        </span>
                    </div>

                    <div>
                        <label className='text-slate-400 text-xs block mb-2'>Employee Submission Link</label>
                        <div className='flex items-center gap-2'>
                            <div className='flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-blue-400 text-sm font-mono truncate'>
                                {shareLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${copied
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                                    }`}
                            >
                                {copied ? <><FaCheckCircle /> Copied</> : <><FaCopy /> Copy</>}
                            </button>
                        </div>
                    </div>

                    <div className='bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-2'>
                        <p className='text-blue-300 text-xs font-semibold uppercase tracking-wider'>How it works</p>
                        <ul className='space-y-1.5'>
                            {[
                                'Share this link with your team members',
                                'Employees submit their written content through the form',
                                'Each employee enters their own Gemini API key to power the AI review',
                                'Low-confidence submissions are escalated to you',
                            ].map((step, i) => (
                                <li key={i} className='flex items-start gap-2 text-slate-400 text-xs'>
                                    <span className='text-blue-400 font-bold mt-0.5 flex-shrink-0'>{i + 1}.</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='px-6 pb-6 flex items-center gap-3'>
                    <link
                        to={`/submit/${agentId}`}>
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-[#1E293B] hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-all border border-slate-700'
                    >
                        <FaExternalLinkAlt className='text-xs' /> Preview Form
                    </link>
                    <button
                        onClick={() => { onClose(); navigate('/dashboard') }}
                        className='flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all'
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function CreateAgent() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        instructions: '',
        threshold: 75,
        model: 'gemini-flash',
    })
    const [criteriaList, setCriteriaList] = useState([''])
    const [showTemplates, setShowTemplates] = useState(false)
    const [saving, setSaving] = useState(false)
    const [shareModal, setShareModal] = useState(null)
    const { user } = useAuth()

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    const applyTemplate = (t) => {
        setForm(prev => ({
            ...prev,
            name: t.name,
            description: t.description,
            category: t.category,
            instructions: t.instructions,
            threshold: t.threshold,
        }))
        setCriteriaList(t.criteria.split('\n').filter(Boolean))
        setShowTemplates(false)
    }

    const addCriteria = () => setCriteriaList(prev => [...prev, ''])
    const removeCriteria = (i) => setCriteriaList(prev => prev.filter((_, idx) => idx !== i))
    const updateCriteria = (i, val) =>
        setCriteriaList(prev => prev.map((c, idx) => (idx === i ? val : c)))

    const generateToken = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        return 'rev-' + Array.from({ length: 8 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('')
    }

    const handleSave = async () => {
        if (!form.name) return
        setSaving(true)

        const token = generateToken()
        const shareLink = `${window.location.origin}/submit/${token}`

        // No api_key stored — employees bring their own key at review time
        const supabasePayload = {
            name: form.name,
            description: form.description,
            category: form.category,
            instructions: form.instructions,
            criteria: criteriaList.filter(Boolean),
            threshold: form.threshold,
            model: form.model,
            share_token: token,
            ...(user?.id ? { created_by: user.id } : {}),
        }

        try {
            const { error } = await supabase
                .from('agents')
                .insert([supabasePayload])
            if (error) throw error
        } catch (err) {
            console.error('Unable to save agent to Supabase:', err)
        }

        const agentData = {
            ...form,
            criteria: criteriaList.filter(Boolean),
            shareToken: token,
            id: token,
        }

        await new Promise(r => setTimeout(r, 1200))
        setSaving(false)

        const existing = JSON.parse(sessionStorage.getItem('rb_agents') || '[]')
        sessionStorage.setItem('rb_agents', JSON.stringify([...existing, agentData]))

        setShareModal({ agentName: form.name, shareLink })
    }

    const thresholdColor =
        form.threshold >= 80 ? 'text-emerald-400' :
            form.threshold >= 60 ? 'text-amber-400' :
                'text-red-400'

    return (
        <div className='min-h-screen bg-[#0F172A] flex'>
            <Sidebar />

            {shareModal && (
                <ShareModal
                    agentName={shareModal.agentName}
                    shareLink={shareModal.shareLink}
                    onClose={() => { setShareModal(null); navigate('/dashboard') }}
                />
            )}

            <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='bg-[#111827] border-b border-slate-800 px-6 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link to='/agents' className='text-slate-400 hover:text-white transition-colors'>
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h2 className='text-xl font-bold text-white'>Create Review Agent</h2>
                            <p className='text-slate-400 text-xs mt-0.5'>Configure an AI agent to review employee submissions</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className='text-sm text-slate-300 bg-[#1E293B] hover:bg-slate-700 px-4 py-2 rounded-xl transition-all border border-slate-700'
                        >
                            Use Template
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !form.name}
                            className={`text-sm font-semibold px-5 py-2 rounded-xl transition-all ${saving
                                ? 'bg-blue-700 text-white cursor-wait'
                                : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                                }`}
                        >
                            {saving ? 'Creating…' : 'Create Agent & Get Link'}
                        </button>
                    </div>
                </div>

                {showTemplates && (
                    <div className='bg-[#0F172A] border-b border-slate-800 p-6'>
                        <p className='text-slate-400 text-sm mb-4'>Start from a template</p>
                        <div className='grid md:grid-cols-3 gap-4'>
                            {AGENT_TEMPLATES.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => applyTemplate(t)}
                                    className='text-left bg-[#111827] hover:bg-[#1E293B] border border-slate-700 hover:border-blue-500 rounded-xl p-4 transition-all group'
                                >
                                    <div className='flex items-start gap-3'>
                                        <div className='w-9 h-9 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/40 transition-all'>
                                            <FaRobot className='text-blue-400 text-sm' />
                                        </div>
                                        <div>
                                            <p className='text-white text-sm font-semibold'>{t.name}</p>
                                            <p className='text-slate-400 text-xs mt-1 leading-relaxed'>{t.description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className='flex-1 overflow-y-auto p-6'>
                    <div className='max-w-4xl mx-auto space-y-6'>

                        {/* Basic Info */}
                        <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                            <h3 className='text-white font-semibold mb-1'>Basic Information</h3>
                            <p className='text-slate-400 text-sm mb-6'>Give your agent a clear name and purpose.</p>
                            <div className='grid md:grid-cols-2 gap-5'>
                                <div>
                                    <label className='text-slate-300 text-sm block mb-2'>Agent Name <span className='text-red-400'>*</span></label>
                                    <input
                                        value={form.name}
                                        onChange={e => update('name', e.target.value)}
                                        placeholder='e.g. Marketing Content Reviewer'
                                        className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors'
                                    />
                                </div>
                                <div>
                                    <label className='text-slate-300 text-sm block mb-2'>Review Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => update('category', e.target.value)}
                                        className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors appearance-none'
                                    >
                                        <option value=''>Select category…</option>
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='md:col-span-2'>
                                    <label className='text-slate-300 text-sm block mb-2'>Description</label>
                                    <input
                                        value={form.description}
                                        onChange={e => update('description', e.target.value)}
                                        placeholder='Brief description of what this agent reviews…'
                                        className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors'
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Instructions */}
                        <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                            <h3 className='text-white font-semibold mb-1'>Review Instructions</h3>
                            <p className='text-slate-400 text-sm mb-6'>Tell the AI how to evaluate submissions. Be specific.</p>
                            <textarea
                                value={form.instructions}
                                onChange={e => update('instructions', e.target.value)}
                                placeholder={`Example:\n"Review the blog post for clarity, proper use of headings, grammar, and audience alignment. Focus on whether the content delivers on its title's promise."`}
                                rows={7}
                                className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed'
                            />
                            <div className='flex items-center justify-between mt-3'>
                                <p className='text-slate-500 text-xs'>More detail = better reviews.</p>
                                <p className='text-slate-500 text-xs'>{form.instructions.length} chars</p>
                            </div>
                        </section>

                        {/* Evaluation Criteria */}
                        <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                            <div className='flex items-center justify-between mb-1'>
                                <h3 className='text-white font-semibold'>Evaluation Criteria</h3>
                                <button
                                    onClick={addCriteria}
                                    className='flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors'
                                >
                                    <FaPlus className='text-xs' /> Add Criterion
                                </button>
                            </div>
                            <p className='text-slate-400 text-sm mb-6'>Define specific dimensions the AI will score submissions on.</p>
                            <div className='space-y-3'>
                                {criteriaList.map((c, i) => (
                                    <div key={i} className='flex items-center gap-3'>
                                        <div className='w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0'>
                                            <span className='text-blue-400 text-xs font-bold'>{i + 1}</span>
                                        </div>
                                        <input
                                            value={c}
                                            onChange={e => updateCriteria(i, e.target.value)}
                                            placeholder={`Criterion ${i + 1}, e.g. "Grammar & Spelling"`}
                                            className='flex-1 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors'
                                        />
                                        {criteriaList.length > 1 && (
                                            <button
                                                onClick={() => removeCriteria(i)}
                                                className='text-slate-500 hover:text-red-400 transition-colors p-2'
                                            >
                                                <FaTrash className='text-sm' />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* AI Model + Threshold */}
                        <div className='grid md:grid-cols-2 gap-6'>
                            <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                                <h3 className='text-white font-semibold mb-1'>AI Model</h3>
                                <p className='text-slate-400 text-sm mb-5'>Select the model that will power this agent.</p>
                                <div className='space-y-3'>
                                    {MODELS.map(m => (
                                        <label
                                            key={m.id}
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.model === m.id
                                                ? 'border-blue-500 bg-blue-600/10'
                                                : 'border-slate-700 hover:border-slate-600 bg-[#1E293B]'
                                                }`}
                                        >
                                            <input
                                                type='radio'
                                                name='model'
                                                value={m.id}
                                                checked={form.model === m.id}
                                                onChange={() => update('model', m.id)}
                                                className='accent-blue-500'
                                            />
                                            <div className='flex-1'>
                                                <p className='text-white text-sm font-medium'>{m.label}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${m.badgeColor}`}>
                                                {m.badge}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                                <h3 className='text-white font-semibold mb-1'>Confidence Threshold</h3>
                                <p className='text-slate-400 text-sm mb-5'>
                                    Submissions below this score escalate to you.
                                </p>
                                <div className='flex items-end gap-4 mb-6'>
                                    <div className={`text-6xl font-bold tabular-nums ${thresholdColor}`}>
                                        {form.threshold}
                                    </div>
                                    <div className='pb-2'>
                                        <p className='text-slate-400 text-sm'>%</p>
                                        <p className='text-slate-500 text-xs mt-0.5'>threshold</p>
                                    </div>
                                </div>
                                <input
                                    type='range' min='50' max='95' step='5'
                                    value={form.threshold}
                                    onChange={e => update('threshold', Number(e.target.value))}
                                    className='w-full accent-blue-500'
                                />
                                <div className='flex justify-between mt-2'>
                                    <span className='text-slate-500 text-xs'>50%</span>
                                    <span className='text-slate-500 text-xs'>95%</span>
                                </div>
                                <div className={`mt-5 rounded-xl p-4 text-sm ${form.threshold >= 80
                                    ? 'bg-emerald-400/10 border border-emerald-500/20'
                                    : form.threshold >= 60
                                        ? 'bg-amber-400/10 border border-amber-500/20'
                                        : 'bg-red-400/10 border border-red-500/20'
                                    }`}>
                                    <p className={`font-medium mb-1 ${thresholdColor}`}>
                                        {form.threshold >= 80 ? '🟢 High Automation' :
                                            form.threshold >= 60 ? '🟡 Balanced Mode' : '🔴 Frequent Escalations'}
                                    </p>
                                    <p className='text-slate-400 text-xs leading-relaxed'>
                                        {form.threshold >= 80
                                            ? 'Most submissions handled automatically. Only complex cases reach you.'
                                            : form.threshold >= 60
                                                ? 'AI handles routine cases; edge cases escalate to you.'
                                                : 'AI escalates frequently. Good for high-stakes content.'}
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Info banner — no API key needed from manager */}
                        <div className='bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4'>
                            <div className='w-9 h-9 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5'>
                                <FaRobot className='text-blue-400 text-sm' />
                            </div>
                            <div>
                                <p className='text-blue-300 text-sm font-semibold'>No API key needed here</p>
                                <p className='text-slate-400 text-sm mt-1 leading-relaxed'>
                                    Employees will be prompted to enter their own Gemini API key when they submit their work.
                                    Your instructions and criteria are saved securely — only the review model call uses their key.
                                </p>
                            </div>
                        </div>

                        {/* Agent Preview */}
                        {form.name && (
                            <section className='bg-[#111827] rounded-2xl border border-blue-500/30 p-6'>
                                <p className='text-slate-400 text-xs uppercase tracking-wider mb-4'>Agent Preview</p>
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0'>
                                        <FaRobot className='text-blue-400 text-lg' />
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3 flex-wrap'>
                                            <h4 className='text-white font-semibold'>{form.name}</h4>
                                            {form.category && (
                                                <span className='text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full'>{form.category}</span>
                                            )}
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${thresholdColor}`}>
                                                {form.threshold}% threshold
                                            </span>
                                        </div>
                                        {form.description && (
                                            <p className='text-slate-400 text-sm mt-1'>{form.description}</p>
                                        )}
                                        {criteriaList.filter(Boolean).length > 0 && (
                                            <div className='flex flex-wrap gap-2 mt-3'>
                                                {criteriaList.filter(Boolean).map((c, i) => (
                                                    <span key={i} className='text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded-lg'>{c}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Bottom CTA */}
                        <div className='flex items-center justify-between pb-6'>
                            <Link to='/agents' className='text-slate-400 hover:text-white text-sm transition-colors'>
                                ← Back to Agents
                            </Link>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.name}
                                className={`flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all ${saving
                                    ? 'bg-blue-700 text-white cursor-wait'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {saving ? 'Creating Agent…' : '✦ Create Agent & Get Share Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAgent
