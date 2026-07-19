import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PAGINATION, API } from '../constants.js'



const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    // total - limit and offset for pagination
    const limit = PAGINATION.FRONTEND_LIMIT;
    const page = Number(searchParams.get('page') || 1)


    const filters = useMemo(() => ({
        search: searchParams.get('search') ?? "",
        technology: searchParams.get('technology') ?? "",
        location: searchParams.get('location') ?? "",
        modality: searchParams.get('modality') ?? "",
        level: searchParams.get('level') ?? "",
    }), [searchParams]) 

    const updateParams = useCallback((newParams) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            Object.entries(newParams).forEach(([key, value]) => {
                value 
                ? next.set(key, value)
                : next.delete(key);
            });
            return next
        }, {replace: true} )
    },[setSearchParams]);

    // Search on Submit
    const [rawSearchText, setRawSearchText] = useState(filters.search)

    // Filter change
    const updateField = (event) =>{
        const { name, value } = event.target;
        updateParams({
            [name]: value.toLowerCase(),
            page: 1
        })
    }

    const setPage = (page) => updateParams({ page: page})

    // === Clear Filters ===
    const clearFilters = () => {
        setRawSearchText("");
        setSearchParams({ page: 1 });
    };
    const handleSearchChange = (event) =>setRawSearchText(event.target.value.toLowerCase())
    
    //=== Debounced ===
    useEffect(() => {
        if (rawSearchText === filters.search) return;
        const handlerTimeOut = setTimeout(() =>{
            updateParams({
                search: rawSearchText.toLowerCase() || undefined,
                page: 1
            })
        }, 400);
    
      return () => {
        clearTimeout(handlerTimeOut)
      };
    }, [rawSearchText, updateParams, filters.search ]);
    

    // === Fetching === 
    // jobs list 
    const [jobs, setJobs] = useState({})
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      async function fetchJobs() {
        try {
            setLoading(true)

            // Set Query Params
            const params = new URLSearchParams({
                limit,
                offset: (page - 1) * limit,
            });
            if (filters.search) params.set('text', filters.search)
            if (filters.technology) params.set('technology', filters.technology)
            if (filters.location) params.set('location', filters.location)
            if (filters.modality) params.set('modality', filters.modality)
            if (filters.level) params.set('level', filters.level)

            //const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params.toString()}`)
            const response = await fetch(`${API.JOBS}?${params.toString()}`)
            const data = await response.json()
            setJobs(data.data)
        } catch (error) {
            console.error('Error fetching jobs: ', error)
        } finally{
            setLoading(false)
        }
      }    
      fetchJobs();
    }, [filters, page])


    /* const filteredJobs = useMemo(() => {
        return JobsData.filter(job => {
            const text =  job.descripcion.toLowerCase() + job.titulo.toLowerCase()
            //Matches
            const matchesLocation = !filters.location ||  job.data.modalidad.toLowerCase().includes(filters.location);
            const matchesTech = !filters.technology ||  job.data.technology.includes(filters.technology);
            const matchesLevel = !filters.level ||  job.data.nivel.includes(filters.level);
            const matchesSearch = !filters.search || text.toLowerCase().includes(filters.search );
            
            return matchesLocation && matchesTech && matchesLevel && matchesSearch;
        
        });
    }, [filters, JobsData])

    console.log('filteredJobs', filteredJobs) */
    
    return {
        filters,
        loading,
        jobs,
        page,
        limit,
        rawSearchText,
        updateField,
        handleSearchChange,
        setPage,
        clearFilters
        /* filteredJobs */
    };
}

export { useFilters }