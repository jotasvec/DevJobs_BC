// import React, { useState } from 'react'
import Pagination from './Pagination.jsx'
import JobCard from './JobCard.jsx';

const JobsList = ({ filteredList, currentPage, setPage }) => {

    
    const totalArticles = filteredList.total
    const limit = filteredList.limit;
    // const offset = filteredList.offset; 
    const jobs = filteredList.data || [];
    // const [currentPage, setCurrentPage] = useState(1)
    
    const totalPages = Math.ceil(totalArticles/ limit)
    
    /* const paginationResult = filteredList.data.slice(
        (page - 1)* ARTICLES_PER_PAGE,
        page * ARTICLES_PER_PAGE
    ); */

    const handlePageChangeOnPagination = (newPage) => {
        //setCurrentPage(page)
        //const newOffset = (newPage - 1) * limit;
        setPage(newPage)
    } 

    return (
        <section className="jobs-result">
            <div className="">
                <h2 className="">Resultados de búsqueda</h2>
                <div className="selected-list"></div>

                <div className="jobs-result-list">
                    {
                        totalArticles === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', textWrap: 'balance', border:'2px solid var(--border)', borderRadius: '1rem'  }}>
                                Couldn't found jobs that matches with the search criteria.
                            </p>
                        )
                    }
                    {
                        jobs.map(job => (
                            <JobCard key={job.id} card={job}/> 
                        ))
                    }
                </div>
                {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageHandle} /> */} 
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChangeOnPagination} /> 
            </div>
        </section>
    )
}

export default JobsList