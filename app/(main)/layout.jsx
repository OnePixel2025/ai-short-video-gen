import React from 'react'
import Script from 'next/script'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
    return (
        <>
            <Script
                src="https://app.tubetoolsai.com/Modules/Chatbot/Resources/assets/js/chatbot-widget.min.js"
                strategy="afterInteractive"
                data-iframe-src="https://app.tubetoolsai.com/chatbot/embed/chatbot_code=bfe044541ece4c8/welcome"
                data-iframe-height="532"
                data-iframe-width="400"
            />
            <div suppressHydrationWarning={true}>
                <DashboardProvider>
                    {children}
                </DashboardProvider>
            </div>
        </>
    )
}

export default DashboardLayout