import { supabaseClient } from '@/lib/client';

import ButtonLink from '@/components/links/ButtonLink';
import { MessageMarkdown } from '@/components/messageMarkdown';

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
    <div className='flex justify-center py-6'>
      <div className='flex flex-col items-center w-[600px] max-h-[80vh]'>
        <section className='flex flex-col items-center w-full h-full'>
          <div className='h-[700px] w-full border border-gray-200 rounded-lg shadow-sm bg-white p-6 overflow-auto'>
            <div className='flex flex-row justify-between items-center'>
              <MessageMarkdown>
                {data[0].job_title || 'No title'}
              </MessageMarkdown>
              <ButtonLink
                className=''
                href={data[0].job_url}
                variant='dark'
                size='sm'
              >
                Apply
              </ButtonLink>
            </div>
            <MessageMarkdown>
              {data[0].organization || 'No sender name'}
            </MessageMarkdown>
            <h4 className='font-light tracking-normal text-slate-700 mx-auto my-6 w-full text-sm'>
              <span className='font-semibold tracking-normal text-slate-8 text-l'>
                From:
              </span>{' '}
              {data[0].sender_name.slice(6) || 'No sender'}
            </h4>
            <MessageMarkdown>---</MessageMarkdown>
            <MessageMarkdown>{data[0].email_body || 'No body'}</MessageMarkdown>
          </div>
        </section>
      </div>
    </div>
  );
}
