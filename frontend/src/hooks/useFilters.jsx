import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'



const useFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    // total - limit and offset for pagination
    const limit = 4;
    const page = Number(searchParams.get('page') || 1)


    const filters = useMemo(() => ({
        search: searchParams.get('search') ?? "", 
        technology: searchParams.get('technology') ?? "",
        location: searchParams.get('location') ?? "",
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

    // === Clear Filters ===
    const clearFilters = () => {
    // Reset local input
        setRawSearchText("");
        setSearchParams({ page: 1 });
    };

    // Filter change
    const updateField = (event) =>{
        const { name, value } = event.target;
        updateParams({
            [name]: value.toLowerCase(),
            page: 1
        })
    }

    const setPage = (page) => updateParams({ page: page})

    // Search on Submit
    const [rawSearchText, setRawSearchText] = useState(filters.search)
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
            if (filters.level) params.set('level', filters.level)

            //const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params.toString()}`)
            const response = await fetch(`http://localhost:3050/jobs?${params.toString()}`)
            const data = await response.json()
            setJobs(data)
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