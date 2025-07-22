'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import JobCard from '@/components/job-card/job-card';




/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const n = [0,1,2,3,4]
  return (
    <main>
      <Head>
        <title>Atom Job Posting Board</title>
      </Head>
        <header>
          <div className='relative flex flex-col mt-10 text-center font-semibold leading-none'>
            Atom Job Postings
          </div>
        </header>
      <section className='flex justify-center items-center bg-white min-h-screen'>
        <ul className='grid grid-cols-3 gap-x-7 auto-rows-[350px]'>
        {
         n.map((i) => 
          <li key={i}>
            <JobCard/>
          </li>
        ) 
        }
        </ul>
        {/*<JobCard/>*/}
      </section>
    </main>
  );
}
