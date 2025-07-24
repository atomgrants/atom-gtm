'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import JobCard from '@/components/job-card/job-card';
import PaginationMain from '@/components/utils/pagination';


export default function HomePage() {
  const n = [0]
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <main className='flex-1 flex-col items-center'>
        <Head>
          <title>Atom Job Posting Board</title>
        </Head>
        <header>
          <div className='relative flex flex-col mt-10 text-center font-semibold leading-none'>
            Atom Job Postings
          </div>
        </header>
        <section className='flex flex-col items-center'>
          <div className='mt-10'>
            <ul className='grid grid-cols-3 gap-x-7 auto-rows-[350px] justify-center'>
              {
                n.map((i) =>
                  <li key={i}>
                    <JobCard />
                  </li>
                )
              }
            </ul>
            {/*<JobCard/>*/}
          </div>
        </section>
        <footer>
          <PaginationMain />
        </footer>
      </main>
    </div>
  );
}
