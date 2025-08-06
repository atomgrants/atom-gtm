'use client';

import { usePathname } from 'next/navigation';

import ArrowLink from '@/components/links/ArrowLink';
import { useSearch } from '@/components/providers/searchContext';

export default function BackToJobButton() {
  const pathname = usePathname();
  const show = pathname !== '/jobs';
  const { setSearchResult } = useSearch();

  const handleBackClick = () => {
    setSearchResult('');
  };

  if (!show) return null;

  return (
    <ArrowLink
      direction='left'
      className='text-sm'
      href='/jobs'
      onClick={handleBackClick}
    >
      Back to Jobs
    </ArrowLink>
  );
}
