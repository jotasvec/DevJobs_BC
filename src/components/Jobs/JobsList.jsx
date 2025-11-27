import React, { useState } from 'react'
import Pagination from './Pagination.jsx'
import JobCard from './JobCard.jsx';

const ARTICLES_PER_PAGE = 3;

const JobsList = ({ filteredList }) => {

    const totalArticles = filteredList.length
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(totalArticles/ ARTICLES_PER_PAGE)

    const paginationResult = filteredList.slice(
        (currentPage - 1)* ARTICLES_PER_PAGE,
        currentPage * ARTICLES_PER_PAGE
    )

    const onPageHandle = (page) => {
        setCurrentPage(page)
    }

    return (
        <section className="jobs-result">
            <div className="">
                <h2 className="">Resultados de búsqueda</h2>
                <div className="selected-list"></div>

                <div className="jobs-result-list">
                    {
                        paginationResult.map(job => (
                            <JobCard key={job.id} card={job}/> 
                        ))
                    }
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageHandle} /> 
            </div>
        </section>
    )
}

export default JobsList