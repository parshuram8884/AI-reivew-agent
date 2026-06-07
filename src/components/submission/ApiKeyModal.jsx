import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

/**
 * API Key modal for initial submission
 */
export default function ApiKeyModal({ apiKey, setApiKey }) {
    const [show, setShow] = useState(false)

    const handleContinue = () => {
        if (!apiKey.trim()) return

        sessionStorage.setItem('gemini_api_key', apiKey.trim())
        window.location.reload()
    }

    return (
        <div className='fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-[#111827] border border-slate-700 rounded-2xl p-6'>
                <h2 className='text-xl font-bold text-white'>
                    Enter Gemini API Key
                </h2>

                <p className='text-slate-400 text-sm mt-2'>
                    This page cannot be used until a Gemini API key is provided.
                </p>

                <div className='relative mt-5'>
                    <input
                        type={show ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder='AIza...'
                        className='w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white'
                    />

                    <button
                        type='button'
                        onClick={() => setShow(!show)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                    >
                        {show ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!apiKey.trim()}
                    className='w-full mt-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-3 rounded-xl'
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
