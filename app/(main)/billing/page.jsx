"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
// import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign, CreditCard, Wallet, Phone, Check, Star } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations';
import StripePayment from './_components/StripePayment';
import VodafoneCash from './_components/VodafoneCash';

const pricingPlans = [
    {
        id: 'discovery',
        name: 'Discovery Plan',
        price: 19,
        period: 'per month',
        credits: 10,
        videos: '10 Videos per month',
        features: [
            '10 credits',
            'AI Prompt Writer',
            'AI Generated Style',
            'Premium Voices',
            'Background Music',
            'AI Captions',
            'No Watermark'
        ],
        isPopular: false
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: 39,
        period: 'per month',
        credits: 30,
        videos: '30 Videos per month',
        features: [
            '30 credits',
            'AI Prompt Writer',
            'AI Generated Style',
            'Premium Voices',
            'Background Music',
            'AI Captions',
            'No Watermark'
        ],
        isPopular: true
    },
    {
        id: 'business',
        name: 'Business Plan',
        price: 79,
        period: 'per month',
        credits: 60,
        videos: '60 Videos per month',
        features: [
            '60 credits',
            'AI Prompt Writer',
            'AI Generated Style',
            'Premium Voices',
            'Background Music',
            'AI Captions',
            'No Watermark'
        ],
        isPopular: false
    }
]

function Billing() {
    const { user, setUser } = useAuthContext();
    const { language } = useLanguage();
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe', or 'vodafone' (paypal commented out)
    const updateUserCredits = useMutation(api.users.UpdateUserCredits)
    const onPaymentSuccess = async (plan) => {
        //Update User Credits
        const result = await updateUserCredits({
            uid: user?._id,
            credits: Number(user?.credits) + Number(plan.credits)
        });
        console.log(result);
        setUser(prev => ({
            ...prev,
            credits: Number(user?.credits) + Number(plan.credits)
        }))

        toast(getTranslation('creditsAdded', language))
    }

    return (
        <div>
            <h2 className='font-bold text-3xl'>{getTranslation('credits', language)}</h2>

            <div className='p-4 border  rounded-xl flex justify-between  mt-7 max-w-2xl'>
                <div>
                    <h2 className=' font-bold text-xl'>{getTranslation('totalCreditsLeft', language)}</h2>
                    <h2 className='text-sm'>{getTranslation('oneCreditEqualsOneVideo', language)}</h2>
                </div>
                <h2 className='font-bold text-3xl '>{user?.credits} {getTranslation('creditsText', language)}</h2>
            </div>
            <p className='text-sm p-5 text-gray-500 max-w-2xl'>{getTranslation('whenYourCreditBalanceReachesZero', language)}</p>
            <div className='mt-8'>
                <h2 className='font-bold text-2xl mb-6'>Choose Your Plan</h2>

                {/* Pricing Plans Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl'>
                    {pricingPlans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={`relative p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                                plan.isPopular 
                                    ? 'border-[#CCB535] bg-[#CCB535]/10' 
                                    : 'border-gray-200 dark:border-gray-700 bg-[#18181B]'
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.isPopular && (
                                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                                    <div className='bg-[#CCB535] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                        <Star className='w-3 h-3' />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className='text-center mb-6'>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                                    {plan.name}
                                </h3>
                                <div className='mb-2'>
                                    <span className='text-4xl font-bold text-[#CCB535]'>
                                        ${plan.price}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className='text-gray-500 dark:text-gray-400 ml-1'>
                                            /{plan.period}
                                        </span>
                                    )}
                                </div>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    {plan.videos}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className='space-y-3 mb-6'>
                                {plan.features.map((feature, index) => (
                                    <div key={index} className='flex items-center gap-2'>
                                        <Check className='w-4 h-4 text-[#CCB535] flex-shrink-0' />
                                        <span className='text-sm text-gray-700 dark:text-gray-300'>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Options */}
                            <div className='space-y-3'>
                                {/* Payment Method Selector */}
                                <div className='flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                    <button
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-sm ${
                                            paymentMethod === 'stripe' 
                                                ? 'bg-white dark:bg-gray-600 shadow-sm' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <CreditCard className='w-3 h-3' />
                                        Stripe
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('vodafone')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-sm ${
                                            paymentMethod === 'vodafone' 
                                                ? 'bg-white dark:bg-gray-600 shadow-sm' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <Phone className='w-3 h-3' />
                                        Vodafone
                                    </button>
                                </div>

                                {/* Payment Component */}
                                {paymentMethod === 'stripe' ? (
                                    <StripePayment 
                                        plan={plan} 
                                        onPaymentSuccess={onPaymentSuccess}
                                    />
                                ) : (
                                    <VodafoneCash plan={plan} onPaymentSuccess={onPaymentSuccess} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* */}
        </div>
    )
}

export default Billing