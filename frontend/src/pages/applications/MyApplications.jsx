import React, { useEffect, useState } from 'react'
import { getApplications, withdrawApplication } from '../../services/applications.services'
import Loading from '../../components/Loading'
import { APPLICATION_TABLE_HEADER, ROUTES, UI } from "../../constants.js";
import StatusBadge from '../../components/StatusBadge.jsx';
import { useNavigate } from 'react-router';
import DataTable from '../../components/DataTable.jsx';

const MyApplications = () => {
    const [applicationList, setApplicationList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [withdrawError, setWithdrawError] = useState(null)
    const navigate = useNavigate()



    useEffect(() => {
        const params = new URLSearchParams()
        const fetchApplications = async (params) => {
            setLoading(true)    
            try {
                const { data } = await getApplications(params)
                setApplicationList(data.data)
            } catch (err) {
                console.error(err);
                setError(err)
                
            }  finally{
                setLoading(false)
            }
        }
        
        fetchApplications(params);
    },[])

    const handleWithdraw = async (id) => {
        try {
            await withdrawApplication(id)
            setApplicationList(prev => prev.filter(app => app.id !== id))
        } catch (err) {
            setWithdrawError(`Failed to withdraw application. Please try again. \n${err}`)
        }
    }

    if (loading) return <Loading isLoading={loading} />

    if (error || !applicationList) {
        return (
            <div className="page-header">
                <h1>Application Not Found</h1>
                <p>There is no active applications on your profile</p>
                <button className="auth-submit" onClick={() => navigate(ROUTES.JOBS)}>{UI.FIND_YOUR_NEXT_ROLE}</button>
            </div>
        )
    }

    const columns = [
        {key: 'company', label: 'Company', render: (row) => row.job?.company?.name || '-' },
        {key: 'title', label: 'Job Title', render: (row) => row.job?.title || '-'},
        {key: 'location', label: 'Location', render: (row) => row.job?.location || '-'},
        {key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} />},
        {key: 'updated_at', label: 'Last Update', render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '-'},
        {key: 'created_at', label: 'Applied On', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'},
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                row.status !== 'withdrawn' ? (
                    <button
                        onClick={() => handleWithdraw(row.id)}
                        className="text-xs text-text-muted hover:text-red-400 transition-colors"
                    >
                        Withdraw
                    </button>
                ) : '-'
            )
        },
    ];

    return (
        <div>
            <h2>My Applications</h2>
            {withdrawError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg px-4 py-3 mb-4 text-sm">
                    {withdrawError}
                </div>
            )}
            <DataTable 
                loading={loading}
                columns={columns}
                data={applicationList}
                emptyMessage="You haven't applied to any jobs yet."
            />
        </div>
    )
}


export default MyApplications