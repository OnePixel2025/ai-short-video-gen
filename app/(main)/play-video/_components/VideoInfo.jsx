/*import { Button } from '@/components/ui/button'
import { ArrowLeft, DownloadIcon, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function VideoInfo({ videoData }) {
    return (
        <div className='p-5 border rounded-xl'>
            <Link href={'/dashboard'}>
                <h2 className='flex gap-2 items-center'>
                    <ArrowLeft />
                    Back to Dashboard
                </h2>
            </Link>
            <div className='flex flex-col gap-3'>
                <h2 className='mt-5'>Project Name: {videoData?.title}</h2>
                <p className='text-gray-500'>Script: {videoData?.script}</p>
                <h2>Video Style : {videoData?.videoStyle}</h2>

                {videoData?.downloadUrl ?
                    <a href={videoData?.downloadUrl} className='w-full' target='_blank'>
                        <Button className="w-full"> <DownloadIcon /> Export & Download</Button>
                    </a>
                    :
                    <div>
                        <Button disabled className="w-full"> <RefreshCcw className='animate-spin' /> Processing Your Video...</Button>

                        <h2 className='text-xs text-gray-500 mt-3'>You can still play your video, Processing will take 1-2 Min</h2>
                    </div>
                }
            </div>
        </div>
    )
}

export default VideoInfo*/ 

"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, DownloadIcon, RefreshCcw } from 'lucide-react'
import { FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa'
import Link from 'next/link'
import { useAuthContext } from '@/app/provider';
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations';


function VideoInfo({ videoData }) {
    const [isUploading, setIsUploading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuthContext();
    const { language } = useLanguage();
    const isOwner = user?._id === videoData?.uid;

    // Calculate remaining time based on video creation timestamp
    useEffect(() => {
        if (videoData) {
            // Use createdAt if available, otherwise fallback to _creationTime
            const creationTime = videoData.createdAt || videoData._creationTime;
            let startTime;
            
            if (!creationTime) {
                // If no creation time, start a 3-minute countdown from now
                console.log('No creation time found, starting 3-minute countdown');
                startTime = new Date();
            } else {
                startTime = new Date(creationTime);
            }

            const updateTimer = () => {
                const now = new Date();
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                const remainingSeconds = Math.max(0, 180 - elapsedSeconds); // 3 minutes = 180 seconds
                
                console.log('Timer update:', {
                    creationTime: creationTime,
                    startTime: startTime,
                    now: now,
                    elapsedSeconds,
                    remainingSeconds,
                    isProcessing: remainingSeconds > 0,
                    hasDownloadUrl: !!videoData.downloadUrl,
                    videoReady: !!videoData.downloadUrl
                });
                
                setTimeRemaining(remainingSeconds);
                setIsProcessing(remainingSeconds > 0);
                
                // If time is up, stop the timer
                if (remainingSeconds <= 0) {
                    setIsProcessing(false);
                }
            };

            // Update immediately
            updateTimer();

            // Update every second
            const timer = setInterval(updateTimer, 1000);

            return () => clearInterval(timer);
        }
    }, [videoData]);

    // Format time remaining as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


    const handleShare = async (platform) => {
        switch (platform) {

            case 'youtube':
                try {
                    setIsUploading(true);

                    // Create auth URL with video data
                    const authUrl = `/api/youtube-auth?` + new URLSearchParams({
                        videoUrl: encodeURIComponent(videoData.downloadUrl),
                        title: encodeURIComponent(videoData.title || 'My AI Generated Video'),
                        description: encodeURIComponent(videoData.script || '')
                    });

                    // Open auth in a popup window
                    const width = 600;
                    const height = 700;
                    const left = (window.innerWidth - width) / 2;
                    const top = (window.innerHeight - height) / 2;

                    window.open(
                        authUrl,
                        'YouTube Authorization',
                        `width=${width},height=${height},top=${top},left=${left}`
                    );
                    
                } catch (error) {
                    console.error('YouTube share error:', error);
                    alert('Failed to share to YouTube: ' + error.message);
                } finally {
                    setIsUploading(false);
                }
                break;
        }
    };

    return (
        <div className="p-5 border rounded-xl">
            <Link href={'/dashboard'}>
            <h2 className="flex gap-2 items-center font-semibold">
                <ArrowLeft />
                {getTranslation('backToDashboard', language)}
            </h2>
            </Link>

            <div className="flex flex-col gap-3">
            <h2 className="mt-5">{getTranslation('videoTitle', language)} {videoData?.title}</h2>
            <p className="text-gray-500">{getTranslation('script', language)} {videoData?.script}</p>
            <h2>{getTranslation('videoStyle', language)} {videoData?.videoStyle}</h2>

            {videoData?.downloadUrl && !isProcessing && timeRemaining === 0 ? (
                <>
                {isOwner ? (
                    <>
                    <a href={videoData?.downloadUrl} className="w-52" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full font-semibold text-sm bg-[#EFFB53] hover:bg-[#FEE039]">
                        <DownloadIcon /> {getTranslation('exportAndDownload', language)}
                        </Button>
                    </a>

                    <h2 className="mt-5 font-semibold">{getTranslation('shareOnSocialMedia', language)}</h2>

                        <Button
                            onClick={() => handleShare('youtube')}
                            disabled={isUploading}
                            className="flex-1 w-52 bg-gradient-to-r from-red-500 via-red-800 to-red-500 text-white hover:brightness-90 transition duration-200 ease-in-out will-change-auto font-semibold text-sm"
                        >
                            {isUploading ? (
                            <RefreshCcw className="mr-2 animate-spin" />
                            ) : (
                            <FaYoutube className="mr-2" />
                            )}
                            YouTube
                        </Button>

                    </>
                ) : (
                    <Button disabled className='font-semibold text-sm bg-[#EFFB53] '>{getTranslation('downloadAndSharingAvailableToOwnerOnly', language)}</Button>
                )}
                </>
            ) : (
                <div>
                <Button disabled className="w-full font-semibold text-sm ">
                    <RefreshCcw className="animate-spin" /> 
                    {videoData?.downloadUrl 
                        ? `Video Ready - Download Available in ${formatTime(timeRemaining)}`
                        : timeRemaining > 0 
                            ? `${getTranslation('processingYourVideo', language)} (${formatTime(timeRemaining)})`
                            : getTranslation('processingYourVideo', language)
                    }
                </Button>
                <h2 className="text-sm text-gray-500 mt-3 font-semibold ">
                    {videoData?.downloadUrl 
                        ? `Your video is ready! Download will be available in ${formatTime(timeRemaining)}. You can still play your video now.`
                        : timeRemaining > 0 
                            ? `${getTranslation('youCanStillPlayYourVideo', language)} ${getTranslation('processingWillTake', language)} ${formatTime(timeRemaining)}`
                            : getTranslation('youCanStillPlayYourVideo', language)
                    }
                </h2>
                </div>
            )}
            </div>
        </div>
    );

}

export default VideoInfo
