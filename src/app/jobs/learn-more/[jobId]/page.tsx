import { supabaseClient } from '@/lib/client';

import ButtonLink from '@/components/links/ButtonLink';
import { MessageMarkdown } from '@/components/messageMarkdown';

export default async function LearnMorePage({
  params,
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
    <div className='flex justify-center py-4 px-4 sm:py-6'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <section className='flex flex-col items-center w-full h-full'>
          <div className='min-h-[400px] sm:h-[700px] w-full border border-gray-200 rounded-lg shadow-sm bg-white p-4 sm:p-6 overflow-auto'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
              <div className='flex-1 min-w-0'>
                <MessageMarkdown>
                  {data[0].job_title || 'No title'}
                </MessageMarkdown>
              </div>
              <ButtonLink
                className='w-full sm:w-auto shrink-0'
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
            <h4 className='font-light tracking-normal text-slate-700 mx-auto my-4 sm:my-6 w-full text-sm'>
              <span className='font-semibold tracking-normal text-slate-8 text-base sm:text-lg'>
                From:
              </span>{' '}
              {data[0].sender_name.slice(6) || 'No sender'}
            </h4>
            <MessageMarkdown>---</MessageMarkdown>
            <div className='prose prose-sm sm:prose max-w-none'>
              <MessageMarkdown>
                {data[0].email_body || 'No body'}
              </MessageMarkdown>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
