"use client"
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';

const VodafoneCash = ({ plan, onPaymentSuccess }) => {
    const { language } = useLanguage();

    // Payment link
    const paymentUrl = "https://pay-now.nzmly.com/l/EJhWFtsxkn";

    const handlePaymentClick = () => {
        // Optional: Show toast or console message before redirect
        console.log(`Redirecting to payment page for plan: ${plan.name}`);
        window.open(paymentUrl, '_blank');
    };

    return (
        <div className="space-y-4">
            <div className="text-center space-y-4">
                <Button 
                    onClick={handlePaymentClick}
                    className="w-full bg-[#EFFB53] hover:bg-[#EFFB53]/80 text-black"
                >
                    {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                </Button>
            </div>
        </div>
    );
};

export default VodafoneCash;
