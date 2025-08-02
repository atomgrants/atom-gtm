'use client';

import { useState } from 'react';

import { getJobFromDb } from '@/lib/utils';

import { useSearch } from '@/components/providers/searchContext';
import { Input } from '@/components/ui/input';

export default function SearchJob() {
  const [jobsToShow, setJobsToShow] = useState<any[]>([]);
  const { searchResult, setSearchResult } = useSearch();

  const jobs = getJobFromDb();
  const mockResults = ['apple', 'banana', 'orange', 'grape', 'mango'];

  return (
    <div>
      <Input
        className='w-[200px] mr-36 text-center'
        type='search'
        placeholder='search job'
        value={searchResult}
        onChange={(e) => setSearchResult(e.target.value)}
        onKeyDown={(e)=> {
          if(e.key === 'Enter'){
            console.log(searchResult)
          }
        }}
      />
    </div>
  );
}
