import React, { useId, useMemo, useState } from 'react'
import JobsList from './JobsList'
import JobsData from '../data.json'


const Jobs = () => {
    const [filters, setFilters] = useState({
        search: "",
        technology: "",
        location: "",
        level: "",
    })
    const searchInputID = useId()
    const technologyID = useId()
    const locationID = useId()
    const levelID = useId()

    const handleSearchSubmit = (event) =>{
        event.preventDefault();
        setFilters({...search})
        console.log('filters', filters)
    }

    const handleChange = (event) => {
 

        const formData = new FormData(event.currentTarget);
        setFilters({
            search: formData.get(searchInputID),
            technology: formData.get(technologyID),
            location: formData.get(locationID),
            level: formData.get(levelID),
        })
        

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

  return (
    <>
        <section className='jobs-search'>
            <h2>Find your next Job</h2>
            <p>Explore thousands oportunities on the tech industry</p>
            <form onSubmit={handleSearchSubmit} onChange={handleChange} id="jobs-search-form" action="" role="search">
                <div className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                    <input name={searchInputID} required type="text" placeholder="search jobs" />
                    <button type='submit'>search</button>
                </div>
                <div className="jobs-filter">
                    <select name={technologyID} id="filter-tech">
                        <option value="">Tech</option>
                        <optgroup label="most popular">
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="react">React</option>
                            <option value="nodejs">Node.js</option>
                            <option value="java">Java</option>
                        </optgroup>
                        <hr />
                        <option value="csharp">C#</option>
                        <option value="c">C</option>
                        <option value="c++">C++</option>
                        <hr />
                        <option value="ruby">Ruby</option>
                        <option value="php">PHP</option>
                    </select>
                    <select name={locationID} id="filter-location" >
                        <option value="">Location</option>
                        <option value="remoto">Remoto</option>
                        <option value="cdmx">Ciudad de México</option>
                        <option value="guadalajara">Guadalajara</option>
                        <option value="monterrey">Monterrey</option>
                        <option value="barcelona">Barcelona</option>
                    </select>
                    <select name={levelID} id="filter-experience">
                        <option value="">Experience</option>
                        <option value="junior">junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">lead</option>
                    </select>
                </div>   
            </form>
        </section>
        <JobsList filteredList={filteredJobs} />
    </>
  )
}

export default Jobs