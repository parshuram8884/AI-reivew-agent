import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function Login() {
    const navigate = useNavigate()
    const { signIn } = useAuth()
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

   

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            setError(null)
            setLoading(true)
            await signIn(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-[#0F172A] flex items-center justify-center px-4'>
            <div className='w-full max-w-6xl bg-[#111827] rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2'>

                <div className='hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-blue-600 to-cyan-500'>
                    <h1 className='text-5xl font-bold text-white leading-tight'>
                        ReviewBridge AI
                    </h1>

                    <p className='text-blue-100 mt-6 text-lg leading-relaxed'>
                        AI-powered workflow review system that reduces managerial overload and improves team productivity.
                    </p>

                    <div className='mt-10 bg-white/10 rounded-2xl p-6 backdrop-blur-sm'>
                        <p className='text-white text-sm'>
                            Trusted by modern product teams for intelligent AI reviews and escalation workflows.
                        </p>
                    </div>
                </div>

                <div className='p-8 sm:p-12 lg:p-16'>
                    <div className='max-w-md mx-auto'>
                        <h2 className='text-3xl font-bold text-white'>Welcome Back</h2>
                        <p className='text-slate-400 mt-2'>
                            Sign in to your workspace
                        </p>

                        

                        

                        <form onSubmit={handleSignIn} className='space-y-5'>
                            {error && (
                                <div className='bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm'>
                                    {error}
                                </div>
                            )}
                            
                            <div>
                                <label className='text-slate-300 text-sm'>Email</label>
                                <input
                                    type='email'
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                                    required
                                />
                            </div>

                            <div>
                                <label className='text-slate-300 text-sm'>Password</label>
                                <input
                                    type='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                                    required
                                />
                            </div>

                            <div className='flex items-center justify-between text-sm'>
                                <label className='flex items-center gap-2 text-slate-400'>
                                    <input type='checkbox' disabled={loading} />
                                    Remember me
                                </label>

                                <button type='button' className='text-blue-400 hover:text-blue-300'>
                                    Forgot password?
                                </button>
                            </div>

                            <button 
                                type='submit'
                                disabled={loading}
                                className='w-full bg-blue-600 hover:bg-blue-500 transition-all text-white py-3 rounded-xl font-semibold disabled:opacity-50'
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className='text-slate-400 text-center mt-8'>
                            Don’t have an account?{' '}
                            <Link to='/signup' className='text-blue-400 hover:text-blue-300'>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
