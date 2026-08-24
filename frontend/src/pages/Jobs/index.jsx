import JobsList from './JobsList'
import SearchField from '../../components/SearchField'
import { useFilters } from "../../hooks/useFilters";
import { LEVEL, UI } from '../../constants.js';
import useJobs from '../../hooks/useJobs.jsx';

const Jobs = () => {
    const {
        filters,
        page,
        limit,
        rawSearchText,
        updateField,
        handleSearchChange,
        setPage,
        clearFilters } = useFilters()

    const { 
        loading,
        jobs } = useJobs({page, filters, limit})

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

            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="flex flex-wrap gap-3 mb-8">
                    <select 
                        name="technology" 
                        onChange={updateField} 
                        value={filters.technology}
                        className="px-3.5 py-2 pr-10 bg-white/4 border border-white/8 rounded-lg text-text-secondary text-sm font-sans cursor-pointer transition-all appearance-none hover:border-white/15 hover:bg-white/6 focus:outline-none focus:border-accent/30 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.08)]"
                        style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.6rem center"}}
                    >
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
                    <select 
                        name="location" 
                        onChange={updateField} 
                        value={filters.location}
                        className="px-3.5 py-2 pr-10 bg-white/4 border border-white/8 rounded-lg text-text-secondary text-sm font-sans cursor-pointer transition-all appearance-none hover:border-white/15 hover:bg-white/6 focus:outline-none focus:border-accent/30 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.08)]"
                        style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.6rem center"}}
                    >
                        <option value="">All Locations</option>
                        <option value="remoto">Remote</option>
                        <option value="cdmx">Ciudad de Mexico</option>
                        <option value="guadalajara">Guadalajara</option>
                        <option value="monterrey">Monterrey</option>
                        <option value="barcelona">Barcelona</option>
                    </select>
                    <select 
                        name="level" 
                        onChange={updateField} 
                        value={filters.level}
                        className="px-3.5 py-2 pr-10 bg-white/4 border border-white/8 rounded-lg text-text-secondary text-sm font-sans cursor-pointer transition-all appearance-none hover:border-white/15 hover:bg-white/6 focus:outline-none focus:border-accent/30 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.08)]"
                        style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.6rem center"}}
                    >
                        <option value="">All Levels</option>
                        <option value={LEVEL.JUNIOR}>Junior</option>
                        <option value={LEVEL.MID}>Mid-Level</option>
                        <option value={LEVEL.SENIOR}>Senior</option>
                    </select>
                    <button 
                        className="px-4 py-2 bg-white/4 border border-white/8 text-text-muted text-sm rounded-lg cursor-pointer transition-all hover:bg-white/8 hover:text-text-secondary"
                        onClick={clearFilters}
                    >
                        {UI.CLEAR}
                    </button>
                </div>

                {
                    loading
                        ? <div className="page-loading"><span>{UI.LOADING_JOBS}</span></div>
                        : <JobsList filteredList={jobs} currentPage={page} setPage={setPage} />
                }
            </section>
        </>
    )
}

export default Jobs
