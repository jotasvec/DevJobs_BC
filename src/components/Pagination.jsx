

const Pagination = ({currentPage = 1, totalPages, onPageChange}) => {
    const pages = Array.from({length: totalPages}, (_, i) => i +1);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePrevClick = (event) => {
        event.preventDefault()
        if (!isFirstPage) {
            onPageChange(currentPage - 1)
        }
    }
    const handleNextClick = (event) => {
        event.preventDefault()
        if (!isLastPage) {
            onPageChange(currentPage + 1)
        }
    }

    const handleChangePage = (event, page) => {
        event.preventDefault()
        if (page != currentPage) {
            onPageChange(page)
        }
    }

  return (
    <nav className="pagination">
        <a href="#" className={`pagination-left ${ isFirstPage ? 'disabled' : '' }`} 
           onClick={handlePrevClick} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg></a>
        <div className="pagination-row">
            {
                pages.map(page => (
                    <a href="#" 
                        key={page}
                        className={currentPage === page ? 'is-active':''} 
                        onClick={(e) => handleChangePage(e, page)}    >
                            {page}
                    </a>
                ))
            }
        </div>
        <a href="#" className={`pagination-right ${ isLastPage ? 'disabled' : '' }`}
            onClick={handleNextClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg></a>
    </nav>
  )
}

export default Pagination