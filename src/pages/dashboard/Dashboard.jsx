import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import StatsCard from '../../components/dashboard/StatsCard'

function Dashboard() {
    const { user } = useAuth()
    const [recentAgents, setRecentAgents] = useState([])

    useEffect(() => {
        const loadRecentAgents = async () => {
            if (!user?.id) {
                setRecentAgents([])
                return
            }

            try {
                const { data, error } = await supabase
                    .from('agents')
                    .select('name, description, category, share_token')
                    .eq('created_by', user.id)
                    .limit(4)

                if (error) throw error
                setRecentAgents(data || [])
            } catch (err) {
                console.error('Unable to fetch recent agents from Supabase:', err)
                setRecentAgents([])
            }
        }

        loadRecentAgents()
    }, [user])

    return (
        <div className='min-h-screen bg-[#0F172A] flex'>
            <Sidebar />

            <div className='flex-1'>
                <Navbar />

                <div className='p-6'>

                    

                    <div className='grid grid-cols-1 gap-6 mt-6'>

                        <div className='mx-auto w-full max-w-5xl bg-[#111827] rounded-2xl border border-slate-800 p-6'>
                            <h2 className='text-xl font-semibold text-white'>
                                Recent Activity
                            </h2>

                            <div className='space-y-4 mt-6'>
                                {recentAgents.length > 0 ? (
                                    recentAgents.map(agent => (
                                        <div key={agent.share_token} className='bg-[#1E293B] rounded-xl p-4 flex items-center justify-between'>
                                            <div>
                                                <p className='text-white font-medium'>
                                                    {agent.name}
                                                </p>
                                                <p className='text-slate-400 text-sm mt-1'>
                                                    {agent.description || agent.category || 'New review agent created.'}
                                                </p>
                                            </div>

                                            <span className='bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm'>
                                                {agent.category || 'New'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className='bg-[#1E293B] rounded-xl p-6 text-slate-400'>
                                        No recent agents found. Create an agent to populate this activity feed.
                                    </div>
                                )}
                            </div>
                        </div>

                       
                        </div>
                    </div>
                </div>
            </div>
        
    )
}

export default Dashboard