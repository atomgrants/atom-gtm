import Head from 'next/head';

import BackToJobButton from '@/components/buttons/BackToJobButton';
import { Input } from '@/components/ui/input';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex flex-col min-h-screen bg-white'>
          <main className='flex flex-col items-center'>
            <Head>
              <title>Atom Job Posting Board</title>
            </Head>
            <div className='flex flex-row justify-between items-center w-full px-10 mt-10'>
              <div className='w-40'>
                <BackToJobButton />
              </div>
              <h1 className='text-center antialiased font-bold leading-tight text-black text-4xl flex-1'>
                Atom Job Postings
              </h1>
              <div className='w-36'>
                <Input type='search' placeholder='search job' />
              {/*<SearchJob/>*/}
              </div>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
