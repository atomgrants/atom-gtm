import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { supabaseClient } from './client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//get job from jobs table
export const getJobFromDb = async () => {
  const { data, error } = await supabaseClient.from('jobs').select('*');
  if (error) {
    console.error('Error fetching jobs:', error);
    return {
      success: false,
      message: 'Failed fetching job',
      status: 500,
    };
  }
  return data;
};
