import React, { useEffect, useState } from 'react'
import { API } from '../../constants'
import Loading from '../../components/Loading'
import { Building2, Globe, MapPin } from 'lucide-react'

const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const res = await fetch(`${API.COMPANIES}`);
                if(!res.ok) throw new Error(`Company request failed: ${res.statusText}`);
                const json = await res.json()
                setCompanies(json.data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        loadCompanies();
    }, [])
    
    if(loading) return <Loading />
    if(error) return <p className="text-center text-text-muted py-10">An error occurred loading companies.</p>

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold text-text mb-2">Companies</h1>
                <p className="text-text-muted text-sm">Discover companies hiring developers</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map(company => (
                    <article 
                        key={company.id}
                        className="bg-card border border-white/8 rounded-xl p-5 transition-all duration-150 hover:border-accent/20 hover:-translate-y-0.5"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <Building2 size={22} className="text-accent" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-heading text-base font-semibold text-text truncate">
                                    {company.name}
                                </h3>
                                {company.industry && (
                                    <p className="text-xs text-text-muted mt-0.5">{company.industry}</p>
                                )}
                            </div>
                        </div>
                        
                        {company.description && (
                            <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                                {company.description}
                            </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-text-muted pt-3 border-t border-white/6">
                            {company.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={13} />
                                    {company.location}
                                </span>
                            )}
                            {company.website && (
                                <a 
                                    href={company.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-accent transition-colors"
                                >
                                    <Globe size={13} />
                                    Website
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Companies
