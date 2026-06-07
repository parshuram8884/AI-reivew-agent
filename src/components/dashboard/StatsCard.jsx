function StatsCard({ title, value, growth }) {
    return (
        <div className='bg-[#111827] rounded-2xl p-6 border border-slate-800'>
            <p className='text-slate-400 text-sm'>{title}</p>

            <h2 className='text-3xl font-bold text-white mt-4'>
                {value}
            </h2>

            <p className='text-green-400 text-sm mt-2'>
                {growth}
            </p>
        </div>
    )
}

export default StatsCard
