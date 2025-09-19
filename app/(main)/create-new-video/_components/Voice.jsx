
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'

const voiceOptions = [
    {
        "value": "af_sarah",
        "name": "Sarah (Female)"
    },
    {
        "value": "af_sky",
        "name": "Sky (Female)"
    },
    {
        "value": "am_adam",
        "name": "Adam (Male)"
    },
    {
        "value": "am_echo",
        "name": "Echo (Male)"
    },
    {
        "value": "am_eric",
        "name": "Eric (Male)"
    },
    {
        "value": "am_fenrir",
        "name": "Fenrir (Male)"
    },
    {
        "value": "am_liam",
        "name": "Liam (Male)"
    },
    {
        "value": "am_michael",
        "name": "Michael (Male)"
    },
    {
        "value": "am_onyx",
        "name": "Onyx (Male)"
    },
]
function Voice({ onHandleInputChange }) {
    const [selectedVoice, setSelectedVoice] = useState();
    const { language } = useLanguage();
    return (
        <div className='mt-5'>
            <h2 className='font-semibold'>{getTranslation('videoVoice', language)}</h2>
            <p className='text-sm text-gray-400 '>{getTranslation('selectVoiceForVideo', language)}</p>
            <ScrollArea className='h-[200px] w-full p-4'>
                <div className='grid grid-cols-2 gap-3'>
                    {voiceOptions.map((voice, index) => (
                        <h2 className={`cursor-pointer p-3
                    bg-[#18181B]
                    dark:border-[#FEE039] rounded-lg
                     hover:border ${voice.name == selectedVoice && 'border'}`}
                            onClick={() => {
                                setSelectedVoice(voice.name);
                                onHandleInputChange('voice', voice.value)
                            }}
                            key={index}>{voice.name}</h2>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default Voice