import React from 'react'
import Loading from '../../components/Loading'
import DataTable from '../../components/DataTable.jsx'
import { useAuth } from '../../hooks/useAuth'
import { useRecruiterJobs } from '../../hooks/useRecruiterJobs'
import { ROUTES } from '../../constants'
import { useNavigate } from 'react-router'
import { ChevronRight, Trash2 } from 'lucide-react'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'

const JobsPosted = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const {
        jobs,
        isLoading,
        error,
        deleteJob,
        isDeleting
    } = useRecruiterJobs(user?.id)
    const { open, isOpen, close, target } = useConfirm()

    if (isLoading) return <Loading isLoading={isLoading} />

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
        {
            key: 'removal', label: '', render: (row) => (
                <Trash2
                    className={`transition-colors ${
                        isDeleting
                            ? 'opacity-40 pointer-events-none'
                            : 'cursor-pointer text-text-muted hover:text-error'
                    }`}
                    onClick={() => open(row)}
                />
            )
        }
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-text mb-1">Jobs Posted</h1>
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

            <ConfirmDialog
                isOpen={isOpen}
                close={close}
                title="Delete Job"
                onConfirm={() => deleteJob(target?.id)}
            >
                {`Are you sure you want to delete "${target?.title}"? This change cannot be undone.`}
            </ConfirmDialog>
        </div>
    )
}

export default JobsPosted
