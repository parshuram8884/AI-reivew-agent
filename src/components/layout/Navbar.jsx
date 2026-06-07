import { Link } from "react-router-dom"
import { FaPlus } from 'react-icons/fa'

function Navbar() {
    return (
        <div className='bg-[#111827] border-b border-slate-800 px-6 py-4 flex items-center justify-between'>

            <div>
                <h2 className='text-2xl font-bold text-white'>Dashboard</h2>
                <p className='text-slate-400 text-sm mt-1'>
                    Monitor AI review workflows and escalations.
                </p>
                
            </div>
            <Link
                to='/create-agent'
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all'
            >
                <FaPlus className='text-xs' /> New Agent
            </Link>
            
        </div>
    )
}

export default Navbar
