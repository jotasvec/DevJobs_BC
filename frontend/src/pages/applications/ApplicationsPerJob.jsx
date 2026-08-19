import React, { useEffect, useState } from 'react'
import { getApplications, updateApplicationStatus } from '../../services/applications.services'
import { getJobsbyUserId } from '../../services/jobs.services'
import Loading from '../../components/Loading'
import StatusBadge from '../../components/StatusBadge.jsx'
import DataTable from '../../components/DataTable.jsx'
import { useAuth } from '../../hooks/useAuth'
import { ChevronRight } from 'lucide-react'

const ApplicationsPerJob = () => {
    const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [selectedJob, setSelectedJob] = useState(null)
    const [applications, setApplications] = useState([])
    //const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingApps, setLoadingApps] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await getJobsbyUserId(user.id)
                setJobs(res.data?.data || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (user?.id) fetchJobs()
    }, [user?.id])

    const fetchApplications = async (job) => {
        setSelectedJob(job)
        setLoadingApps(true)
        try {
            const params = new URLSearchParams({ jobId: job.id })
            const res = await getApplications(params)
            setApplications(res.data?.data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoadingApps(false)
        }
    }

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await updateApplicationStatus(applicationId, { status: newStatus })
            setApplications(prev =>
                prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
            )
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <Loading isLoading={loading} />

    const jobColumns = [
        { key: 'title', label: 'Job Title', render: (row) => row.title },
        { key: 'company', label: 'Company', render: (row) => row.company?.name || '-' },
        { key: 'location', label: 'Location', render: (row) => row.location || '-' },
        {
            key: 'actions', label: '', render: (row) => (
                <button
                    onClick={() => fetchApplications(row)}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                    View Applicants <ChevronRight size={14} />
                </button>
            )
        },
    ]

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
                                onClick={() => handleStatusChange(row.id, 'shortlisted')}
                                className="text-xs text-emerald-400 hover:text-emerald-300"
                            >
                                Shortlist
                            </button>
                            <button
                                onClick={() => handleStatusChange(row.id, 'rejected')}
                                className="text-xs text-red-400 hover:text-red-300"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {row.status === 'shortlisted' && (
                        <button
                            onClick={() => handleStatusChange(row.id, 'accepted')}
                            className="text-xs text-emerald-400 hover:text-emerald-300"
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
            <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-text mb-1">My Jobs</h1>
                <p className="text-text-muted text-sm">Manage your posted jobs and review applicants.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg px-4 py-3 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Job list */}
            <div className="mb-8">
                <h2 className="font-heading text-lg font-semibold text-text mb-3">Posted Jobs</h2>
                <DataTable
                    columns={jobColumns}
                    data={jobs}
                    emptyMessage="You haven't posted any jobs yet."
                />
            </div>

            {/* Applications for selected job */}
            {selectedJob && (
                <div>
                    <h2 className="font-heading text-lg font-semibold text-text mb-3">
                        Applicants for: {selectedJob.title}
                    </h2>
                    {loadingApps ? (
                        <Loading isLoading={loadingApps} />
                    ) : (
                        <DataTable
                            columns={applicationColumns}
                            data={applications}
                            emptyMessage="No applications received yet."
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default ApplicationsPerJob
