'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import ButtonLink from '@/components/links/ButtonLink';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"





/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
        <header>
          <div className='relative flex flex-col mt-10 text-center'>
            Job Postings
          </div>
        </header>
      <section className='bg-white min-h-screen'>
          <div className='flex flex-row justify-center items-center mt-5'>
            <Card className='w-[360px] h-[310px] flex flex-col items-center justify-center overflow-y-auto'>
              <CardHeader>
                <Avatar className='mb-5'>
                  <AvatarImage src="https://github.com/evilrabbit.png" />
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
          </div>
      </section>
    </main>
  );
}
