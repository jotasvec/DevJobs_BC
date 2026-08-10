import React from 'react'
import { APPLICATION_STATUS } from '../constants'

const StatusBadge = ({ status = APPLICATION_STATUS.PENDING }) => {
    const colorMap = {
        pending:    { bg: 'bg-amber-500',  text: 'text-amber-800'  },
        reviewed:   { bg: 'bg-blue-500',   text: 'text-blue-800'   },
        shortlisted:{ bg: 'bg-purple-500', text: 'text-purple-800' },
        accepted:   { bg: 'bg-green-500',  text: 'text-green-800'  },
        rejected:   { bg: 'bg-red-500',    text: 'text-red-800'    },
        withdrawn:  { bg: 'bg-gray-500',   text: 'text-gray-800'   },
    }


  return (
    <> 
        <span className={` inline-flex items-center px-2.5 py-0.5 rounded-full text-s font-medium ${colorMap[status].bg } ${colorMap[status].text} `} >
            { status } 
        </span>
    </>
  )
}

export default StatusBadge  