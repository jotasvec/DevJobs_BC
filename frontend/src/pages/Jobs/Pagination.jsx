import styles from "./Pagination.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

    const buildChangePageURL = (page) => { 
        const url = new URL(window.location)
        url.searchParams.set('page', page)
        return `${url.pathname}?${url.searchParams.toString()}`
    }

  return (
    <nav className={styles.pagination} >
        <a href={buildChangePageURL(currentPage - 1)} className={`pagination-left ${ isFirstPage ? styles.disabled : '' }`} 
           onClick={handlePrevClick} ><ChevronLeft size={24} /></a>
        <div className={styles.paginationRow}>
            {
                pages.map(page => (
                    <a href={buildChangePageURL(page)}
                        key={page}
                        className={currentPage === page ? styles.isActive:''} 
                        onClick={(e) => handleChangePage(e, page)}    >
                            {page}
                    </a>
                ))
            }
        </div>
        <a href={buildChangePageURL(currentPage + 1)} className={`pagination-right ${ isLastPage ? styles.disabled : '' }`}
            onClick={handleNextClick}><ChevronRight size={24} /></a>
    </nav>
  )
}

export default Pagination