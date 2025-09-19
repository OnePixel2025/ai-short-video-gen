import Image from 'next/image'
import React from 'react'
import { options } from './VideoStyle'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'

function Preview({ formData }) {
    const { language } = useLanguage();
    const selectVideoStyle = formData && options.find((item => item?.name == formData?.videoStyle));
    console.log(selectVideoStyle);
    return formData?.videoStyle && (
        <div className='relative'>
            <h2 className='mb-3 text-2xl font-semibold'>{getTranslation('preview', language)}</h2>
            <Image src={selectVideoStyle?.image} alt={selectVideoStyle?.name}
                width={1000}
                height={300}
                className='w-full h-[65vh] max-w-sm min-w-md object-cover rounded-xl'
            />
            <h2 className={` 
            absolute bottom-7 text-center w-full`}
                style={formData?.caption?.style}
            >{formData?.caption?.nameKey ? getTranslation(formData?.caption?.nameKey, language) : formData?.caption?.name}</h2>
        </div>
    )
}

export default Preview