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
        </div>
    )
}

export default Dashboard