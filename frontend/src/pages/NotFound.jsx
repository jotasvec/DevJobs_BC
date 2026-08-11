import React from 'react'
import { useNavigate } from 'react-router'
import { ROUTES, UI } from '../constants.js'
import { Link2Off } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="page-header flex flex-col items-center justify-center min-h-[60vh]">
      <LinkOff size={100} className="text-accent mb-6" />
      <h2 className="text-7xl font-bold text-text mb-2">404</h2>
      <h3 className="text-4xl font-heading text-text mb-4">{UI.PAGE_NOT_FOUND}</h3>
      <p className="text-text-secondary mb-8">{UI.PAGE_NOT_FOUND_DESC}</p>
      <button
        className="auth-submit"
        onClick={() => navigate(ROUTES.HOME)}
      >
        {UI.BACK_HOME}
      </button>
    </div>
  )
}

export default NotFound
