'use client'
import { useEffect, useRef, useState } from "react";
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef(null);
    const [photo, setPhoto] = useState([]);
    const [videoBlob, setVideoBlob] = useState(null);
    const [stream, setStream] = useState(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [timer, setTimer] = useState(3);
    const [countdown, setCountdown] = useState(null);
    const [burstCount] = useState(4);

    useEffect(() => {
        async function getCameras() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
                startCamera(videoDevices[0].deviceId);
            }
        }
        getCameras();
    }, []);

    const startCamera = async (deviceId: any) => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
    };

    const startBurstMode = async () => {
        let newPhotos = [];

        for (let i = 0; i < burstCount; i++) {
            let timeLeft = timer;
            setCountdown(timeLeft);

            await new Promise(resolve => {
                const countdownInterval = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);
                    if (timeLeft === 0) {
                        clearInterval(countdownInterval);
                        resolve();
                    }
                }, 1000);
            });

            // Capture and store image
            const photoData = capturePhoto();
            if (photoData) {
                newPhotos.push(photoData);
                setPhoto(prevPhotos => [...prevPhotos, photoData]);
            }

            setCountdown(null); // Reset countdown
        }
    };
    const handleCameraChange = (deviceId: any) => {
        setSelectedDeviceId(deviceId);
        startCamera(deviceId);
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return null;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/png");
    };

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
                        <Select onValueChange={handleCameraChange} value={selectedDeviceId || undefined} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map(device => (
                                    <SelectItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId.slice(-4)}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <p>live feed</p>
                        <div className="border-2 border-white rounded-[3px] w-[405px] h-[250px] relative">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            {countdown !== null && (
                                <div className=" absolute top-30 left-50 ">
                                    {countdown}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <div className="mt-[8px]">
                            <p className="text-[14px]">timer</p>
                            <Select onValueChange={(value) => setTimer(parseInt(value))} value={timer.toString()}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="timer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">3 seconds</SelectItem>
                                    <SelectItem value="5">5 seconds</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="items-center text-center justify-center mt-[25px] text-[12px">
                            reset
                        </Button>

                        <div className="mt-[10px]">
                            <p className="text-[10px]">*snap is continous</p>
                            <Button className="border-2 border-white rounded-sm w-[130px] h-[35px] text-center justify-center items-center" onClick={startBurstMode}>
                                snap
                            </Button>
                            <canvas ref={canvasRef} style={{ display: "none" }} />
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
                        <img src={photo[0] || undefined} alt="snap 1" className="  rounded w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">
                        <img src={photo[1] || undefined} alt="snap 2" className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">
                        <img src={photo[2] || undefined} alt="snap 3" className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-sm w-full h-[140px] ">
                        <img src={photo[3] || undefined} alt="snap 4" className=" rounded w-full h-full object-cover" />
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
