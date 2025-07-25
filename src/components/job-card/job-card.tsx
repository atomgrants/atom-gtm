'use client'


import { useEffect, useState } from 'react';
import ButtonLink from '@/components/links/ButtonLink';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

 const JobCard = ()=> {

 
  //fetch job data here
  return(

         // <div className='flex flex-row justify-center items-center mt-5'>
            <Card className='w-[340px] h-[300px] flex flex-col items-center justify-center overflow-y-auto'>
              <CardHeader>
                <Avatar className='mb-5'>
                  <AvatarImage src="/images/atom_logo.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>Director of Pre-Award Administration </CardTitle>
                <CardDescription className=''>Middlebury College</CardDescription>
                <CardDescription className=''> 5 days ago </CardDescription>
                <div>
                <ButtonLink className="mt-10 block text-center w-fit" href='' variant='dark' size='sm'>
                  Apply Now
                </ButtonLink>
                </div>
              </CardHeader>
            </Card>
          //</div>
  )

}

export default JobCard;