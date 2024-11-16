"use client"

import React, { useState } from 'react'

import SetupPage1 from '@/components/Setup/setupPage1';

const Setup = () => {
    const [setupPageNum, setSetupPageNum] = useState(0);

  return (
    <div className='p-4 flex justify-center items-center min-h-screen'>
      <SetupPage1 />
    </div>
  )
}

export default Setup