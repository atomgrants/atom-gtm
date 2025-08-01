'use client';

import { useState } from "react"

import { getJobFromDb } from "@/lib/utils";

export default function SearchJob(){
  const [jobsToShow, setJobsToShow] = useState<any[]>([])

  const jobs = getJobFromDb()
  const mockResults = ['apple', 'banana', 'orange', 'grape', 'mango'];


  return(
    <div>
      <input 
      type='text' 
      placeholder="search job" 
    />
      <ul className="absolute z-10 mt-1 w-full rounded bg-white border border-gray-200 shadow">
        {mockResults.map((item, index) => (
          <li
            key={item}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}