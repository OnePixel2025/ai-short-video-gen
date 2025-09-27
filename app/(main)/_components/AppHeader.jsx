"use client"
import { useAuthContext } from '@/app/provider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/configs/firebaseConfig'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from './LanguageSwitcher'


function AppHeader() {
    const { user, setUser } = useAuthContext();
    const { language } = useLanguage();

    const router = useRouter();
    const onButtonPress = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            setUser(null)
            router.replace('/')
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <div className='p-3 flex justify-between items-center'>
            <SidebarTrigger />

            <div className='flex items-center gap-3'>
                <LanguageSwitcher />
                <Popover >
                    <PopoverTrigger>
                        {user?.pictureURL && <Image src={user?.pictureURL} alt='user'
                            width={40} height={40} className='rounded-full' />
                        }
                    </PopoverTrigger>
                    <PopoverContent className='w-[100px] mx-w-sm'>
                        <Button variant={'ghost'} onClick={onButtonPress} className=''>
                            {getTranslation('logout', language)}
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    )
}

export default AppHeader