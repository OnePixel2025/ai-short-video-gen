import Image from 'next/image'
import React, { useState } from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'

export const options = [
    {
        name: 'Realistic',
        nameKey: 'realistic',
        image: '/realistic.png'
    },
    {
        name: 'Cinematic',
        nameKey: 'cinematic',
        image: '/cinematic.png'
    },
    {
        name: 'Cartoon',
        nameKey: 'cartoon',
        image: '/3d.png'
    },
    {
        name: 'Watercolor',
        nameKey: 'watercolor',
        image: '/watercolor2.jpg'
    },
    {
        name: 'Cyberpunk',
        nameKey: 'cyberpunk',
        image: '/cyberpunk.png'
    },
    {
        name: 'GTA',
        nameKey: 'gta',
        image: '/gta.png'
    },
    {
        name: 'Anime',
        nameKey: 'anime',
        image: '/anim.png'
    }

]

function VideoStyle({ onHandleInputChange }) {
    const [selectedStyle, setSelectedStyle] = useState();
    const { language } = useLanguage();
    return (
        <div className='mt-5'>
            <h2 className='font-semibold'>{getTranslation('videoStyles', language)}</h2>
            <p className='text-sm text-gray-400 mb-1'>{getTranslation('selectVideoStyle', language)}</p>

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2'>
                {options?.map((option, index) => (
                    <div className='relative' key={index}
                        onClick={() => {
                            setSelectedStyle(option.name);
                            onHandleInputChange('videoStyle', option.name)
                        }}
                    >
                        <Image src={option.image}
                            alt={option.name}
                            width={500}
                            height={120}
                            className={`object-cover h-[90px]
                            lg:h-[130px] xl:h-[180px] rounded-lg p-1
                            hover:border border-[#FEE039] cursor-pointer
                            ${option.name == selectedStyle && 'border'}`}
                        />
                        <h2 className='absolute bottom-1 text-center w-full'>{getTranslation(option.nameKey, language)}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoStyle