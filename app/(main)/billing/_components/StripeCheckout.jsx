"use client"
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthContext } from '@/app/provider';

const StripeCheckout = ({ plan, onPaymentSuccess }) => {
    const { language } = useLanguage();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const handlePaymentClick = async () => {
        if (!user?._id) {
            toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please log in first');
            return;
        }

        setLoading(true);
        
        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: plan.id,
                    userId: user._id,
                    plan: plan,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error(
                language === 'ar' 
                    ? 'حدث خطأ أثناء إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.' 
                    : 'An error occurred while creating the checkout session. Please try again.'
            );
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="text-center space-y-4">
                <Button 
                    onClick={handlePaymentClick}
                    disabled={loading}
                    className="w-full bg-[#EFFB53] hover:bg-[#EFFB53]/80 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                        </>
                    ) : (
                        language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default StripeCheckout;

