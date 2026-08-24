import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplications, updateApplicationStatus, getApplicationByStats } from '../../services/applications.services'
import { getJobById } from '../../services/jobs.services'
import Loading from '../../components/Loading'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import StatsCards from '../../components/StatsCards.jsx'
import { APPLICATION_STAT_CARDS, ROUTES } from '../../constants'
import { ArrowLeft } from 'lucide-react'

const ApplicationsPerJob = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: jobData, isLoading: isLoadingJob } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => getJobById(jobId),
        enabled: !!jobId
    })

    const { data: appsData, isLoading: isLoadingApps } = useQuery({
        queryKey: ['job-applications', jobId],
        queryFn: () => getApplications(new URLSearchParams({ jobId })),
        enabled: !!jobId
    })

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['job-stats', jobId],
        queryFn: () => getApplicationByStats(new URLSearchParams({ jobId })),
        enabled: !!jobId
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ applicationId, newStatus }) =>
            updateApplicationStatus(applicationId, { status: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries(['job-applications', jobId])
            queryClient.invalidateQueries(['job-stats', jobId])
        }
    })

    if (isLoadingJob) return <Loading isLoading={isLoadingJob} />

    const job = jobData?.data
    const applications = appsData?.data?.data || []
    const jobStats = statsData?.data || null

    const applicationColumns = [
        { key: 'name', label: 'Applicant', render: (row) => row.seeker?.name || '-' },
        { key: 'email', label: 'Email', render: (row) => row.seeker?.email || '-' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'created_at', label: 'Applied On', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' },
        {
            key: 'actions', label: 'Actions', render: (row) => (
                <div className="flex gap-2">
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => updateStatusMutation.mutate({ applicationId: row.id, newStatus: 'shortlisted' })}
                                disabled={updateStatusMutation.isPending}
                                className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                            >
                                Shortlist
                            </button>
                            <button
                                onClick={() => updateStatusMutation.mutate({ applicationId: row.id, newStatus: 'rejected' })}
                                disabled={updateStatusMutation.isPending}
                                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {row.status === 'shortlisted' && (
                        <button
                            onClick={() => updateStatusMutation.mutate({ applicationId: row.id, newStatus: 'accepted' })}
                            disabled={updateStatusMutation.isPending}
                            className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                        >
                            Accept
                        </button>
                    )}
                </div>
            )
        },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(ROUTES.MY_JOBS)}
                className="flex items-center gap-2 text-text-muted hover:text-text text-sm mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to My Jobs
            </button>

            <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-text mb-1">
                    Applicants for: {job?.title || 'Loading...'}
                </h1>
                <p className="text-text-muted text-sm">
                    {job?.company?.name && `${job.company.name} · `}{job?.location}
                </p>
            </div>

            {jobStats && !isLoadingStats && (
                <div className="mb-6">
                    <StatsCards
                        cards={APPLICATION_STAT_CARDS.filter(c => c.key !== 'withdrawn')}
                        stats={jobStats}
                        columns={6}
                    />
                </div>
            )}

            {isLoadingApps ? (
                <Loading isLoading={isLoadingApps} />
            ) : (
                <DataTable
                    columns={applicationColumns}
                    data={applications}
                    emptyMessage="No applications received yet."
                />
            )}
        </div>
    )
}

export default ApplicationsPerJob
