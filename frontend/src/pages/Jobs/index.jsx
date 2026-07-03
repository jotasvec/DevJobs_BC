import JobsList from './JobsList'
import SearchField from '../../components/SearchField'
import { useFilters } from "../../hooks/useFilters";

const Jobs = () => {
    const {
        filters,
        loading,
        jobs,
        page,
        rawSearchText,
        updateField,
        handleSearchChange,
        setPage,
        clearFilters } = useFilters()

    return (
        <>
            <section className="page-header">
                <span className="page-header-label">Jobs</span>
                <h1>Find your next role</h1>
                <p>Browse thousands of developer positions from startups to big tech.</p>
                <SearchField
                    value={rawSearchText}
                    onChange={handleSearchChange}
                    onSubmit={() => setPage(1)}
                />
            </section>

            <section className="jobs-page-content">
                <div className="jobs-filter-bar">
                    <select name="technology" onChange={updateField} value={filters.technology}>
                        <option value="">All Technologies</option>
                        <optgroup label="Popular">
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="react">React</option>
                            <option value="nodejs">Node.js</option>
                            <option value="java">Java</option>
                        </optgroup>
                        <option value="csharp">C#</option>
                        <option value="c">C</option>
                        <option value="c++">C++</option>
                        <option value="ruby">Ruby</option>
                        <option value="php">PHP</option>
                    </select>
                    <select name="location" onChange={updateField} value={filters.location}>
                        <option value="">All Locations</option>
                        <option value="remoto">Remote</option>
                        <option value="cdmx">Ciudad de Mexico</option>
                        <option value="guadalajara">Guadalajara</option>
                        <option value="monterrey">Monterrey</option>
                        <option value="barcelona">Barcelona</option>
                    </select>
                    <select name="level" onChange={updateField} value={filters.level}>
                        <option value="">All Levels</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead</option>
                    </select>
                    <button className="filter-clear-btn" onClick={clearFilters}>Clear</button>
                </div>

                {
                    loading
                        ? <div className="page-loading"><span>Loading jobs...</span></div>
                        : <JobsList filteredList={jobs} currentPage={page} setPage={setPage} />
                }
            </section>
        </>
    )
}

export default Jobs
