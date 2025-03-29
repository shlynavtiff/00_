

import Tangina from '@/components/Tangina'
import TSS from '@/components/TSS'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div className="h-screen w-full p-2 flex flex-col justify-between">
      <div className=' '>
        <TSS />
      </div>
      <div className='items-center justify-center w-full h-full flex flex-col gap-4'>
        online photobooth by shlynav.tiff
        <Link href={"/snap"} ><Button className='border border-white cursor-pointer'>snap</Button></Link>
      </div>
      <div>
        <Tangina />
      </div>
    </div>
  )
}

export default page