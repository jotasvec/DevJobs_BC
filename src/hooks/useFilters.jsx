import React, { useEffect, useState } from 'react'
// import React, { useEffect, useMemo, useState } from 'react'

const useFilters = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || "",
        technology: "",
        location: "",
        level: "",
    }) 

    const updateField = (event) =>{
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value.toLowerCase(),
        }))
        setPage(1)

    }
 
    const handleSearchChange = (event) =>{
        const { value } = event.target;
        setFilters(prev => ({
            ...prev,
            search: value.toLowerCase(),
        }))
        setPage(1)
    }

    // === Fetching === 
    // total - limit and offset for pagination
    const limit = 4;
    const [page, setPage] = useState(1)

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
                offset: (page - 1) * limit

            });
            if (filters.search) params.append('text', filters.search)
            if (filters.technology) params.append('technology', filters.technology)
            if (filters.location) params.append('type', filters.location)
            if (filters.level) params.append('level', filters.level)

            const response = await fetch(`https://jscamp-api.vercel.app/api/jobs?${params.toString()}`)
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
        updateField,
        handleSearchChange,
        setPage,
        /* filteredJobs */
    };
}

export { useFilters }