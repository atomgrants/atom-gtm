import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import BackToJobButton from '@/components/buttons/BackToJobButton';
import ButtonLink from '@/components/links/ButtonLink';
import { SearchProvider } from '@/components/providers/searchContext';
import SearchJob from '@/components/searchJob';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SearchProvider>
          <div className='flex flex-col min-h-screen bg-white'>
            <main className='flex-1 flex flex-col items-center'>
              <Head>
                <title>Atom Job Posting Board</title>
              </Head>
              <div className='w-full px-4 sm:px-5 mt-6'>
                {/* Mobile Layout */}
                <div className='flex flex-col gap-4 md:hidden mb-8'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Link href='https://atomgrants.com/'>
                        <Image
                          src='/images/atom-logo.png'
                          alt='atom logo'
                          width={32}
                          height={32}
                          priority
                        />
                      </Link>
                      <BackToJobButton />
                    </div>
                    <ButtonLink
                      className='text-center'
                      href='mailto:tomer@atomgrants.com?subject=Job%20Post%20Submission&body=Please%20include%20your%20job%20details%20here.'
                      variant='light'
                      size='sm'
                    >
                      Submit
                    </ButtonLink>
                  </div>
                </div>
                
                {/* Desktop Layout */}
                <div className='hidden md:grid grid-cols-[auto_1fr_auto] items-center w-full'>
                  <div className='flex flex-start ml-5 mb-6 gap-4'>
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
                  <div />
                  <div className='pr-5 mb-6'>
                    <ButtonLink
                      className='block text-center'
                      href='mailto:tomer@atomgrants.com?subject=Job%20Post%20Submission&body=Please%20include%20your%20job%20details%20here.'
                      variant='light'
                      size='sm'
                    >
                      Submit a job post
                    </ButtonLink>
                  </div>
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <SearchJob />
              </div>
              {children}
            </main>
            <span className='mt-6 px-4 line-clamp-1 text-muted-foreground text-xs text-center py-2'>
              Made with ❤️ by Atom Grants
            </span>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
