import React from 'react'
import { APPLICATION_STATUS, APPLICATION_STATUS_COLORS } from '../constants'

const StatusBadge = ({ status = APPLICATION_STATUS.PENDING }) => {
    const colors = APPLICATION_STATUS_COLORS[status] || APPLICATION_STATUS_COLORS.pending

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-s font-medium ${colors.bg} ${colors.text}`}>
            {status}
        </span>
    )
}

export default StatusBadge
