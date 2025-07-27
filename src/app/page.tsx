'use client';

import Head from 'next/head';
import * as React from 'react';
import {useEffect,useState } from 'react';
import '@/lib/env';

import JobCard from '@/components/job-card/job-card';
import PaginationMain from '@/components/utils/pagination';




export default function HomePage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  //const n = [0]
  //const n = [0, 1, 2]
  const n = [0, 1, 2, 3, 4, 5]

  const fetchJobs = async ()=> {
    try{
        setIsLoading(true)

        const response = await fetch('/api/jobpost/fetch-jobs', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        })

        if(!response.ok){
          throw new Error(`Failed to fetch jobs: ${response.status}`)
        }

        const data = await response.json()
        setJobs(data.jobEmail)

    }catch(err){
      console.error("Error fetching jobs:", err)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=> {
    fetchJobs()
  }, [])

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
        {isLoading && (
            <div className='text-center text-gray-600 mt-4'>
              Loading jobs...
            </div>
          )}
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
