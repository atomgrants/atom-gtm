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
      <section className='bg-white'>
        <header>
          <div className='layout relative flex flex-col  justify-center py-12 text-center'>
            Job Postings
          </div>
          <div>
            <Card className='w-full max-w-sm relative flex flex-col items-center'>
              <CardHeader>
                <Avatar className='mb-5'>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle>Director of Pre-Award Administration </CardTitle>
                <CardDescription>Middlebury College</CardDescription>
                <ButtonLink className='mt-10' href='' variant='light'>
                  Apply externaly
                </ButtonLink>
              </CardHeader>
              <CardContent>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>
          </div>
        </header>
      </section>
    </main>
  );
}
