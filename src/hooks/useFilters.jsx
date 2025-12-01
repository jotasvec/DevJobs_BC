import React, { useId, useMemo, useState } from 'react'

const useFilters = ({initialFilter = {}, JobsData = []}) => {
  const [filters, setFilters] = useState(initialFilter)
    const [searchInput, setSearchInput] = useState("")

    const handleSearchSubmit = (event) =>{
        event.preventDefault();
        setFilters({...search})
        console.log('filters', filters)
    }

 /*    const handleChange = (event) => {
        const formData = new FormData(event.currentTarget);
        // NOTE: if I take options out of the form tag, this won't work, in that case, change it to the names
        setFilters({
            search: formData.get(searchInputID) ?? searchInput,
            technology: formData.get(technologyID),
            location: formData.get(locationID),
            level: formData.get(levelID),
        })
    } */
    const updateSearch = (value) =>{
        setSearchInput(value)
    }
    const filteredJobs = useMemo(() => {
        return JobsData.filter(job => {
            const text =  job.descripcion.toLowerCase() + job.titulo.toLowerCase()
            //Matches
            const matchesLocation = !filters.location ||  job.data.modalidad.toLowerCase().includes(filters.location);
            const matchesTech = !filters.technology ||  job.data.technology.includes(filters.technology);
            const matchesLevel = !filters.level ||  job.data.nivel.includes(filters.level);
            const matchesSearch = !filters.search || text.toLowerCase().includes(filters.search );
            
            return matchesLocation && matchesTech && matchesLevel && matchesSearch;
        
        });
    }, [filters])

    return {
        filters,
        searchInput,
        handleSearchSubmit,
        updateSearch,
        filteredJobs
    };
}

export { useFilters }