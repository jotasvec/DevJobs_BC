import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecruiterStats } from '../../services/applications.services'
import Loading from '../../components/Loading'
import StatsCards from '../../components/StatsCards'
import { APPLICATION_STAT_CARDS } from '../../constants'
import { LayoutDashboard } from 'lucide-react'

const ApplicantDashboard = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['recruiter-stats'],
        queryFn: getRecruiterStats,
    })

    if (isLoading) return <Loading isLoading={isLoading} />

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard size={24} className="text-accent" />
                <div>
                    <h1 className="font-heading text-2xl font-bold text-text">Dashboard</h1>
                    <p className="text-text-muted text-sm">Overview of applications across all your job postings.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg px-4 py-3 mb-6 text-sm">
                    {error.message}
                </div>
            )}

            <StatsCards
                cards={APPLICATION_STAT_CARDS}
                stats={stats?.data}
                columns={4}
            />
        </div>
    )
}

export default ApplicantDashboard
