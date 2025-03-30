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
import { text } from "stream/consumers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

export default function Home() {
    const [mainFeedFilter, setMainFeedFilter] = useState<string>("none");
    const [filters, setFilters] = useState<string[]>([
        "none",
        "grayscale(100%)",
        "sepia(100%)",
        "brightness(150%) contrast(120%)",
        "sepia(50%) contrast(120%) brightness(90%) saturate(120%)",
        "invert(100%)",
        "contrast(110%) saturate(125%) hue-rotate(-5deg) brightness(105%)"
    ]);
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
    const [filmColor, setFilmColor] = useState("pink");
    const [customColor, setCustomColor] = useState("#ff0080");
    const [actualFilmColor, setActualFilmColor] = useState("");
    const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);
    const [textColor, setTextColor] = useState("white");
    const [textCustomColor, setTextCustomColor] = useState("");
    const [actualTextColor, setActualTextColor] = useState("");
    const [showCameraErrorDialog, setShowCameraErrorDialog] = useState(false);
    const [showCameraErrorDialogg, setShowCameraErrorDialogg] = useState(false);
    const [showCameraErrorDialoggg, setShowCameraErrorDialoggg] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

    useEffect(() => {
        async function getCameras() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === "videoinput");

                setDevices(videoDevices);

                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId);
                    startCamera(videoDevices[0].deviceId);
                }
            } catch (error) {
                console.error("Camera access denied:", error);
                setShowCameraErrorDialogg(true);
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

    const handleDragStart = (index: number) => {
        setDraggedPhotoIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedPhotoIndex === null) return;

        const updatedPhotos = [...photo];
        const [draggedPhoto] = updatedPhotos.splice(draggedPhotoIndex, 1);
        updatedPhotos.splice(index, 0, draggedPhoto);

        setPhoto(updatedPhotos);
        setDraggedPhotoIndex(null);
    };

    const handlePhotoUpload = (event: Event, index: number) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotos = [...photo];
                newPhotos[index] = reader.result as string;
                setPhoto(newPhotos);
            };
            reader.readAsDataURL(file);
        }
    };

    const startBurstMode = async () => {
        if (!stream || !videoRef.current?.srcObject) {
            setShowCameraErrorDialog(true);
            return
        }
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

        if (mainFeedFilter === "kodachrome") {
            ctx.filter = "contrast(110%) saturate(125%) hue-rotate(-5deg) brightness(105%)";
        } else if (mainFeedFilter === "vintage") {
            ctx.filter = "sepia(50%) contrast(120%) brightness(90%) saturate(120%)";
        } else if (mainFeedFilter === "b&w") {
            ctx.filter = "grayscale(100%) contrast(120%)";
        } else if (mainFeedFilter === "sepia") {
            ctx.filter = "sepia(100%)";
        } else if (mainFeedFilter === "vibrant") {
            ctx.filter = "contrast(150%) saturate(200%)";
        } else {
            ctx.filter = mainFeedFilter;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/png");
    };

    const handleReset = () => {
        setPhoto([]);
        setCountdown(null);
    };

    const renderText = (
        ctx: CanvasRenderingContext2D,
        textColor: string,
        textPadding: number,
        height: number,
        footerHeight: number,
        lineHeight: number
    ) => {
        ctx.fillStyle = textColor;
        const lineSpacing = 15

        ctx.font = "bold 28px Outfit";
        ctx.fillText(
            showMessage ? message : "",
            textPadding + 20,
            height - footerHeight / 2 - lineHeight * 2 - lineSpacing * 2
        );

        ctx.font = "bold 28px Outfit";
        ctx.fillText(
            showDate ? new Date().toLocaleDateString() : "",
            textPadding + 20,
            height - footerHeight / 2 - lineHeight - lineSpacing
        );

        ctx.font = "bold 20px Outfit";
        ctx.fillText(
            "00_ by shlynav.tiff",
            textPadding + 20,
            height - footerHeight / 1.8
        );
    };

    const saveFilmStrip = async () => {
        if (!photo.length) return (
            setShowCameraErrorDialoggg(true)
        );

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = 680;
        const height = 1800;
        const frameWidth = 600;
        const frameHeight = Math.floor(frameWidth * (9 / 16));
        const borderThickness = 2;
        const spacing = 35;
        const footerHeight = 130;

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

        renderText(ctx, textColor, 20, height, footerHeight, 20);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "film_strip.png";
        link.click();
    };

    return (
        <div className="">

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="w-[300px] p-6 bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle>Select a Slot</DialogTitle>
                        <DialogDescription>
                            Choose where to upload the image (0-3):
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {[0, 1, 2, 3].map((slot) => (
                            <Button
                                className="bg-[#151515] text-white hover:bg-white"
                                key={slot}
                                variant="outline"
                                onClick={() => {
                                    setSelectedSlotIndex(slot);
                                    setIsUploadDialogOpen(false);

                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => handlePhotoUpload(e, slot);
                                    input.click();
                                }}
                            >
                                Slot {slot}
                            </Button>
                        ))}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadDialogOpen(false)}
                            className="text-white bg-[#151515] hover:bg-white"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialoggg} onOpenChange={setShowCameraErrorDialoggg}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle className="">take photos first.</DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold">
                            take photos first to save film strip.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="text-white bg-[#151515] hover:bg-white"
                            onClick={() => setShowCameraErrorDialoggg(false)}>
                            sure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialogg} onOpenChange={setShowCameraErrorDialogg}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle className="">camera access required</DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold">
                            please allow camera permissions to use this app.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowCameraErrorDialog(false)}>
                            sure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialog} onOpenChange={setShowCameraErrorDialog}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle>camera access required</DialogTitle>
                        <DialogDescription>
                            please allow camera permissions to use this feature.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowCameraErrorDialog(false)}>
                            sure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div >
                <TSS />
            </div>

            <div className="flex flex-col items-center justify-center xl:grid xl:grid-cols-3 gap-4 xl:px-4 xl:w-full xl:max-w-[1200px] xl:mx-auto">
                <div className="w-full p-2 mx-auto max-w-[310px] flex flex-col items-center">
                    <div>
                        <p className="text-[14px]">current camera</p>
                        <Select onValueChange={handleCameraChange} value={selectedDeviceId ?? devices[0]?.deviceId} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Camera" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map(device => (
                                    device.deviceId && (
                                        <SelectItem key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Camera ${device.deviceId.slice(-4)}`}
                                        </SelectItem>
                                    )
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mt-2">
                        <p>live feed</p>
                        <div className="border-2 border-white rounded-[3px] w-[310px] h-[155px] xl:w-[405px] xl:h-[250px] relative">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" style={{
                                filter: mainFeedFilter === "kodachrome"
                                    ? "contrast(110%) saturate(125%) hue-rotate(-5deg) brightness(105%)"
                                    : mainFeedFilter === "vintage"
                                        ? "sepia(50%) contrast(120%) brightness(90%) saturate(120%)"
                                        : mainFeedFilter === "b&w"
                                            ? "grayscale(100%) contrast(120%)"
                                            : mainFeedFilter === "sepia"
                                                ? "sepia(100%)"
                                                : mainFeedFilter === "vibrant"
                                                    ? "contrast(150%) saturate(200%)"
                                                    : mainFeedFilter
                            }} />
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
                                <Textarea className="resize-none w-[170px] max-h-[50px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="message here" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-[14px]">camera filter</p>
                                <Select
                                    onValueChange={(value) => setMainFeedFilter(value)}
                                    value={mainFeedFilter}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="kodachrome">kodachrome 64</SelectItem>
                                        <SelectItem value="vintage">vintage</SelectItem>
                                        <SelectItem value="b&w">b&w</SelectItem>
                                        <SelectItem value="sepia">sepia</SelectItem>
                                        <SelectItem value="vibrant">vibrant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <div className="flex flex-row gap-4 items-center">
                                    <p className="text-[14px]">message color</p>
                                    {
                                        filmColor === "custom" && (
                                            <input
                                                type="color"
                                                value={textCustomColor}
                                                onChange={(e) => {
                                                    setTextCustomColor(e.target.value);
                                                    setActualTextColor(e.target.value);
                                                }}
                                                className="w-[50px] h-[30px] mt-2"
                                            />
                                        )
                                    }
                                </div>

                                <Select
                                    onValueChange={(value) => {
                                        if (value !== "custom") {
                                            setTextColor(value);
                                            setTextCustomColor(value);
                                        } else {
                                            setTextColor("custom");
                                        }
                                    }}
                                    value={textColor}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="white" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pink">pink</SelectItem>
                                        <SelectItem value="white">white</SelectItem>
                                        <SelectItem value="black">black</SelectItem>
                                        <SelectItem value="yellow">yellow</SelectItem>
                                        <SelectItem value="blue">blue</SelectItem>
                                        <SelectItem value="purple">purple</SelectItem>
                                        <SelectItem value="custom">custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <div className="flex flex-row gap-4 items-center">
                                    <p className="text-[14px]">film color</p>
                                    {
                                        filmColor === "custom" && (
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => {
                                                    setCustomColor(e.target.value);
                                                    setActualFilmColor(e.target.value);
                                                }}
                                                className="w-[50px] h-[30px] mt-2"
                                            />
                                        )
                                    }
                                </div>
                                <Select
                                    onValueChange={(value) => {
                                        if (value !== "custom") {
                                            setFilmColor(value);
                                            setCustomColor(value);
                                        } else {
                                            setFilmColor("custom");
                                        }
                                    }}
                                    value={filmColor}
                                >
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
                                        <SelectItem value="custom">custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="text-[14px]">stickers</p>
                                <Select disabled>
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

                                <Button
                                    className="border border-white w-[150px] h-[30px] flex items-center justify-center text-[12px] rounded-[3px] cursor-pointer"
                                    onClick={() => setIsUploadDialogOpen(true)}
                                >
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

                <div className="w-full  p-2 flex flex-col gap-4 items-center max-w-[215px] mx-auto">
                    <div className="flex self-start">
                        <p className="flex justify-start text-start">camera filters</p>
                    </div>

                    <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                        <video
                            ref={videoRef1}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: filters[6] }}
                        />
                        <div className="absolute top-12 right-8 w-full h-full flex items-center justify-center">
                            <p>kodachrome 64</p>
                        </div>
                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                        <video
                            ref={videoRef2}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: filters[1] }}
                        />
                        <div className="absolute top-12 right-18 w-full h-full flex items-center justify-center">
                            <p>b&w</p>
                        </div>
                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                        <video
                            ref={videoRef3}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: filters[2] }}
                        />
                        <div className="absolute top-12 right-17 w-full h-full flex items-center justify-center">
                            <p>sepia</p>
                        </div>
                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                        <video
                            ref={videoRef4}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: filters[3] }}
                        />
                        <div className="absolute top-12 right-17 w-full h-full flex items-center justify-center">
                            <p>bright</p>
                        </div>
                    </div>
                    <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                        <video
                            ref={videoRef5}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: filters[4] }}
                        />
                        <div className="absolute top-12 right-15 w-full h-full flex items-center justify-center">
                            <p>vintage</p>
                        </div>
                    </div>
                </div>

                <div className=" border-2 border-white w-[250px] h-[715px] p-4 mt-6 flex flex-col gap-4" style={{ backgroundColor: customColor }}>
                    <div className="border border-white w-full h-[140px] bg-white " draggable
                        onDragStart={() => handleDragStart(0)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(0)}>
                        <img src={photo[0] || undefined} className="  rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white w-full h-[140px] bg-white" draggable
                        onDragStart={() => handleDragStart(1)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(1)}>
                        <img src={photo[1] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white w-full h-[140px] bg-white" draggable
                        onDragStart={() => handleDragStart(2)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(2)}>
                        <img src={photo[2] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div className="border border-white w-full h-[140px] bg-white" draggable
                        onDragStart={() => handleDragStart(3)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(3)}>
                        <img src={photo[3] || undefined} className=" rounded w-full h-full object-cover" />
                    </div>
                    <div >
                        <div>
                            <p className="text-[12px] font-bold" style={{ color: textColor }}>
                                {showMessage ? message : ""}
                            </p>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold " style={{ color: textColor }}>
                                {showDate ? new Date().toLocaleDateString() : ""}
                            </p>
                        </div>
                        <div >
                            <p className="text-[8px] font-bold" style={{ color: textColor }}>
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
