'use client';

import Head from 'next/head';
import * as React from 'react';
import {useEffect,useState } from 'react';
import '@/lib/env';

import JobCard from '@/components/job-card/job-card';
import PaginationMain from '@/components/utils/pagination';
import { getJobFromDb } from '@/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { JobInfo } from '@/types/job';




export default function HomePage() {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  //const n = [0]
  //const n = [0, 1, 2]
  const n = [0, 1, 2]

const CardSkeleton = () => {
  return (
    <div className="w-[340px] h-[300px] flex flex-col items-center justify-center overflow-y-auto animate-pulse border rounded-lg p-4">
      <div className="flex flex-col items-center space-y-3">
    <Skeleton circle height={64} width={64} className="mb-5" />

        {/* Title Placeholder */}
        <Skeleton height={20} width="66%" />

        {/* Description 1 Placeholder */}
        <Skeleton height={14} width="50%" />

        {/* Description 2 Placeholder */}
        <Skeleton height={14} width="33%" />

        {/* Button Placeholder */}
        <Skeleton height={32} width={96} className="mt-10" />
      </div>
    </div>
  );
};


  const fetchJobs = async ()=> {
    try{
        setIsLoading(true)
        setError(null)

        const mostRecentJobs = await getJobFromDb();
        if (Array.isArray(mostRecentJobs)) {
          const jobsForCard = mostRecentJobs.map(
            ({ job_title, organization, job_url, time }) => ({
              job_title,
              organization,
              url: job_url,           // map job_url to url
              time_posted: time,      // map time to time_posted
            })
          );
          setJobs(jobsForCard);
        } else {
          setError(mostRecentJobs.message || "Unknown error");
          setJobs([]);
        }
    }catch(err){
      setError("Error fetching jobs");
      setJobs([]);
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
        </header>
        <section className='flex flex-col items-center'>
          <div className='mt-10'>
            <ul className='grid grid-cols-3 gap-x-7 auto-rows-[350px] justify-center'>
              {isLoading ? (
                Array.from({length: 3}).map((_, index)=> 
                  <li key={`loading-${index}`}>
                    < CardSkeleton/>
                  </li>
                )
              ) : (
                jobs.map((job, index) => (
                  <li key={index}>
                    <JobCard 
                      job_title={job.job_title}
                      organization={job.organization}
                      url={job.url}
                      time_posted={job.time_posted}
                    />
                  </li>
                ))
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
