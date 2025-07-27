'use client'



import ButtonLink from '@/components/links/ButtonLink';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface JobInfo {
  job_title: string,
  organization: string,
  url: string,
  time_posted: string
}

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

 const JobCard = ({job_title, organization, url, time_posted}: JobInfo) => {
  const pastDate: any = new Date(time_posted)
  const today: any = new Date()
  const diffMs: any = today - pastDate //difference in milliseconds
  const diffDays = Math.floor((diffMs) / (1000 * 60 * 60 * 24))

  // Format the time display
  const getTimeDisplay = () => {
    if (diffDays < 0) {
      return 'Recently posted'
    } else if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return '1 day ago'
    } else {
      return `${diffDays} days ago`
    }
  }

  //fetch job data here
  return(

         // <div className='flex flex-row justify-center items-center mt-5'>
            <Card className='w-[340px] h-[300px] flex flex-col items-center justify-center overflow-y-auto'>
              <CardHeader>
                <Avatar className='mb-5'>
                  <AvatarImage src="/images/atom_logo.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>{job_title}</CardTitle>
                <CardDescription>{organization}</CardDescription>
                <CardDescription>{getTimeDisplay()}</CardDescription>
                <div>
                <ButtonLink className="mt-10 block text-center w-fit" href= {url} variant='dark' size='sm'>
                  Apply Now
                </ButtonLink>
                </div>
              </CardHeader>
            </Card>
          //</div>
  )

}

export default JobCard;