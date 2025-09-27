"use client"
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';

<<<<<<< HEAD
const VodafoneCash = ({ plan, onPaymentSuccess }) => {
=======
const VodafoneCash = () => {
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
    const { language } = useLanguage();
    
    // WhatsApp number - you can change this to your actual WhatsApp number
    const whatsappNumber = "+201007456186"; // Replace with actual WhatsApp number
    
    const handleWhatsAppClick = () => {
        const message = language === 'ar' 
<<<<<<< HEAD
            ? `مرحباً! أود الاشتراك في ${plan.name} ($${plan.price}/${plan.period}) باستخدام فودافون كاش أو فوري. يرجى مساعدتي في عملية الدفع.`
            : `Hello! I would like to subscribe to ${plan.name} ($${plan.price}/${plan.period}) using Vodafone Cash or Fawry. Please help me with the payment process.`;
=======
            ? 'مرحباً! أود الاشتراك باستخدام فودافون كاش أو فوري. يرجى مساعدتي في عملية الدفع.'
            : 'Hello! I would like to subscribe using Vodafone Cash or Fawry. Please help me with the payment process.';
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="space-y-4">
            <div className="p-6 border-2 border-solid border-orange-200 dark:border-black rounded-lg bg-orange-50 dark:bg-white/10">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-orange-100 dark:bg-[#EFFB53] rounded-full">
                            <Phone className="w-8 h-8 text-orange-600 dark:text-black" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-orange-800 dark:text-white">
                            {getTranslation('vodafoneCashTitle', language)}
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-gray-400">
                            {getTranslation('vodafoneCashDescription', language)}
                        </p>
                    </div>
                    
                    
                    <Button 
                        onClick={handleWhatsAppClick}
<<<<<<< HEAD
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
=======
                        className="w-56 bg-green-600 hover:bg-green-700 text-white"
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {getTranslation('contactUsWhatsApp', language)}
                    </Button>
                    
                    
                </div>
            </div>
        </div>
    );
};

export default VodafoneCash;
