import { useState } from 'react'
import { FaKey, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa'

/**
 * API Key input component
 */
export default function ApiKeyInput({ value, onChange, error }) {
    const [show, setShow] = useState(false)

    return (
        <section className='bg-[#111827] rounded-2xl border border-slate-800 p-6'>
            <div className='flex items-start gap-3 mb-5'>
                <div className='w-9 h-9 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <FaKey className='text-amber-400 text-sm' />
                </div>
                <div>
                    <h2 className='text-white font-semibold'>Your Gemini API Key</h2>
                    <p className='text-slate-400 text-sm mt-0.5 leading-relaxed'>
                        Required to power the AI review. Your key is used only for this request and is never stored.
                    </p>
                </div>
            </div>

            <div className='relative'>
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder='AIza…'
                    className={`w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 outline-none transition-colors pr-12 font-mono ${error ? 'border-red-500' : 'border-slate-700 focus:border-amber-500/60'
                        }`}
                />
                <button
                    type='button'
                    onClick={() => setShow(v => !v)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1'
                    tabIndex={-1}
                >
                    {show ? <FaEyeSlash className='text-sm' /> : <FaEye className='text-sm' />}
                </button>
            </div>

            {error && (
                <p className='text-red-400 text-xs mt-2 flex items-center gap-1.5'>
                    <FaExclamationTriangle className='flex-shrink-0' /> {error}
                </p>
            )}

            <div className='mt-3 flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3'>
                <FaExclamationTriangle className='text-amber-400/70 text-xs flex-shrink-0 mt-0.5' />
                <p className='text-slate-500 text-xs leading-relaxed'>
                    Get a free key at{' '}
                    <a
                        href='https://aistudio.google.com/app/apikey'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-amber-400 hover:text-amber-300 underline underline-offset-2'
                    >
                        aistudio.google.com
                    </a>
                    . Your key is never saved to our servers.
                </p>
            </div>
        </section>
    )
}
