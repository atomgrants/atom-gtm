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
    <div>
      <div className='relative'>
        <Input
          className='w-[1070px] max-w-full text-left pl-10'
          type='search'
          placeholder='search job'
          value={searchResult}
          onChange={(e) => setSearchResult(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              console.log(searchResult);
            }
          }}
        />
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
      </div>
    </div>
  );
}
