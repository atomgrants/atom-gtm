import { supabaseClient } from '@/lib/client';
import ButtonLink from '@/components/links/ButtonLink';
import ArrowLink from '@/components/links/ArrowLink';

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
    <div>
      <div className='flex justify-center w-full py-8'>
        <section className='flex flex-col items-center w-[600px]'>
          <div className='w-full border border-gray-200 rounded-lg shadow-sm bg-white p-6'>
            <h4 className='font-light tracking-normal text-slate-800 mx-auto my-6 w-full text-2xl'>
              {data[0].job_title || 'No title'}
            </h4>
            <h4 className='font-light tracking-normal text-slate-800 mx-auto my-6 w-full text-xl'>
              {data[0].sender_name || 'No sender'}
            </h4>
            <p className='font-light leading-snug tracking-normal text-slate-800 mx-auto my-6 w-full break-words whitespace-pre-wrap overflow-visible'>
              {data[0].email_body || 'No email body content'}
            </p>
          </div>
          <ButtonLink
            className='mt-10 block text-center w-fit'
            href={data[0].job_url}
            variant='dark'
            size='sm'
          >
            Apply
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
