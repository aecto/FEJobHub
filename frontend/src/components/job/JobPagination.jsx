import React from 'react'

const JobPagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="job-pagination">
      <button 
        className="pagination-button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        上一页
      </button>
      
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          className={`pagination-button ${pageNum === page ? 'active' : ''}`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}
      
      <button 
        className="pagination-button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        下一页
      </button>
    </div>
  )
}

export default JobPagination