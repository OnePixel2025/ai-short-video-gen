"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import Link from 'next/link'
import Image from 'next/image'

function PromotionalBanner() {
    const { language } = useLanguage();

    return (
        <div className="bg-gradient-to-r from-[#EFFB53] to-[#FFE03A] rounded-2xl mb-8 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
                {/* Left Content */}
                <div className="flex-1 p-8 space-y-4 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
                        {getTranslation('generateNewIdeas', language) || 'Generate New Ideas for Your Content'}
                    </h1>
                    <p className="text-lg text-black/80 leading-relaxed max-w-lg">
                        {getTranslation('bannerDescription', language) || 'Create amazing AI-powered videos with our advanced generator. Transform your ideas into engaging short videos that captivate your audience.'}
                    </p>
                    <Link href="/create-new-video">
                        <Button 
                            size="lg" 
                            className="bg-black text-white hover:bg-black/90 font-semibold mt-10 px-8 py-3 rounded-lg"
                        >
                            {getTranslation('createNewVideoButton', language) || 'Create New Video'}
                        </Button>
                    </Link>
                </div>

                {/* Right Content - Image */}
                <div className="flex-1 flex justify-center lg:justify-end">
                    <Image
                        src="/banner-img.png"
                        alt="AI Video Generator Banner"
                        width={500}
                        height={400}
                        className="h-full w-auto object-cover rounded-r-2xl mx-10"
                    />
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-10 -translate-x-12"></div>
        </div>
    )
}

export default PromotionalBanner
