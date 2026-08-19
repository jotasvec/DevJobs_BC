import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import useUserProfile from '../../hooks/useUserProfile'
import { useCompany } from '../../hooks/useCompany'

const CompanyProfile = () => {
  const { user } = useAuth()
  const { profile } = useUserProfile(user.id)
  const { company , loading } = useCompany(profile?.companyId)


  if (loading) return <Loading isLoading={loading} />
  
  if(!company ) return <div> An error has occurring retreiving Comapny data</div>
  
  return (
     <div className="p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 mb-4">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
            logo
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{company.name}</h2>
          {company.industry && (
            <span className="text-sm text-gray-500">{company.industry}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {company.website && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Website</label>
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
              {company.website}
            </a>
          </div>
        )}
        {company.location && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
            <p className="text-gray-700">{company.location}</p>
          </div>
        )}
        {company.size && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Size</label>
            <p className="text-gray-700">{company.size}</p>
          </div>
        )}
        {company.description && (
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
            <p className="text-gray-700 mt-1">{company.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyProfile