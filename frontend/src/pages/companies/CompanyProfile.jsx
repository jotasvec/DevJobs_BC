import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import useUserProfile from '../../hooks/useUserProfile'
import { useCompany } from '../../hooks/useCompany'
import { Building2 } from 'lucide-react'

const CompanyProfile = () => {
  const { user } = useAuth()
  const { profile } = useUserProfile(user.id)
  const { company, loading } = useCompany(profile?.companyId)

  if (loading) return <Loading isLoading={loading} />

  if (!company) return (
    <div className="text-center py-12">
      <Building2 size={48} className="mx-auto text-text-muted mb-4" />
      <p className="text-text-muted">Error loading company data</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-border flex items-center justify-center">
              <Building2 size={24} className="text-text-muted" />
            </div>
          )}
          <div>
            <h2 className="font-heading text-2xl font-bold text-text">{company.name}</h2>
            {company.industry && (
              <span className="text-sm text-text-secondary">{company.industry}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.website && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Website</label>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="block text-accent hover:underline mt-1">
                {company.website}
              </a>
            </div>
          )}
          {company.location && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Location</label>
              <p className="text-text mt-1">{company.location}</p>
            </div>
          )}
          {company.size && (
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Size</label>
              <p className="text-text mt-1">{company.size}</p>
            </div>
          )}
          {company.description && (
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Description</label>
              <p className="text-text mt-2 leading-relaxed">{company.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile
