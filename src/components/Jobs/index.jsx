import React, { useId, useMemo, useState } from 'react'
import JobsList from './JobsList'
import JobsData from '../../data.json'
import SearchField from '../SearchField'
import { useFilters } from '../../hooks/useFilters'


const Jobs = () => {
    const searchInputID = useId()
    const technologyID = useId()
    const locationID = useId()
    const levelID = useId()
    const [formData, setFormData] = useState( new FormData())

    const handleChange = (event) => {
        setFormData(FormData(event.currentTarget));
        // NOTE: if I take options out of the form tag, this won't work, in that case, change it to the names
    }

    const { filters, searchInput, updateSearch, handleSearchSubmit, filteredJobs } = useFilters({
        search: formData.get(searchInputID),
        technology: formData.get(technologyID),
        location: formData.get(locationID),
        level: formData.get(levelID),
    }, JobsData)

  return (
    <>
        <section className='jobs-search'>
            <h2>Find your next Job</h2>
            <p>Explore thousands oportunities on the tech industry</p>
            <form onSubmit={handleSearchSubmit} onChange={handleChange} id="jobs-search-form" action="" role="search">
                <SearchField searchInputID={searchInputID} />
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