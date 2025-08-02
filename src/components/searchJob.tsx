'use client';

import { useState } from 'react';

import { getJobFromDb } from '@/lib/utils';

import { useSearch } from '@/components/providers/searchContext';

export default function SearchJob() {
  const [jobsToShow, setJobsToShow] = useState<any[]>([]);
  const { searchResult, setSearchResult } = useSearch();

  const jobs = getJobFromDb();
  const mockResults = ['apple', 'banana', 'orange', 'grape', 'mango'];

  return (
    <div>
      <input
        type='text'
        placeholder='search job'
        value={searchResult}
        onChange={(e) => setSearchResult(e.target.value)}
      />
    </div>
  );
}
