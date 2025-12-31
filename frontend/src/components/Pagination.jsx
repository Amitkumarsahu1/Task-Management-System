import React from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-8 mb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600"
        }`}
      >
        <FaChevronLeft className="w-3 h-3" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-sm">
              •••
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 px-2 text-sm font-medium rounded-md transition-all duration-200 ${
                currentPage === page
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

export default Pagination