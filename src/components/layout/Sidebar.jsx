import {
    FaHome,
    FaClipboardList,
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

function Sidebar() {
    const linkClasses = ({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                : 'text-white hover:bg-[#1E293B]'
        }`

    return (
        <aside className='w-72 bg-[#111827] border-r border-slate-800 hidden lg:flex flex-col'>
            <div className='p-8 border-b border-slate-800'>
                <h1 className='text-2xl font-bold text-white'>ReviewBridge</h1>
            </div>

            <nav className='flex-1 p-5 space-y-3'>
                <NavLink to='/dashboard' className={linkClasses}>
                    <FaHome /> Dashboard
                </NavLink>

                <NavLink to='/submissions' className={linkClasses}>
                    <FaClipboardList /> Submissions
                </NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar
