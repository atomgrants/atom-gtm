'use client';

import { usePathname } from 'next/navigation';
import ArrowLink from '@/components/links/ArrowLink';

export default function BackToJobButton() {
  const pathname = usePathname();
  const show = pathname !== '/jobs';

  if (!show) return null;

  return (
    <ArrowLink direction='left' className='ml-10' href='/jobs'>
      Back to Jobs
    </ArrowLink>
  );
}
