import Pagination from './Pagination.jsx'
import JobCard from './JobCard.jsx';

const JobsList = ({ filteredList, currentPage, setPage }) => {
    const totalArticles = filteredList.total
    const limit = filteredList.limit;
    const jobs = filteredList.data || [];
    const totalPages = Math.ceil(totalArticles / limit)

    const handlePageChangeOnPagination = (newPage) => {
        setPage(newPage)
    }

    return (
        <section className="jobs-result">
            <div className="jobs-result-header">
                <h2>Results</h2>
                {totalArticles > 0 && (
                    <span className="jobs-result-count">{totalArticles} jobs found</span>
                )}
            </div>

            <div className="jobs-result-list">
                {totalArticles === 0 && (
                    <div className="jobs-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                        </svg>
                        <p>No jobs match your search criteria.</p>
                        <span>Try adjusting your filters or search terms.</span>
                    </div>
                )}
                {jobs.map(job => (
                    <JobCard key={job.id} card={job} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChangeOnPagination} />
            )}
        </section>
    )
}

export default JobsList
