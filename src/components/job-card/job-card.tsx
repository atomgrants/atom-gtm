'use client';

import ButtonLink from '@/components/links/ButtonLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { JobInfo } from '@/types/job';

const JobCard = ({
  job_title,
  organization,
  url,
  time_posted,
  jobId,
  organization_domain,
}: JobInfo) => {
  const pastDate = new Date(time_posted);
  const today = new Date();
  const diffMs = today.getTime() - pastDate.getTime(); //difference in milliseconds
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const logoUrl = `https://www.google.com/s2/favicons?domain=${organization_domain}&sz=128`;

  // Format the time display
  const getTimeDisplay = () => {
    if (diffDays < 0) {
      return 'Recently posted';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else {
      return `${diffDays} days ago`;
    }
  };

  //fetch job data here
  return (
    <Card className='w-[340px] h-[300px] flex flex-col items-center justify-center overflow-hidden'>
      <CardHeader className='w-full'>
        <Avatar className='mb-5'>
          <AvatarImage src={logoUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle className='line-clamp-1 w-full'>{job_title}</CardTitle>
        <CardDescription className='line-clamp-1 w-full'>
          {organization}
        </CardDescription>
        <CardDescription>{getTimeDisplay()}</CardDescription>
        <div className='flex items-start gap-2'>
          <ButtonLink
            className='mt-10 block text-center'
            href={url}
            variant='dark'
            size='sm'
          >
            Apply Now
          </ButtonLink>
          <ButtonLink
            className='mt-10 block text-center'
            href={`/jobs/learn-more/${jobId}`}
            variant='light'
            size='sm'
          >
            Learn More
          </ButtonLink>
        </div>
      </CardHeader>
    </Card>
  );
};

export default JobCard;
