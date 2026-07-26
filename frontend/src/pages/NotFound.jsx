import React from 'react'
import { useNavigate } from 'react-router'
import { ROUTES, UI } from '../constants.js'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="page-header flex flex-col items-center justify-center min-h-[60vh]">
      <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} viewBox="0 0 24 24" fill="none" stroke="rgba(0, 153, 255)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mb-6">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 15l3 -3m2 -2l1 -1" />
        <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
        <path d="M3 3l18 18" />
        <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
      </svg>
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
