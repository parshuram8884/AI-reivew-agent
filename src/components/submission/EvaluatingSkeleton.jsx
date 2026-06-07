import { useState, useEffect } from 'react'
import { FaRobot } from 'react-icons/fa'

/**
 * Loading skeleton while AI evaluates submission
 */
export default function EvaluatingSkeleton({ agentName }) {
    const steps = [
        'Reading your document…',
        'Analyzing writing quality…',
        'Scoring evaluation criteria…',
        'Measuring confidence…',
        'Preparing feedback…',
    ]
    const [step, setStep] = useState(0)

    useEffect(() => {
        const iv = setInterval(() => setStep(s => (s + 1) % steps.length), 900)
        return () => clearInterval(iv)
    }, [])

    return (
        <div className='flex flex-col items-center justify-center py-20 text-center space-y-6'>
            <div className='relative'>
                <div className='w-20 h-20 rounded-2xl bg-blue-600/20 flex items-center justify-center'>
                    <FaRobot className='text-blue-400 text-3xl' />
                </div>
                <div className='absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center'>
                    <div className='w-2 h-2 bg-white rounded-full animate-ping' />
                </div>
            </div>
            <div>
                <p className='text-white font-semibold text-lg'>{agentName} is evaluating…</p>
                <p className='text-blue-400 text-sm mt-2 min-h-[1.25rem]'>{steps[step]}</p>
            </div>
            <div className='w-64 bg-slate-700/40 rounded-full h-1.5 overflow-hidden'>
                <div className='h-full bg-blue-500 rounded-full animate-pulse w-2/3' />
            </div>
        </div>
    )
}
