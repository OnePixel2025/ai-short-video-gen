import React from 'react'
import Script from 'next/script'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
    return (
        <>
            <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
            <div suppressHydrationWarning={true}>
                <DashboardProvider>
                    {children}
                </DashboardProvider>
            </div>
        </>
    )
}

export default DashboardLayout