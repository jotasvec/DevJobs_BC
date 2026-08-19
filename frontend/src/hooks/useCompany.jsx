import React from 'react'
import { useAuth } from './useAuth'
import useUserProfile from './useUserProfile'
import { getAllCompanies, getCompanyById } from '../services/company.services'
import { useQuery } from "@tanstack/react-query";

function useCompany( companyId, filters ) {
    const { user } = useAuth()
    const { profile } = useUserProfile(user?.id)
    const targetId = companyId || profile?.companyId
    
    const company = useQuery({
        queryKey: ['company', targetId],
        queryFn: ({ signal }) => getCompanyById(targetId, { signal }),
        enabled: !!targetId    
    });

    const companies = useQuery({
        queryKey: ['companies', filters],
        queryFn: () => getAllCompanies(filters),
    })

    const companyData = company.data
  
    return {
        company : companyData,
        companies : companies.data,
        loading : companies.isLoading,
        error : companies.error || company.error
    }
}

export { useCompany }