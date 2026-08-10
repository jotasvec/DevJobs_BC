import React from 'react'
import Loading from './Loading'

const DataTable = ({
    columns = [],
    data = [],
    emptyMessage = 'No results found',
    loading = false,
}) => {
    if (loading) return <Loading isLoading={loading} />

    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 4v16"/>
                    <path d="M17 4v16"/>
                    <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>
                </svg>
                <p>{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={col.key || index}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={col.key || colIndex}>
                                    {col.render ? col.render(row) : row[col.key] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataTable
