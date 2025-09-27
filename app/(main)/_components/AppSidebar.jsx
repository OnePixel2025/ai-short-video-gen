"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Gem, HomeIcon, LucideFileVideo, Search, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/app/provider'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'

const MenuItems = [
    {
        titleKey: 'home',
        url: '/dashboard',
        icon: HomeIcon
    },
    {
        titleKey: 'createNewVideo',
        url: '/create-new-video',
        icon: LucideFileVideo
    },
    {
        titleKey: 'explore',
        url: '/explore',
        icon: Search
    },
    {
        titleKey: 'billing',
        url: '/billing',
        icon: WalletCards
    }
]

function AppSidebar() {
    const path = usePathname();
    const { user } = useAuthContext();
    const { language } = useLanguage();
    console.log(path)
    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <div className='flex items-center gap-3 w-full justify-center mt-5'>
                        <Image src={'/VidCraft.png'} alt='logo' width={175} height={175} /> 
                        {/*<h2 className='font-bold text-2xl'>Video Gen</h2> */}
                    </div>
                    {/*<h2 className='text-lg text-gray-400 text-center mt-3'>{getTranslation('aiShortVideoGenerator', language)}</h2>*/}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                    <div className="mx-3 mt-8">
                        <Link href="/create-new-video" className="block">
                            <button
                            type="button"
                            className="group/button relative h-12 w-full overflow-hidden rounded-md bg-[#EFFB53] px-8 py-2 text-black transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
                            >
                            <span className="relative z-10 font-semibold">{getTranslation('createNewVideoButton', language)}</span>

                            {/* animated background ripple */}
                            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
                                <span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-[#FEE039] transition-transform duration-500 group-hover/button:-translate-x-0 group-hover/button:scale-150" />
                            </span>
                            </button>
                        </Link>
                    </div>
                        <SidebarMenu>
                            {MenuItems.map((menu, index) => (
                                <SidebarMenuItem className="mt-3" key={index}>
                                    <SidebarMenuButton isActive={path == menu.url} className="p-5">
                                        <Link href={menu?.url} className='flex items-center gap-4 p-3 font-semibold'>
                                            <menu.icon />
                                            <span>{getTranslation(menu?.titleKey, language)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <div className="p-5 border rounded-lg mb-6 bg-[#000000]">
                    <div className="flex items-center justify-between">
                        <Gem className="text-white" />
                        <h2 className="text-white">{user?.credits} {getTranslation('creditsLeft', language)}</h2>
                    </div>
                    <Link href={'/billing'} className="w-full">
                        <button
                            type="button"
                            className="group relative h-12 w-full overflow-hidden rounded-md bg-[#FEE039] px-6 text-black transition hover:bg-[#ccb535] mt-3"
                        >
                            <span className="relative z-10 font-semibold">{getTranslation('buyMoreCredits', language)}</span>
                            <div className="animate-shine-infinite absolute inset-0 -top-[20px] flex h-[calc(100%+40px)] w-full justify-center blur-[12px]">
                                <div className="relative h-full w-8 bg-white/30"></div>
                            </div>
                        </button>
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar