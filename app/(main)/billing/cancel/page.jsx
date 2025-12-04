"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { useLanguage } from '@/app/_context/LanguageContext'
import Link from 'next/link'

function CancelPage() {
    const { language } = useLanguage()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <XCircle className="w-20 h-20 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {language === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' 
                        ? 'لم يتم إتمام عملية الدفع. لم يتم خصم أي مبلغ من حسابك.' 
                        : 'Your payment was cancelled. No charges were made to your account.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/billing">
                        <Button className="bg-[#CCB535] hover:bg-[#CCB535]/80 text-black">
                            {language === 'ar' ? 'العودة إلى صفحة الدفع' : 'Return to Billing'}
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" className="border-[#CCB535] text-[#CCB535] hover:bg-[#CCB535]/10">
                            {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CancelPage

