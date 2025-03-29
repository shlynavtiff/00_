import Link from 'next/link'
import React from 'react'

const TSS = () => {
    return (
        <div className="flex flex-row justify-between items-center  p-6">
            <Link href={"/"} >
                <div className="text-2xl">
                    00_
                </div>
            </Link>


            <div className="flex flex-row gap-4 text-[14px]">
                <Link href={"/"}>
                    <div >
                        home
                    </div>
                </Link>

                <Link href={"/about"}>
                    <div>
                        about
                    </div>
                </Link>

                <Link href={"/snap"}>
                    <div>
                        snap
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default TSS