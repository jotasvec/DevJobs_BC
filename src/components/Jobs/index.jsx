import JobsList from './JobsList'
import JobsData from '../../data.json'
import SearchField from '../SearchField'
import { useFilters } from '../../hooks/useFilters'
// import { useEffect, useState } from 'react'


const Jobs = () => {
    const {  
        filters,
        loading,
        jobs,
        page,
        updateField,
        handleSearchChange,
        setPage } = useFilters()
    /*     const handleChange = (event) => {
        updateField(event);
        
    } */
    

  return (
    <>
        <section className='jobs-search'>
            <h2>Find your next Job</h2>
            <p>Explore thousands oportunities on the tech industry</p>
            <SearchField 
                value={filters.search}
                onChange={handleSearchChange} 
                onSubmit={ () => setPage(1) }  // Since handleSearchChange already resets the page on keystroke, we can simply ensure the page resets on submit for better UX.
                />
            <form onChange={updateField} id="jobs-search-form" action="" role="search">
                <div className="jobs-filter">
                    <select name="technology" id="filter-tech">
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
                    <select name="location" id="filter-location" >
                        <option value="">Location</option>
                        <option value="remoto">Remoto</option>
                        <option value="cdmx">Ciudad de México</option>
                        <option value="guadalajara">Guadalajara</option>
                        <option value="monterrey">Monterrey</option>
                        <option value="barcelona">Barcelona</option>
                    </select>
                    <select name="level" id="filter-experience">
                        <option value="">Experience</option>
                        <option value="junior">junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">lead</option>
                    </select>
                </div>   
            </form>
        </section>
        {
            loading 
                ?  <h1>Loading Jobs ... </h1>
                : <JobsList filteredList={jobs} currentPage={page} setPage={setPage} />
        }
        
    </>
  )
}

export default Jobs