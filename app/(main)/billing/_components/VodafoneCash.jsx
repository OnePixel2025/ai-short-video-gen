"use client"
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';

const VodafoneCash = ({ plan, onPaymentSuccess }) => {
    const { language } = useLanguage();
    
    // WhatsApp number - you can change this to your actual WhatsApp number
    const whatsappNumber = "+201007456186"; // Replace with actual WhatsApp number
    
    const handleWhatsAppClick = () => {
        const message = language === 'ar' 
            ? `مرحباً! أود الاشتراك في ${plan.name} ($${plan.price}/${plan.period}) باستخدام فودافون كاش أو فوري. يرجى مساعدتي في عملية الدفع.`
            : `Hello! I would like to subscribe to ${plan.name} ($${plan.price}/${plan.period}) using Vodafone Cash or Fawry. Please help me with the payment process.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="space-y-4">
            <div className="text-center space-y-4">
               
                
                <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-[#EFFB53] hover:bg-[#EFFB53]/80 text-black"
                >
                    Subscribe Now
                </Button>
            </div>
        </div>
    );
};

export default VodafoneCash;