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
import Tangina from "@/components/Tangina";
import TSS from "@/components/TSS";



export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const videoRef3 = useRef<HTMLVideoElement>(null);
    const videoRef4 = useRef<HTMLVideoElement>(null);
    const videoRef5 = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef(null);
    const [photo, setPhoto] = useState<string[]>([]);
    const [videoBlob, setVideoBlob] = useState(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [timer, setTimer] = useState(3);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [burstCount] = useState(4);
    const [showDate, setShowDate] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [filmColor, setFilmColor] = useState("");

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

    const startCamera = async (deviceId: string) => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        setStream(mediaStream);

        if (videoRef.current) videoRef.current.srcObject = stream;
        if (videoRef1.current) videoRef1.current.srcObject = stream;
        if (videoRef2.current) videoRef2.current.srcObject = stream;
        if (videoRef3.current) videoRef3.current.srcObject = stream;
        if (videoRef4.current) videoRef4.current.srcObject = stream;
        if (videoRef5.current) videoRef5.current.srcObject = stream;

    };

    const startBurstMode = async () => {
        let newPhotos = [];

        for (let i = 0; i < burstCount; i++) {
            let timeLeft = timer;
            setCountdown(timeLeft);

            await new Promise<void>((resolve) => {
                const countdownInterval = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);
                    if (timeLeft === 0) {
                        clearInterval(countdownInterval);
                        resolve();
                    }
                }, 1000);
            });

            const photoData = capturePhoto();
            if (photoData) {
                newPhotos.push(photoData);
                setPhoto((prevPhotos) => [...prevPhotos, photoData]);
            }
            setCountdown(null);
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

    const handleReset = () => {
        setPhoto([]);
        setCountdown(null);
    };

    const saveFilmStrip = async () => {
        if (!photo.length) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = 370;
        const height = 980;
        const frameWidth = 335;
        const frameHeight = Math.floor(frameWidth * (9 / 16));
        const borderThickness = 2;
        const spacing = 15;
        const footerHeight = 20;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = filmColor;
        ctx.fillRect(0, 0, width, height);

        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.crossOrigin = "anonymous";
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        };

        for (let i = 0; i < photo.length; i++) {
            try {
                const img = await loadImage(photo[i]);
                const yPosition = spacing + i * (frameHeight + spacing);

                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.fillRect((width - frameWidth) / 2, yPosition, frameWidth, frameHeight);

                const cropHeight = img.width * (9 / 16);
                const cropX = 0;
                const cropY = (img.height - cropHeight) / 2;

                ctx.drawImage(
                    img,
                    cropX, cropY, img.width, cropHeight,
                    (width - frameWidth) / 2 + borderThickness, yPosition + borderThickness,
                    frameWidth - 2 * borderThickness, frameHeight - 2 * borderThickness
                );
            } catch (error) {
                console.error("Error loading image:", error);
            }
        }

        ctx.fillStyle = "white";
        ctx.font = "12px Outfit";
        ctx.textAlign = "left";
        const textPadding = 20;
        ctx.fillText("00_ by shlynav.tiff", textPadding, height - footerHeight / 2);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "film_strip.png";
        link.click();
    };

    return (
        <div className="">

            <div >
                <TSS />
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

                    <div className="mt-2">
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

                        <Button className="items-center text-center justify-center mt-[25px] text-[12px]" onClick={handleReset}>
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
                                <Textarea className="resize-none w-[170px] max-h-[50px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="hehe" />
                            </div>

                            <div>
                                <p className="text-[14px]"> film color</p>
                                <Select onValueChange={setFilmColor} value={filmColor}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="pink" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pink">pink</SelectItem>
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

                        <div className="flex flex-col gap-[15px] mt-6">

                            <div className="items-center justify-start flex flex-row gap-4">
                                <Switch checked={showDate} onCheckedChange={setShowDate} />
                                date
                            </div>
                            <div className="items-center  justify-start flex flex-row gap-4">
                                <Switch checked={showMessage} onCheckedChange={setShowMessage} />
                                <p className="text-[14px]">message</p>
                            </div>
                            <div className="items-center justify-start flex flex-col gap-4">
                                <Button className="border border-white w-[150px] h-[30px] flex items-center justify-center text-[12px] rounded-[3px]">
                                    upload image
                                </Button>

                                <Button className="border border-white w-[150px] h-[30px] flex items-center justify-center text-[12px] rounded-[3px] cursor-pointer" onClick={saveFilmStrip}>
                                    download film
                                </Button>

                                <Button className="border border-white w-[150px] h-[30px] flex items-center justify-center text-[12px] rounded-[3px]">
                                    download video
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full  p-2 flex flex-col gap-4 items-center max-w-[170px] mx-auto">
                    <div className="flex self-start">
                        <p className="flex justify-start text-start">camera filters</p>
                    </div>

                    <div className="border-2 border-white rounded-[3px] w-[160px] h-[100px]">
                        <video ref={videoRef1} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-[3px]w-[160px] h-[100px]]">
                        <video ref={videoRef2} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[160px] h-[100px]">
                        <video ref={videoRef3} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-[3px] w-[160px] h-[100px]">
                        <video ref={videoRef4} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="border-2 border-white rounded-[3px] w-[160px] h-[100px]">
                        <video ref={videoRef5} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className=" border-2 border-white w-[250px] h-[715px] p-4 flex flex-col gap-4" style={{ backgroundColor: filmColor }}>
                    <div className="border border-white rounded-[2px] w-full h-[140px] bg-white">
                        <img src={photo[0] || undefined} className="  rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white rounded-[2px] w-full h-[140px] bg-white">
                        <img src={photo[1] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white rounded-[2px] w-full h-[140px] bg-white">
                        <img src={photo[2] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white rounded-[2px] w-full h-[140px] bg-white">
                        <img src={photo[3] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div >
                        <div>
                            <p className="text-[10px] ">
                                {showMessage ? message : ""}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] ">
                                {showDate ? new Date().toLocaleDateString() : ""}
                            </p>
                        </div>
                        <div>
                            <p className="text-[8px] ">
                                00_ by shlynav.tiff
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div >
                <Tangina />
            </div>

        </div>
    );
}
