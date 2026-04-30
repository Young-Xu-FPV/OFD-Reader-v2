import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationBarProps {
  currentPage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPage,
  pageCount,
  onPrevPage,
  onNextPage,
  onGoToPage
}) => {
  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const page = parseInt(target.value, 10);
      if (page >= 0 && page < pageCount) {
        onGoToPage(page);
      } else {
        target.value = String(currentPage);
      }
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 0 && page < pageCount) {
      onGoToPage(page);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-4">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 0}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={pageCount}
          value={currentPage + 1}
          onKeyDown={handlePageInput}
          onChange={handlePageChange}
          className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500">
          / {pageCount}
        </span>
      </div>

      <button
        onClick={onNextPage}
        disabled={currentPage === pageCount - 1}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default NavigationBar;
