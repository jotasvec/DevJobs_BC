import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getJobsbyUserId } from '../../services/jobs.services'
import Loading from '../../components/Loading'
import DataTable from '../../components/DataTable.jsx'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants'
import { useNavigate } from 'react-router'
import { ChevronRight } from 'lucide-react'

const JobsPosted = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const { data: jobsData, isLoading, error } = useQuery({
        queryKey: ['recruiter-jobs', user?.id],
        queryFn: () => getJobsbyUserId(user.id),
        enabled: !!user?.id
    })

    if (isLoading) return <Loading isLoading={isLoading} />

    const jobs = jobsData?.data?.data || []

    const jobColumns = [
        { key: 'title', label: 'Job Title', render: (row) => row.title },
        { key: 'company', label: 'Company', render: (row) => row.company?.name || '-' },
        { key: 'location', label: 'Location', render: (row) => row.location || '-' },
        {
            key: 'actions', label: '', render: (row) => (
                <button
                    onClick={() => navigate(`${ROUTES.MY_JOBS}/${row.id}/applicants`)}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                    View Applicants <ChevronRight size={14} />
                </button>
            )
        },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-text mb-1">My Jobs</h1>
                <p className="text-text-muted text-sm">Manage your posted jobs and review applicants.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg px-4 py-3 mb-4 text-sm">
                    {error.message}
                </div>
            )}

            <DataTable
                columns={jobColumns}
                data={jobs}
                emptyMessage="You haven't posted any jobs yet."
            />
        </div>
    )
}

export default JobsPosted
