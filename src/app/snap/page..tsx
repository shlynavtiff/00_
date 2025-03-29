'use client";'

import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"


export default function Home() {
    return (
        <div className="">

            <div className="flex flex-row justify-between items-center  p-10">
                <div className="text-2xl">
                    00_
                </div>

                <div className="flex flex-row gap-4 text-large">
                    <div>
                        home
                    </div>
                    <div>
                        about
                    </div>
                    <div>
                        snap
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-3 gap-4 p-4 w-full max-w-[1200px] mx-auto">

                <div className="w-full p-2">

                    <div>
                        <p className="text-[14px]">current camera</p>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <p>live feed</p>
                        <div className="border-2 border-white rounded-[3px] w-[405px] h-[250px]">

                        </div>
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <div className="mt-[8px]">
                            <p className="text-[14px]">timer</p>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="timer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">3 seconds</SelectItem>
                                    <SelectItem value="dark">5 seconds</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="items-center text-center justify-center mt-[25px]">
                            reset
                        </Button>

                        <div className="mt-[10px]">
                            <p className="text-[10px]">*snap is continous</p>
                            <Button className="border-2 border-white rounded-sm w-[130px] h-[35px] text-center justify-center items-center">
                                snap
                            </Button>
                        </div>
                    </div>


                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="mt-[8px]">
                                <p className="text-[14px]">add message</p>
                                <Textarea disabled className="resize-none w-[170px] max-h-[50px]" />
                            </div>

                            <div>
                                <p className="text-[14px]"> film color</p>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="pink" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pinl">pink</SelectItem>
                                        <SelectItem value="white">white</SelectItem>
                                        <SelectItem value="black">black</SelectItem>
                                        <SelectItem value="yellow">yellow</SelectItem>
                                        <SelectItem value="blue">blue</SelectItem>
                                        <SelectItem value="purple">purple</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="text-[14px]">stickers</p>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="girly" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mofusand">mofusand</SelectItem>
                                        <SelectItem value="snoppy">snoopy</SelectItem>
                                        <SelectItem value="girly">girly</SelectItem>
                                        <SelectItem value="shin chan">shin chan</SelectItem>
                                        <SelectItem value="miffy">miffy</SelectItem>
                                        <SelectItem value="butterfly">butterfly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-6">

                            <div className="items-center justify-start flex flex-row gap-4">
                                <Switch />
                                <p className="text-[14px]">date</p>
                            </div>
                            <div className="items-center  justify-start flex flex-row gap-4">
                                <Switch />
                                <p className="text-[14px]">message</p>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="w-full  p-2 flex flex-col gap-4 items-center max-w-[150px] mx-auto">
                    <div className="flex self-start">
                        <p className="flex justify-start text-start">camera filters</p>
                    </div>

                    <div className="border-2 border-white rounded-[3px] w-[140px] h-[90px]">

                    </div>
                    <div className="border-2 border-white rounded-[3px] w-[140px] h-[90px]">

                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[140px] h-[90px]">

                    </div>
                    <div className="border-2 border-white rounded-[3px] w-[140px] h-[90px]">

                    </div>

                </div>

                <div className=" border-2 border-white w-[250px] h-[715px] p-4 flex flex-col gap-4">
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">

                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">

                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">

                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">

                    </div>
                    <div>
                        <p className="text-[10px] ">
                            message shits
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] ">
                            date
                        </p>
                    </div>
                    <div>
                        <p className="text-[8px] ">
                            00_ by shlynav.tiff
                        </p>
                    </div>
                </div>

            </div>




            <div className="p-10 text-[14px]">
                © 2025 shlynav.tiff
            </div>

        </div>
    );
}
