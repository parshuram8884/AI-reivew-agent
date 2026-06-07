import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function Signup() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState({
        fullName: '',
        organization: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setError(null)
            setLoading(true)
            await signUp(formData.email, formData.password)
            setSuccess(true)
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-[#0F172A] flex items-center justify-center px-4'>
            <div className='w-full max-w-2xl bg-[#111827] rounded-3xl shadow-2xl p-8 sm:p-12'>

                <h1 className='text-4xl font-bold text-white'>Create Workspace</h1>

                <p className='text-slate-400 mt-3'>
                    Build intelligent AI review workflows for your team.
                </p>

                {success && (
                    <div className='bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-3 rounded-xl mt-6 text-sm'>
                        Account created! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-5 mt-6'>
                    {error && (
                        <div className='md:col-span-2 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm'>
                            {error}
                        </div>
                    )}
                    <div>
                        <label className='text-slate-300 text-sm'>Full Name</label>
                        <input
                            type='text'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                            className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                        />
                    </div>

                    <div>
                        <label className='text-slate-300 text-sm'>Organization</label>
                        <input
                            type='text'
                            name='organization'
                            value={formData.organization}
                            onChange={handleChange}
                            disabled={loading}
                            className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                        />
                    </div>

                    <div className='md:col-span-2'>
                        <label className='text-slate-300 text-sm'>Email</label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                        />
                    </div>

                    <div className='md:col-span-2'>
                        <label className='text-slate-300 text-sm'>Password</label>
                        <input
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className='w-full mt-2 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50'
                        />
                    </div>

                    <button 
                        type='submit'
                        disabled={loading}
                        className='md:col-span-2 bg-blue-600 hover:bg-blue-500 transition-all text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-50'
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className='text-slate-400 text-center mt-8'>
                    Already have an account?{' '}
                    <Link to='/' className='text-blue-400'>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
