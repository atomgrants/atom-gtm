import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { SearchProvider } from '@/components/providers/searchContext';
import SearchJob from '@/components/searchJob';
import BackToJobButton from '@/components/buttons/BackToJobButton';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SearchProvider>
          <div className='flex flex-col min-h-screen bg-white'>
            <main className='flex flex-col items-center'>
              <Head>
                <title>Atom Job Posting Board</title>
              </Head>
              <div className='grid grid-cols-[auto_1fr_auto] items-center w-full px-5 mt-6'>
                <div className=' flex flex-start ml-5 mb-6 gap-4'>
                  <Link href='https://atomgrants.com/'>
                    <Image
                      src='/images/atom-logo.png'
                      alt='atom logo'
                      width={40}
                      height={40}
                      priority
                    />
                  </Link>
                  <BackToJobButton />
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <SearchJob />
              </div>
              {children}
            </main>
            <span className='mt-6 line-clamp-1 text-muted-foreground text-xs text-center py-2'>
              Made with ❤️ by Atom Grants
            </span>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
