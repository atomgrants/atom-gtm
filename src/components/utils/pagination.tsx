import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationMainProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationMain({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationMainProps) {
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVisiblePages = (isMobile = false) => {
    const pages: (number | string)[] = [];
    const maxPages = isMobile ? 3 : 7;

    // If maxPages or fewer pages, show all
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Mobile: Show fewer pages
    if (isMobile) {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage, 'ellipsis', totalPages);
      }
      return pages;
    }

    // Desktop: Original logic
    // Always show first page
    pages.push(1);

    if (currentPage <= 4) {
      // Show: 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show: 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show: 1, ..., current-1, current, current+1, ..., last
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  // Check screen size for mobile pagination
  const visiblePagesMobile = getVisiblePages(true);
  const visiblePagesDesktop = getVisiblePages(false);

  return (
    <Pagination className='w-full'>
      <PaginationContent className='flex-wrap justify-center gap-1'>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={handlePrevious}
            className={`text-sm ${
              currentPage <= 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }`}
          />
        </PaginationItem>
        
        {/* Mobile pagination: fewer pages */}
        <div className='flex sm:hidden'>
          {visiblePagesMobile.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  onClick={(e) => handlePageClick(page as number, e)}
                  isActive={page === currentPage}
                  className='cursor-pointer text-sm'
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>
        
        {/* Desktop pagination: more pages */}
        <div className='hidden sm:flex'>
          {visiblePagesDesktop.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  onClick={(e) => handlePageClick(page as number, e)}
                  isActive={page === currentPage}
                  className='cursor-pointer'
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>
        
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={handleNext}
            className={`text-sm ${
              currentPage >= totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
