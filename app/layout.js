import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google"; // Import the font in here
import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";



export const metadata = {
  title: "SnapShort AI",
  description: "SnapShort AI",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
};

// This is the font variable
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={plusJakartaSans.className}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3K6QWFNRW5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3K6QWFNRW5');
          `}
        </Script>
        <ConvexClientProvider>
          {children}
          <Toaster />
        </ConvexClientProvider>

      </body>
    </html>
  );
}
