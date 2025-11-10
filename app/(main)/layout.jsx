import React from 'react'
import Script from 'next/script'
import DashboardProvider from './provider'

function DashboardLayout({ children }) {
    return (
        <>
            <Script
                id="tawk-to"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                            s1.async=true;
                            s1.src='https://embed.tawk.to/6912174f5805cd195914d545/1j9nam4dq';
                            s1.charset='UTF-8';
                            s1.setAttribute('crossorigin','*');
                            s0.parentNode.insertBefore(s1,s0);
                        })();
                    `.replace(/\s+/g, ' ')
                }}
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