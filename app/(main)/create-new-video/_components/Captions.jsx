import React, { useState } from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
const options = [

    {
        "name": "Youtuber",
        "nameKey": "youtuber",
        "style": {
            "color": "#facc15",
            "fontSize": "1.875rem",
            "fontWeight": "800",
            "textTransform": "uppercase",
            "letterSpacing": "0.05em",
            "textShadow": "2px 2px 4px rgba(0, 0, 0, 0.25)",
            "padding": "0.25rem 0.75rem",
            "borderRadius": "0.5rem"
        }
    },
    {
        "name": "Superme",
        "nameKey": "superme",
        "style": {
            "color": "white",
            "fontSize": "1.875rem",
            "fontWeight": "700",
            "fontStyle": "italic",
            "textShadow": "4px 4px 6px rgba(0, 0, 0, 0.25)",
            "padding": "0.25rem 0.75rem",
            "borderRadius": "0.5rem"
        }
    },
    {
        "name": "Neon",
        "nameKey": "neon",
        "style": {
            "color": "#22c55e",
            "fontSize": "1.875rem",
            "fontWeight": "800",
            "textTransform": "uppercase",
            "letterSpacing": "0.05em",
            "textShadow": "4px 4px 6px rgba(0, 0, 0, 0.25)",
            "padding": "0.25rem 0.75rem",
            "borderRadius": "0.5rem"
        }
    },
    {
        "name": "Glitch",
        "nameKey": "glitch",
        "style": {
            "color": "#ec4899",
            "fontSize": "1.875rem",
            "fontWeight": "800",
            "textTransform": "uppercase",
            "letterSpacing": "0.05em",
            "textShadow": "4px 4px 0 rgba(0, 0, 0, 0.2)",
            "padding": "0.25rem 0.75rem",
            "borderRadius": "0.5rem"
        }
    },
    {
        "name": "Fire",
        "nameKey": "fire",
        "style": {
            "color": "#ef4444",
            "fontSize": "1.875rem",
            "fontWeight": "800",
            "textTransform": "uppercase",
            "padding": "0.25rem 0.75rem",
            "borderRadius": "0.5rem"
        }
    },
    {
        "name": "Futuristic",
        "nameKey": "futuristic",
        "style": {
            "fontSize": "1.875rem",
            "fontWeight": "700",
            "background": "linear-gradient(to right, #2dd4bf, #93c5fd)",
            "WebkitBackgroundClip": "text",
            "WebkitTextFillColor": "transparent",
            "textShadow": "2px 2px 4px rgba(0, 0, 0, 0.25)"
        }
    },


]
function Captions({ onHandleInputChange }) {
    const [selectedCaptionStyle, setSelectedCaptionStyle] = useState();
    const { language } = useLanguage();
    return (
        <div className='mt-5'>
            <h2 className='font-semibold'>{getTranslation('captionStyle', language)}</h2>
            <p className='text-sm text-gray-400'>{getTranslation('selectCaptionStyle', language)}</p>

            <div className='flex flex-wrap gap-4 mt-2'>
                {options.map((option, index) => (
                    <div key={index}
                        onClick={() => {
                            setSelectedCaptionStyle(option.name)
                            onHandleInputChange('caption', option)
                        }}
                        className={`p-2 hover:border bg-[#18181B]
                     border-[#FEE039] cursor-pointer rounded-lg
                     ${selectedCaptionStyle == option.name && 'border'}`}>
                        <h2 style={option.style}>{getTranslation(option.nameKey, language)}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Captions