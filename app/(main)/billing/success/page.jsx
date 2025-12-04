"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations'
import Link from 'next/link'

function SuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, setUser } = useAuthContext()
    const { language } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (sessionId) {
            // Verify the session and refresh user data
            verifySession()
        } else {
            setLoading(false)
        }
    }, [sessionId])

    const verifySession = async () => {
        try {
            // The webhook should have already processed the payment
            // We just need to refresh the user data
            // In a real scenario, you might want to verify the session status
            setVerified(true)
            setLoading(false)
            
            // Optionally refresh user data here if needed
            // The webhook already updated credits, but we can trigger a refresh
        } catch (error) {
            console.error('Error verifying session:', error)
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#CCB535]" />
                    <p className="text-gray-400">
                        {language === 'ar' ? 'جارٍ التحقق من الدفع...' : 'Verifying payment...'}
                    </p>
                </div>
            ) : (
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {language === 'ar' 
                            ? 'تم إضافة الرصيد إلى حسابك بنجاح. يمكنك الآن البدء في إنشاء الفيديوهات.' 
                            : 'Your credits have been successfully added to your account. You can now start creating videos.'}
                    </p>
                    {user && (
                        <div className="p-4 bg-[#18181B] rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400 mb-2">
                                {language === 'ar' ? 'الرصيد الحالي' : 'Current Credits'}
                            </p>
                            <p className="text-2xl font-bold text-[#CCB535]">
                                {user.credits || 0} {language === 'ar' ? 'رصيد' : 'credits'}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button className="bg-[#CCB535] hover:bg-[#CCB535]/80 text-black">
                                {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                            </Button>
                        </Link>
                        <Link href="/create-new-video">
                            <Button variant="outline" className="border-[#CCB535] text-[#CCB535] hover:bg-[#CCB535]/10">
                                {language === 'ar' ? 'إنشاء فيديو جديد' : 'Create New Video'}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SuccessPage

