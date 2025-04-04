'use client'
import { useEffect, useRef, useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image";
import { GripVertical } from "lucide-react";


export default function Home() {
    const [mainFeedFilter, setMainFeedFilter] = useState<string>("none");
    const [filters] = useState<string[]>([
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
    const [photo, setPhoto] = useState([
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
        "/placeholder.jpg",
    ]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [timer, setTimer] = useState(3);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [burstCount] = useState(4);
    const [showDate, setShowDate] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");

    const [showCameraErrorDialog, setShowCameraErrorDialog] = useState(false);
    const [showCameraErrorDialogg, setShowCameraErrorDialogg] = useState(false);
    const [showCameraErrorDialoggg, setShowCameraErrorDialoggg] = useState(false);
    const [showCameraErrorDialogggg, setShowCameraErrorDialogggg] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const [filmColor, setFilmColor] = useState("pink");
    const [customColor, setCustomColor] = useState("#ff0080");
    const [actualFilmColor, setActualFilmColor] = useState("");

    const [textColor, setTextColor] = useState("white");
    const [customTextColor, setCustomTextColor] = useState("");

    const [gradientStart, setGradientStart] = useState("#ff0000");
    const [gradientEnd, setGradientEnd] = useState("#0000ff");
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);


    type StickerType = "snoopy" | "miffy" | "";
    type LayoutType = "vertical" | "horizontal" | "grid-vertical" | "grid-horizontal";

    const [selectedSticker, setSelectedSticker] = useState<StickerType>("");
    const [layout, setLayout] = useState<LayoutType>("vertical");


    const stickerImages: Record<Exclude<StickerType, "">, Record<LayoutType, string>> = {
        snoopy: {
            vertical: "/snoopy/snoopyDisplayVertical.png",
            horizontal: "/snoopy/snoopyDisplayHorizontal.png",
            "grid-vertical": "/snoopy/snoopyDisplayGridVertical.png",
            "grid-horizontal": "/snoopy/snoopyDisplayGridHorizontal.png",
        },
        miffy: {
            vertical: "/miffy/miffyDisplayVertical.png",
            horizontal: "/miffy/miffyDisplayHorizontal.png",
            "grid-vertical": "/miffy/miffyDisplayGridVertical.png",
            "grid-horizontal": "/miffy/miffyDisplayGridHorizontal.png",
        }
    };

    const highResStickerImages: Record<Exclude<StickerType, "">, Record<LayoutType, string>> = {
        snoopy: {
            vertical: "/snoopy/renderSnoopyVertical.png",
            horizontal: "/snoopy/renderSnoopyHorizontal.png",
            "grid-vertical": "/snoopy/renderSnoopyGridVertical.png",
            "grid-horizontal": "/snoopy/renderSnoopyGridHorizontal.png",
        },
        miffy: {
            vertical: "/miffy/miffyRenderVertical.png",
            horizontal: "/miffy/miffyRenderHorizontal.png",
            "grid-vertical": "/miffy/miffyRenderGridVertical.png",
            "grid-horizontal": "/miffy/miffyRenderGridHorizontal.png",
        }
    };


    useEffect(() => {
        async function getCameras() {
            try {
                const permission = await navigator.permissions.query({ name: "camera" as PermissionName });

                if (permission.state === "denied") {
                    setShowCameraErrorDialogg(true);
                    return;
                }
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
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
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } }
            });

            setStream(mediaStream);

            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            if (videoRef1.current) videoRef1.current.srcObject = mediaStream;
            if (videoRef2.current) videoRef2.current.srcObject = mediaStream;
            if (videoRef3.current) videoRef3.current.srcObject = mediaStream;
            if (videoRef4.current) videoRef4.current.srcObject = mediaStream;
            if (videoRef5.current) videoRef5.current.srcObject = mediaStream;
        } catch (error) {
            console.error("Error accessing camera:", error);
            setShowCameraErrorDialogg(true);
        }
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData("photoIndex", index.toString());
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        const draggedIndex = parseInt(event.dataTransfer.getData("photoIndex"), 10);

        if (draggedIndex === index || isNaN(draggedIndex)) return;

        const updatedPhotos = [...photo];
        const [draggedPhoto] = updatedPhotos.splice(draggedIndex, 1);
        updatedPhotos.splice(index, 0, draggedPhoto);

        setPhoto(updatedPhotos);
    };

    const handleTouchStart = (index: number) => {
        setTouchStartIndex(index);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleTouchEnd = (index: number) => {
        if (touchStartIndex !== null && touchStartIndex !== index) {
            const simulatedEvent = {
                preventDefault: () => { },
                dataTransfer: {
                    getData: () => touchStartIndex!.toString(),
                },
            } as unknown as React.DragEvent<HTMLDivElement>;
            handleDrop(simulatedEvent, index);
        }
        setTouchStartIndex(null);
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
            return;
        }

        for (let i = 0; i < burstCount; i++) {
            let timeLeft = timer;
            setCountdown(timeLeft);

            await new Promise<void>((resolve) => {
                countdownIntervalRef.current = setInterval(() => {
                    timeLeft -= 1;
                    setCountdown(timeLeft);

                    if (timeLeft === 0) {
                        clearInterval(countdownIntervalRef.current!);
                        resolve();
                    }
                }, 1000);
            });

            const photoData = capturePhoto();
            if (photoData) {
                setPhoto((prevPhotos) => {
                    const updatedPhotos = [...prevPhotos];
                    const placeholderIndex = updatedPhotos.findIndex((src) => src === "/placeholder.jpg");
                    if (placeholderIndex !== -1) {
                        updatedPhotos[placeholderIndex] = photoData;
                    } else if (updatedPhotos.length < 4) {
                        updatedPhotos.push(photoData);
                    }

                    return updatedPhotos.slice(0, 4);
                });
            }

            setCountdown(null);
        }
    };

    const handleCameraChange = (deviceId: string) => {
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

        ctx.save();

        if (isFlipped) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

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
        ctx.restore();
        return canvas.toDataURL("image/png");
    };

    const handleReset = () => {
        setPhoto((prevPhotos) =>
            prevPhotos.map((src) => (src === "/placeholder.jpg" ? src : "/placeholder.jpg"))
        );
        setCountdown(null);

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
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

    const saveFilmStrip = async (): Promise<void> => {
        const validPhotos: string[] = photo.filter((src) => src !== "/placeholder.jpg");

        if (validPhotos.length !== 4) {
            setShowCameraErrorDialoggg(true);
            return;
        }

        type LayoutConfig = {
            width: number;
            height: number;
            frameWidth: number;
            frameHeight: number;
            middleSpacing?: number;
        };

        const layoutConfig: Record<string, LayoutConfig> = {
            vertical: { width: 680, height: 1800, frameWidth: 600, frameHeight: 337.5 },
            horizontal: { width: 1800, height: 680, frameWidth: 337.5, frameHeight: 600 },
            "grid-horizontal": {
                width: 1700,
                height: 1050,
                frameWidth: 684,
                frameHeight: 450,
                middleSpacing: 40
            },
            "grid-vertical": {
                width: 1050,
                height: 1700,
                frameWidth: 450,
                frameHeight: 684,
                middleSpacing: 40
            },
        };

        const { width, height, frameWidth, frameHeight, middleSpacing = 40 } = layoutConfig[layout] ?? layoutConfig["vertical"];
        const borderThickness: number = 2;
        const spacing: number = 50;
        const footerHeight: number = 150;

        const canvas: HTMLCanvasElement = document.createElement("canvas");
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = width;
        canvas.height = height;

        let backgroundFillColor: string | CanvasGradient;
        if (filmColor === "gradient") {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, gradientStart);
            gradient.addColorStop(1, gradientEnd);
            backgroundFillColor = gradient;
        } else {
            backgroundFillColor = filmColor === "custom" ? actualFilmColor : filmColor;
        }

        ctx.fillStyle = backgroundFillColor;
        ctx.fillRect(0, 0, width, height);

        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.crossOrigin = "anonymous";
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            });
        };

        for (let i = 0; i < validPhotos.length; i++) {
            try {
                const img: HTMLImageElement = await loadImage(validPhotos[i]);
                let xPosition: number = (width - frameWidth) / 2;
                let yPosition: number = spacing + i * (frameHeight + spacing);

                if (layout === "horizontal") {
                    xPosition = spacing + i * (frameWidth + spacing);
                    yPosition = (height - frameHeight) / 2;
                } else if (layout === "grid-vertical") {
                    if (i % 2 === 0) {
                        xPosition = spacing;
                    } else {
                        xPosition = width / 2 + middleSpacing / 2;
                    }
                    yPosition = Math.floor(i / 2) * (frameHeight + spacing) + spacing;
                } else if (layout === "grid-horizontal") {
                    xPosition = Math.floor(i / 2) * (frameWidth + spacing) + spacing;
                    if (i % 2 === 0) {
                        yPosition = spacing;
                    } else {
                        yPosition = height / 2 + middleSpacing / 2;
                    }
                }

                ctx.fillStyle = "white";
                ctx.fillRect(xPosition, yPosition, frameWidth, frameHeight);

                const targetAspect = frameWidth / frameHeight;
                const imgAspect = img.width / img.height;
                let cropWidth, cropHeight, cropX, cropY;

                if (imgAspect > targetAspect) {
                    cropWidth = img.height * targetAspect;
                    cropHeight = img.height;
                    cropX = (img.width - cropWidth) / 2;
                    cropY = 0;
                } else {
                    cropHeight = img.width / targetAspect;
                    cropWidth = img.width;
                    cropX = 0;
                    cropY = (img.height - cropHeight) / 2;
                }

                ctx.drawImage(
                    img,
                    cropX, cropY, cropWidth, cropHeight,
                    xPosition + borderThickness, yPosition + borderThickness,
                    frameWidth - 2 * borderThickness,
                    frameHeight - 2 * borderThickness
                );
            } catch (error) {
                console.error("Error loading image:", error);
                return;
            }
        }



        // Inside saveFilmStrip function
        if (selectedSticker && selectedSticker in highResStickerImages) {
            try {
                // Get the high-resolution sticker path for the current layout
                const highResPath = highResStickerImages[selectedSticker as Exclude<StickerType, "">][layout];

                // Make sure we have a valid path
                if (highResPath) {
                    const overlayImg = await loadImage(highResPath);

                    // Apply overlay based on layout
                    ctx.globalAlpha = 1.0;
                    ctx.drawImage(overlayImg, 0, 0, width, height);
                }
            } catch (error) {
                console.error("Error loading overlay image:", error);
            }
        }
        const textFillColor: string = textColor === "custom" ? customTextColor : textColor;

        if (layout === "horizontal") {
            renderText(ctx, textFillColor, width - 250, height - 565 / 2, 0, 20);
        } else if (layout === "grid-horizontal") {
            renderText(ctx, textFillColor, width - 235, height - 965 / 2, 0, 20);
        } else {
            renderText(ctx, textFillColor, 20, height, footerHeight, 20);
        }

        const link: HTMLAnchorElement = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "film_strip.png";
        link.click();
    };


    const toggleFlip = () => {
        setIsFlipped((prev) => !prev);
    };


    return (
        <div className="">

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="w-[300px] p-6 bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle>select a slot.</DialogTitle>
                        <DialogDescription>
                            choose where to upload the image (1-4).
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {[1, 2, 3, 4].map((slot) => (
                            <Button
                                className="bg-[#151515] text-white hover:bg-white"
                                key={slot}
                                variant="outline"
                                onClick={() => {
                                    const zeroBasedIndex = slot - 1;
                                    setIsUploadDialogOpen(false);

                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => handlePhotoUpload(e, zeroBasedIndex);
                                    input.click();
                                }}
                            >
                                slot {slot}
                            </Button>
                        ))}
                    </div>



                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadDialogOpen(false)}
                            className="text-white bg-[#151515] hover:bg-white"
                        >
                            cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialogggg} onOpenChange={setShowCameraErrorDialogggg}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle className="">function currently not available.</DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold">
                            finna do this pag sinipag :v.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="text-white bg-[#151515] hover:bg-white"
                            onClick={() => setShowCameraErrorDialogggg(false)}>
                            ozge
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialoggg} onOpenChange={setShowCameraErrorDialoggg}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle className="">take 4 photos first.</DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold">
                            take 4 photos first to save film strip.
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
                        <DialogTitle className="">camera access required.</DialogTitle>
                        <DialogDescription className="text-[14px] font-semibold">
                            please allow camera permissions to use 00_.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="text-white bg-[#151515] hover:bg-white"
                            onClick={() => setShowCameraErrorDialogg(false)}>
                            sure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCameraErrorDialog} onOpenChange={setShowCameraErrorDialog}>
                <DialogContent className="w-[350px] h-[170px] bg-[#151515]">
                    <DialogHeader>
                        <DialogTitle>camera access required.</DialogTitle>
                        <DialogDescription>
                            please allow camera permissions to take snaps.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="text-white bg-[#151515] hover:bg-white"
                            onClick={() => setShowCameraErrorDialog(false)}>
                            sure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div >
                <TSS />
            </div>

            <div className="flex flex-col gap-4 px-4  max-w-[1200px] mx-auto">
                <div className="flex flex-col sm:flex-row">
                    <div className=" p-2 mx-auto justify-center max-w-[310px] xl:max-w-full flex flex-col ">
                        <div className="flex flex-row gap-4  justify-between items-end">
                            <div>
                                <p className="text-[14px]">current camera</p>
                                <Select onValueChange={handleCameraChange} value={selectedDeviceId ?? devices[0]?.deviceId} >
                                    <SelectTrigger className="w-[180px] cursor-pointer">
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

                            <Button variant="outline" onClick={toggleFlip} className="text-white bg-[#151515] hover:bg-white cursor-pointer">
                                {isFlipped ? "Unflip Camera" : "Flip Camera"}
                            </Button>
                        </div>

                        <div className="mt-2">
                            <p>live feed</p>
                            <div className="border-2 border-white rounded-[3px] w-[295px] h-[155px] xl:w-[405px] xl:h-[250px] relative">
                                <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""} style={{
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
                            }}`} />
                                {countdown !== null && (
                                    <div className="
                                 absolute 
                                 text-white text-2xl font-bold 
                                 inset-0 flex items-center justify-center 
                             ">
                                        {countdown}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row gap-4 items-center xl:items-start">
                            <div className="mt-[8px] w-full">
                                <p className="text-[14px]">timer</p>
                                <Select onValueChange={(value) => setTimer(parseInt(value))} value={timer.toString()}>
                                    <SelectTrigger className="w-[118px] xl:w-full">
                                        <SelectValue placeholder="timer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 seconds</SelectItem>
                                        <SelectItem value="5">5 seconds</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>



                            <Button variant='outline' className="text-white bg-[#151515] hover:bg-white cursor-pointer items-center text-center justify-center mt-[30px] text-[12px]" onClick={handleReset}>
                                reset
                            </Button>

                            <div className="mt-[17px]">
                                <p className="text-[10px]">*snap is continous</p>
                                <Button variant='outline' className="text-white bg-[#151515] hover:bg-white rounded-sm w-[80px] xl:w-[130px] h-[35px] text-center justify-center items-center cursor-pointer" onClick={startBurstMode}>
                                    snap
                                </Button>
                                <canvas ref={canvasRef} style={{ display: "none" }} />
                            </div>
                        </div>


                        <div className="flex flex-row gap-4 ">
                            <div className="flex flex-col gap-2">
                                <div className="mt-[8px]">
                                    <p className="text-[14px]">add message</p>
                                    <Textarea className="resize-none w-[170px] xl:w-full max-h-[50px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="message here" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-[14px]">camera filter</p>
                                    <Select
                                        onValueChange={(value) => setMainFeedFilter(value)}
                                        value={mainFeedFilter}
                                    >
                                        <SelectTrigger className=" w-[170px]">
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
                                            textColor === "custom" && (
                                                <input
                                                    type="color"
                                                    value={customTextColor}
                                                    onChange={(e) => {
                                                        setCustomTextColor(e.target.value);
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
                                                setCustomTextColor(value);
                                            } else {
                                                setTextColor("custom");
                                            }
                                        }}
                                        value={textColor}
                                    >
                                        <SelectTrigger className=" w-[170px]">
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
                                        <p className="text-[14px]">film Color</p>
                                        {filmColor === "custom" && (
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => {
                                                    setCustomColor(e.target.value);
                                                    setActualFilmColor(e.target.value);
                                                }}
                                                className="w-[50px] h-[30px] mt-2"
                                            />
                                        )}
                                        {filmColor === "gradient" && (
                                            <div className="flex flex-row gap-2">
                                                <input
                                                    type="color"
                                                    value={gradientStart}
                                                    onChange={(e) => setGradientStart(e.target.value)}
                                                    className="w-[50px] h-[30px] mt-2"
                                                />
                                                <input
                                                    type="color"
                                                    value={gradientEnd}
                                                    onChange={(e) => setGradientEnd(e.target.value)}
                                                    className="w-[50px] h-[30px] mt-2"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Select
                                        onValueChange={(value) => {
                                            if (value === "custom") {
                                                setFilmColor("custom");
                                            } else if (value === "gradient") {
                                                setFilmColor("gradient");
                                                setActualFilmColor(`gradient(${gradientStart}, ${gradientEnd})`);
                                            } else {
                                                setFilmColor(value);
                                                setCustomColor(value);
                                                setActualFilmColor(value);
                                            }
                                        }}
                                        value={filmColor}
                                    >
                                        <SelectTrigger className="w-[170px]">
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
                                            <SelectItem value="gradient">gradient</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <p className="text-[14px]">stickers</p>
                                    <Select onValueChange={(value: string) => setSelectedSticker(value === "none" ? "" : value as StickerType)}>
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="none" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">none</SelectItem>
                                            <SelectItem value="snoopy">snoopy</SelectItem>
                                            <SelectItem value="miffy">miffy</SelectItem>
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
                                        variant='outline'
                                        className="text-white bg-[#151515] hover:bg-white w-[110px] xl:w-[150px] h-[45px] flex items-center justify-center text-[12px] rounded-[3px] cursor-pointer"
                                        onClick={() => setIsUploadDialogOpen(true)}
                                    >
                                        upload image
                                    </Button>


                                    <Button variant='outline' className="text-white bg-[#151515] hover:bg-white w-[110px] xl:w-[150px] h-[45px] flex items-center justify-center text-[12px] rounded-[3px] cursor-pointer" onClick={saveFilmStrip}>
                                        download film
                                    </Button>

                                    <Button variant='outline' className="text-white bg-[#151515] hover:bg-white w-[110px] xl:w-[150px] h-[45px] flex items-center justify-center text-[12px] rounded-[3px] cursor-pointer" onClick={() => setShowCameraErrorDialogggg(true)}>
                                        download video
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full  p-2 flex flex-col gap-4  max-w-[215px] mx-auto">
                        <div className="flex self-start">
                            <p className="flex justify-start text-start">camera filters</p>
                        </div>

                        <div className="border-2 border-whiterounded-[3px] w-[200px] h-[140px] relative">
                            <video
                                ref={videoRef1}
                                autoPlay
                                playsInline
                                className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""}`}
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
                                className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""}`}
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
                                className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""}`}
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
                                className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""}`}
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
                                className={`w-full h-full object-cover ${isFlipped ? "flipped" : ""}`}
                                style={{ filter: filters[4] }}
                            />
                            <div className="absolute top-12 right-15 w-full h-full flex items-center justify-center">
                                <p>vintage</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className=" flex flex-col justify-center mt-4 mx-auto" >

                    <Select
                        onValueChange={(value) => {
                            if (["vertical", "horizontal", "grid-vertical", "grid-horizontal"].includes(value)) {
                                setLayout(value as LayoutType);
                            }
                        }}
                    >
                        <SelectTrigger className="w-[200px] ">
                            <SelectValue placeholder="Select Layout" />
                        </SelectTrigger>
                        <SelectContent className="z-90">
                            <SelectItem value="vertical">vertical</SelectItem>
                            <SelectItem value="horizontal">horizontal</SelectItem>
                            <SelectItem value="grid-vertical">vertical grid</SelectItem>
                            <SelectItem value="grid-horizontal">horizontal grid</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="mt-6">
                        {layout === "vertical" && (
                            <div className="border-2 border-white w-[250px] h-[715px] p-4 flex flex-col gap-4 justify-center relative"
                                style={{
                                    background: filmColor === "gradient"
                                        ? `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`
                                        : customColor,
                                }}>
                                {/* Sticker overlay */}
                                {selectedSticker && selectedSticker in stickerImages && (
                                    <Image
                                        src={stickerImages[selectedSticker as Exclude<StickerType, "">][layout]}
                                        alt="Sticker Overlay"
                                        fill
                                        className="absolute inset-0 object-cover z-80 pointer-events-none"
                                    />
                                )}

                                <div className="space-y-4 z-20">
                                    {photo.map((src, index) => (
                                        <div key={index} className="border border-white w-full h-[140px] bg-white relative flex items-center"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(event) => handleDrop(event, index)}
                                            onTouchStart={() => handleTouchStart(index)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(index)}>
                                            <div className="absolute top-2 left text-white cursor-grab opacity-70 z-10">
                                                <GripVertical />
                                            </div>
                                            <Image src={src || "/placeholder.jpg"} alt={`Photo ${index + 1}`} fill className="rounded w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="z-20">
                                    <div>
                                        <p className="text-[12px] font-bold" style={{ color: customTextColor }}>
                                            {showMessage ? message : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold " style={{ color: customTextColor }}>
                                            {showDate ? new Date().toLocaleDateString() : ""}
                                        </p>
                                    </div>
                                    <div >
                                        <p className="text-[8px] font-bold" style={{ color: customTextColor }}>
                                            00_ by shlynav.tiff
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {layout === "horizontal" && (
                            <div
                                className="border border-white w-full h-64 p-3 gap-3 flex flex-row relative"
                                style={{
                                    background: filmColor === "gradient"
                                        ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
                                        : customColor,
                                }}
                            >
                                {/* Sticker overlay */}
                                {selectedSticker && selectedSticker in stickerImages && (
                                    <Image
                                        src={stickerImages[selectedSticker as Exclude<StickerType, "">][layout]}
                                        alt="Sticker Overlay"
                                        fill
                                        className="absolute inset-0 object-cover z-80 pointer-events-none"
                                    />
                                )}

                                {/* Photo frames */}
                                {photo.slice(0, 4).map((src, index) => (
                                    <div
                                        key={index}
                                        className="border border-white w-36 h-full bg-white relative flex items-center overflow-hidden"
                                        draggable
                                        onDragStart={(event) => handleDragStart(event, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(event) => handleDrop(event, index)}
                                        onTouchStart={() => handleTouchStart(index)}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={() => handleTouchEnd(index)}
                                    >
                                        <Image
                                            src={src || "/placeholder.jpg"}
                                            alt={`Photo ${index + 1}`}
                                            fill
                                            className="rounded w-full h-full object-cover"
                                        />
                                    </div>
                                ))}


                                <div className="flex flex-col justify-center items-center z-20">
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: customTextColor }}>
                                            {showMessage ? message : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: customTextColor }}>
                                            {showDate ? new Date().toLocaleDateString() : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: customTextColor }}>
                                            00_ by shlynav.tiff
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}


                        {layout === "grid-vertical" && (
                            <div className="border border-white w-[515px] h-[830px] p-4 gap-4 flex flex-col relative"
                                style={{
                                    background: filmColor === "gradient"
                                        ? `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`
                                        : customColor,
                                }}>
                                {/* Sticker overlay */}
                                {selectedSticker && selectedSticker in stickerImages && (
                                    <Image
                                        src={stickerImages[selectedSticker as Exclude<StickerType, "">][layout]}
                                        alt="Sticker Overlay"
                                        fill
                                        className="absolute inset-0 object-cover z-80 pointer-events-none"
                                    />
                                )}

                                <div className="flex flex-row gap-4 z-20">
                                    {photo.slice(0, 2).map((src, index) => (
                                        <div key={index} className="border border-white w-full h-[335px] bg-white relative flex items-center"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(event) => handleDrop(event, index)}
                                            onTouchStart={() => handleTouchStart(index)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(index)}>
                                            <Image src={src || "/placeholder.jpg"} alt={`Photo ${index + 1}`} width={250} height={335} className="rounded w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row gap-4 z-20">
                                    {photo.slice(2, 4).map((src, index) => (
                                        <div key={index} className="border border-white w-full h-[335px] bg-white relative flex items-center"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(event) => handleDrop(event, index)}
                                            onTouchStart={() => handleTouchStart(index)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(index)}>
                                            <Image src={src || "/placeholder.jpg"} alt={`Photo ${index + 1}`} width={250} height={335} className="rounded w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="z-20">
                                    <div>
                                        <p className="text-[12px] font-bold" style={{ color: customTextColor }}>
                                            {showMessage ? message : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold " style={{ color: customTextColor }}>
                                            {showDate ? new Date().toLocaleDateString() : ""}
                                        </p>
                                    </div>
                                    <div >
                                        <p className="text-[8px] font-bold" style={{ color: customTextColor }}>
                                            00_ by shlynav.tiff
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {layout === "grid-horizontal" && (
                            <div className="border border-white w-[895px] h-[460px] p-4 gap-4 flex flex-row relative"
                                style={{
                                    background: filmColor === "gradient"
                                        ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
                                        : customColor,
                                }}>
                                {/* Sticker overlay */}
                                {selectedSticker && selectedSticker in stickerImages && (
                                    <Image
                                        src={stickerImages[selectedSticker as Exclude<StickerType, "">][layout]}
                                        alt="Sticker Overlay"
                                        fill
                                        className="absolute inset-0 object-cover z-80 pointer-events-none"
                                    />
                                )}

                                <div className="flex flex-col gap-4 z-20">
                                    {photo.slice(0, 2).map((src, index) => (
                                        <div key={index} className="border border-white w-[365px] h-[205px] bg-white relative flex items-center"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(event) => handleDrop(event, index)}
                                            onTouchStart={() => handleTouchStart(index)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(index)}>
                                            <Image src={src || "/placeholder.jpg"} alt={`Photo ${index + 1}`} width={365} height={205} className="rounded w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4 z-20">
                                    {photo.slice(2, 4).map((src, index) => (
                                        <div key={index} className="border border-white w-[365px] h-[205px] bg-white relative flex items-center"
                                            draggable
                                            onDragStart={(event) => handleDragStart(event, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(event) => handleDrop(event, index)}
                                            onTouchStart={() => handleTouchStart(index)}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(index)}>
                                            <Image src={src || "/placeholder.jpg"} alt={`Photo ${index + 1}`} width={365} height={205} className="rounded w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center flex-col z-20" >
                                    <div>
                                        <p className="text-[12px] font-bold" style={{ color: customTextColor }}>
                                            {showMessage ? message : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold " style={{ color: customTextColor }}>
                                            {showDate ? new Date().toLocaleDateString() : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <p className="text-[8px] font-bold" style={{ color: customTextColor }}>
                                            00_ by shlynav.tiff
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>



            </div >
            <div >
                <Tangina />
            </div>
        </div >
    );
}
