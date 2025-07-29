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

const JobCard = ({ job_title, organization, url, time_posted }: JobInfo) => {
  const pastDate: any = new Date(time_posted);
  const today: any = new Date();
  const diffMs: any = today - pastDate; //difference in milliseconds
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

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
    // <div className='flex flex-row justify-center items-center mt-5'>
    <Card className='w-[340px] h-[300px] flex flex-col items-center justify-center overflow-hidden'>
      <CardHeader>
        <Avatar className='mb-5'>
          <AvatarImage src='/images/atom_logo.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle className='line-clamp-1'>{job_title}</CardTitle>
        {/*<CardTitle className='line-clamp-2  min-h-[40px]'>{job_title}</CardTitle>*/}
        <CardDescription>{organization}</CardDescription>
        <CardDescription>{getTimeDisplay()}</CardDescription>
        <div>
          <ButtonLink
            className='mt-10 block text-center w-fit'
            href={url}
            variant='dark'
            size='sm'
          >
            Apply Now
          </ButtonLink>
        </div>
      </CardHeader>
    </Card>
    //</div>
  );
};

export default JobCard;
