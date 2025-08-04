import { supabaseClient } from '@/lib/client';

import ButtonLink from '@/components/links/ButtonLink';

export default async function LearnMorePage({
  params,
  searchParams,
}: {
  params: { jobId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data, error } = await supabaseClient
    .from('jobs')
    .select('*')
    .eq('id', params.jobId);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No job found with ID: {params.jobId}</div>;
  }
  return (
    <div className='min-h-screen flex justify-center py-8'>
      <div className='flex flex-col items-center w-[600px] max-h-[80vh]'>
        <section className='flex flex-col items-center w-full h-full overflow-auto'>
          <div className='h-full w-full border border-gray-200 rounded-lg shadow-sm bg-white p-6'>
            <h4 className='font-semibold tracking-normal text-slate-700 mx-auto my-6 w-full text-xl'>
              {data[0].job_title || 'No title'}
            </h4>
            <h4 className='font-light tracking-normal text-slate-700 mx-auto my-6 w-full text-l'>
              <span className='font-semibold tracking-normal text-slate-8 text-l'>
              From: 
              </span>{' '}
              {data[0].sender_name || 'No sender'}
            </h4>
            <hr className="border-gray-300 my-6" />
            <p className='font-light leading-snug tracking-normal text-slate-800 mx-auto my-6 w-full break-words whitespace-pre-wrap overflow-visible'>
              {data[0].email_body || 'No email body content'}
            </p>
          </div>
        </section>
        <ButtonLink
          className='mt-6 block text-center w-fit'
          href={data[0].job_url}
          variant='dark'
          size='sm'
        >
          Apply
        </ButtonLink>
      </div>
    </div>
  );
}
