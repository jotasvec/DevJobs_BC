import React from 'react'

const StatsCards = ({ cards, stats, columns = 3 }) => {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
            {cards.map(({ key, label, icon: Icon, color, bg }) => (
                <div key={key} className="p-4 rounded-xl bg-surface border border-border flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${bg}`}>
                        <Icon size={20} className={color} />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs uppercase tracking-wide">{label}</p>
                        <p className="font-heading text-2xl font-bold text-text">{stats?.[key] || 0}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatsCards
