"use client"

import React, { useState } from 'react'

import SetupPage1 from '@/components/Setup/setupPage1';
import SetupPage2 from '@/components/Setup/setupPage2';
import SetupPage3 from '@/components/Setup/setupPage3';

const Setup = () => {
    const [setupPageNum, setSetupPageNum] = useState(0);

  return (
    <div className='p-4 flex justify-center items-center min-h-screen'>
      {
        setupPageNum === 0 ? 
            <SetupPage1 setSetupPageNum={setSetupPageNum} />
        :   
            setupPageNum === 1 ? 
                <SetupPage2 setSetupPageNum={setSetupPageNum} />
            :
                setupPageNum === 2 ? 
                    <SetupPage3 setSetupPageNum={setSetupPageNum} />
                :  ""
      }
    </div>
  )
}

export default Setup