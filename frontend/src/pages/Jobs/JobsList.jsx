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
        <section className="flex flex-col gap-5">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-heading text-lg font-semibold text-text">Results</h2>
                {totalArticles > 0 && (
                    <span className="font-mono text-xs text-text-muted">{totalArticles} jobs found</span>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {totalArticles === 0 && (
                    <div className="flex flex-col items-center gap-3 py-16 px-8 text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted mb-2">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                        </svg>
                        <p className="text-text-secondary text-base">No jobs match your search criteria.</p>
                        <span className="text-sm text-text-muted">Try adjusting your filters or search terms.</span>
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
