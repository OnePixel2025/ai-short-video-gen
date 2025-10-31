
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState, useRef } from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { Play, Pause, Loader2 } from 'lucide-react'
import axios from 'axios'

const voiceOptions = [
        {
            "value": "af_alloy",
            "name": "Alloy (Female)"
        },
        {
            "value": "af_aoede",
            "name": "Aoede (Female)"
        },
        {
            "value": "af_bella",
            "name": "Bella (Female)"
        },
        {
            "value": "af_jessica",
            "name": "Jessica (Female)"
        },
        {
            "value": "af_kore",
            "name": "Kore (Female)"
        },
        {
            "value": "af_nicole",
            "name": "Nicole (Female)"
        },
        {
            "value": "af_nova",
            "name": "Nova (Female)"
        },
        {
            "value": "af_river",
            "name": "River (Female)"
        },
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
        {
            "value": "am_puck",
            "name": "Puck (Male)"
        },
        {
            "value": "aura-asteria-en",
            "name": "Asteria (Female)"
        },
        {
            "value": "aura-luna-en",
            "name": "Luna (Female)"
        },
        {
            "value": "aura-stella-en",
            "name": "Stella (Female)"
        },
        {
            "value": "aura-hera-en",
            "name": "Hera (Female)"
        },
        {
            "value": "aura-orion-en",
            "name": "Orion (Male)"
        },
        {
            "value": "aura-arcas-en",
            "name": "Arcas (Male)"
        },
        {
            "value": "aura-perseus-en",
            "name": "Perseus (Male)"
        },
        {
            "value": "aura-orpheus-en",
            "name": "Orpheus (Male)"
        }
]
function Voice({ onHandleInputChange }) {
    const [selectedVoice, setSelectedVoice] = useState();
    const [playingVoice, setPlayingVoice] = useState(null);
    const [loadingVoice, setLoadingVoice] = useState(null);
    const audioRef = useRef(null);
    const { language } = useLanguage();

    const handleVoiceSelect = (voice) => {
        setSelectedVoice(voice.name);
        onHandleInputChange('voice', voice.value);
    };

    const handlePreview = async (e, voice) => {
        e.stopPropagation(); // Prevent voice selection when clicking play button
        
        // If the same voice is playing, stop it
        if (playingVoice === voice.value && audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlayingVoice(null);
            return;
        }

        // Stop currently playing audio
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        setLoadingVoice(voice.value);
        setPlayingVoice(null);

        try {
            // Generate preview audio
            const response = await axios.post('/api/voice-preview', {
                voice: voice.value
            });

            if (response.data.audioUrl) {
                // Create new audio element
                const audio = new Audio(response.data.audioUrl);
                audioRef.current = audio;

                audio.onended = () => {
                    setPlayingVoice(null);
                };

                audio.onerror = () => {
                    setPlayingVoice(null);
                    setLoadingVoice(null);
                    console.error('Error playing audio');
                };

                await audio.play();
                setPlayingVoice(voice.value);
                setLoadingVoice(null);
            }
        } catch (error) {
            console.error('Error generating voice preview:', error);
            setLoadingVoice(null);
        }
    };

    return (
        <div className='mt-5'>
            <h2 className='font-semibold'>{getTranslation('videoVoice', language)}</h2>
            <p className='text-sm text-gray-400 '>{getTranslation('selectVoiceForVideo', language)}</p>
            <ScrollArea className='h-[200px] w-full p-4'>
                <div className='grid grid-cols-2 gap-3'>
                    {voiceOptions.map((voice, index) => (
                        <div 
                            className={`cursor-pointer p-3
                                bg-[#18181B]
                                dark:border-[#FEE039] rounded-lg
                                hover:border transition-all
                                ${voice.name == selectedVoice ? 'border border-[#FEE039]' : 'border-transparent'}
                                flex items-center justify-between gap-2`}
                            onClick={() => handleVoiceSelect(voice)}
                            key={index}
                        >
                            <span className="flex-1 text-sm">{voice.name}</span>
                            <button
                                onClick={(e) => handlePreview(e, voice)}
                                className="p-1.5 rounded hover:bg-gray-800 transition-colors flex-shrink-0"
                                disabled={loadingVoice === voice.value}
                            >
                                {loadingVoice === voice.value ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#FEE039]" />
                                ) : playingVoice === voice.value ? (
                                    <Pause className="w-4 h-4 text-[#FEE039]" />
                                ) : (
                                    <Play className="w-4 h-4 text-gray-400 hover:text-[#FEE039]" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default Voice