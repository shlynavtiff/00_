import Tangina from '@/components/Tangina'
import TSS from '@/components/TSS'
import React from 'react'

const page = () => {
    return (
        <div className="h-screen w-full p-2 flex flex-col justify-between">
            <div>
                <TSS />
            </div>

            <div className='flex flex-col items-center justify-center max-w-[1000px] mx-auto text-center gap-4 text-lg sm:text-2xl px-4'>

                <p>
                    welcome to <strong>00_</strong>  – a fun, easy, and instant way to capture moments.
                    whether you&apos;re taking selfies, group shots, or adding creative touches,  <strong>00_</strong> makes
                    it simple to snap, customize, and download your photos in just a few clicks.
                </p>
                <p>
                    No images are stored or saved when you use <strong>00_.</strong> Once you take a photo and download it,
                    it’s gone from our system – giving you full control over your pictures.
                    capture the moment, cherish it, and move on. no traces, no worries – just pure, in-the-moment memories.
                </p>
                <p className='text-sm'>a side project of shlynav.tiff</p>
            </div>

            <div>
                <Tangina />
            </div>
        </div>
    )
}

export default page