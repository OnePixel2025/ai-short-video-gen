"use client"
import React from 'react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react'

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage()

    const currentLanguage = languages.find(lang => lang.code === language)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-[#FEE039] hover:bg-[#FEE039]/90">
                    <Globe className="h-4 w-4 text-black" />
                    <span className="text-sm text-black">{currentLanguage?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 ">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-2 cursor-pointer ${
                            language === lang.code ? 'bg-accent' : ''
                        }`}
                    >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitcher

