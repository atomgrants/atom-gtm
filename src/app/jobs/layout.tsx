import Head from 'next/head';
import BackToJobButton from '@/components/buttons/BackToJobButton';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex flex-col min-h-screen bg-white'>
          <main className='flex-1 flex-col items-center'>
            <Head>
              <title>Atom Job Posting Board</title>
            </Head>
            <header className='relative'>
              <div className='absolute left-10'>
                <BackToJobButton />
              </div>
              <h1 className='mt-10 text-center antialiased font-bold leading-tight text-black text-4xl'>
                Atom Job Postings
              </h1>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
