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
      {page > 1 && (
        <>
          <a 
            className="pagination-link pagination-icon"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
            href="#"
            title="首页"
          >
            &laquo;
          </a>
          <a 
            className="pagination-link pagination-icon"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(page - 1)
            }}
            href="#"
            title="上一页"
          >
            &lsaquo;
          </a>
        </>
      )}
      
      {getPageNumbers().map((pageNum) => (
        <a
          key={pageNum}
          className={`pagination-link ${pageNum === page ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            onPageChange(pageNum)
          }}
          href="#"
        >
          {pageNum}
        </a>
      ))}
      
      {page < totalPages && (
        <>
          <a 
            className="pagination-link pagination-icon"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(page + 1)
            }}
            href="#"
            title="下一页"
          >
            &rsaquo;
          </a>
          <a 
            className="pagination-link pagination-icon"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(totalPages)
            }}
            href="#"
            title="末页"
          >
            &raquo;
          </a>
        </>
      )}
    </div>
  )
}

export default JobPagination