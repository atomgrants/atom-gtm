import Head from 'next/head';

import BackToJobButton from '@/components/buttons/BackToJobButton';
import { SearchProvider } from '@/components/providers/searchContext';
import { Input } from '@/components/ui/input';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex flex-col min-h-screen bg-white'>
          <main className='flex flex-col items-center'>
            <SearchProvider>
            <Head>
              <title>Atom Job Posting Board</title>
            </Head>
            <div className='flex flex-row justify-between items-center w-full px-6 mt-6'>
              <div className='w-80'>
                <BackToJobButton />
              </div>
              <h1 className='text-center antialiased font-bold leading-tight text-black text-4xl flex-1'>
                <span className='bg-gradient-to-br from-orange-600 to-orange-400 bg-clip-text text-transparent antialiased'>
                  Atom
                </span>{' '}
                Job Postings
              </h1>
              <div className='w-80'>
                <Input
                  className='w-[200px] mr-36 text-center'
                  type='search'
                  placeholder='search job'
                />
                {/*
                <SearchJob/>
                */}
              </div>
            </div>
            {children}
            </SearchProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
