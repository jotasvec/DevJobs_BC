import React from 'react'
import Loading from './Loading'
import { Table2 } from 'lucide-react'

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
                <Table2 size={48} />
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
