import { Suspense } from 'react';
import JobsContent from './jobs-content';

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col min-h-screen bg-white'>
          <main className='flex-1 flex-col items-center'>
            <header>
              <div className='relative flex flex-col mt-10 text-center font-semibold leading-none'>
                Atom Job Postings
              </div>
            </header>
            <section className='flex flex-col items-center'>
              <div className='mt-10 text-center'>Loading jobs...</div>
            </section>
          </main>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
