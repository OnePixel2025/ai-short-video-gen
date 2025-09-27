import { Button } from '@/components/ui/button'
import React from 'react'
import VideoList from '../(main)/dashboard/_components/VideoList'
import Link from 'next/link'

function Hero() {
    return (
        <div className='p-4'>
            <div className='text-center'>
                <h1 className='text-5xl font-bold'>
                    Generate Short Videos using AI
                </h1>
                <h2 className='text-xl text-gray-400 mt-4'>
                    Turn any topic into engaging short videos in minutes
                </h2>
                <Link href="/auth/login">
                    <Button className='mt-4'>
                        Get Started
                    </Button>
                </Link>
            </div>
            <VideoList />
        </div>
    )
}

export default Hero