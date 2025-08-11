'use client';

import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useSearch } from '@/components/providers/searchContext';
import { Input } from '@/components/ui/input';

export default function SearchJob() {
  const { searchResult, setSearchResult } = useSearch();
  const pathname = usePathname();
  const show = pathname === '/jobs';

  if (!show) return null;

  return (
    <div className='w-full px-4 sm:px-6 md:px-0'>
      <div className='relative max-w-4xl mx-auto md:max-w-none md:w-[1070px]'>
        <Input
          className='w-full text-left pl-10'
          type='search'
          placeholder='search job'
          value={searchResult}
          onChange={(e) => setSearchResult(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Handle search on Enter - add search functionality here
            }
          }}
        />
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
      </div>
    </div>
  );
}
