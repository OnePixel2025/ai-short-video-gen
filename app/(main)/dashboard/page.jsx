"use client"
import React from 'react'
import VideoList from './_components/VideoList'
import PromotionalBanner from './_components/PromotionalBanner'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'

function Dashboard() {
    const { language } = useLanguage();
    
    return (
        <div>
            <PromotionalBanner />
            <h2 className='font-bold text-3xl'>{getTranslation('myVideos', language)}</h2>
            <VideoList />

            <div
                className="elfsight-app-76811890-7957-40e8-a770-9eb3ac2f215b"
                data-elfsight-app-lazy
            />
        </div>
    )
}

export default Dashboard