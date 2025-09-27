"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
<<<<<<< HEAD
// import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign, CreditCard, Wallet, Phone, Check, Star } from 'lucide-react';
=======
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign, CreditCard, Wallet, Phone } from 'lucide-react';
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations';
import StripePayment from './_components/StripePayment';
import VodafoneCash from './_components/VodafoneCash';

<<<<<<< HEAD
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
=======
const creditsPlans = [
    {
        credits: 10,
        cost: 1
    },
    {
        credits: 50,
        cost: 5
    },
    {
        credits: 100,
        cost: 9
    },
    {
        credits: 200,
        cost: 15
    },
    {
        credits: 500,
        cost: 30
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
    }
]

function Billing() {
    const { user, setUser } = useAuthContext();
    const { language } = useLanguage();
<<<<<<< HEAD
    const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe', or 'vodafone' (paypal commented out)
    const updateUserCredits = useMutation(api.users.UpdateUserCredits)
    const onPaymentSuccess = async (plan) => {
        //Update User Credits
        const result = await updateUserCredits({
            uid: user?._id,
            credits: Number(user?.credits) + Number(plan.credits)
=======
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal', 'stripe', or 'vodafone'
    const updateUserCredits = useMutation(api.users.UpdateUserCredits)
    const onPaymentSuccess = async (cost, credits) => {
        //Update User Credits
        const result = await updateUserCredits({
            uid: user?._id,
            credits: Number(user?.credits) + Number(credits)
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
        });
        console.log(result);
        setUser(prev => ({
            ...prev,
<<<<<<< HEAD
            credits: Number(user?.credits) + Number(plan.credits)
        }))

        toast(getTranslation('creditsAdded', language))
    }

=======
            credits: Number(user?.credits) + Number(credits)
        }))

        toast(getTranslation('creditsAdded', language))

    }
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
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
<<<<<<< HEAD
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
=======
            <div className='mt-5'>
                <h2 className='font-bold text-2xl'>{getTranslation('buyMoreCredits', language)}</h2>

                {/* Payment Method Selector */}
                <div className='mt-4 mb-6'>
                    <div className='flex gap-2 p-1 bg-[#FEE039] rounded-lg max-w-2xl text-black'>
                        <button
                            onClick={() => setPaymentMethod('paypal')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                paymentMethod === 'paypal' 
                                    ? 'bg-white dark:bg-gray-100 shadow-sm' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-100'
                            }`}
                        >
                            <Wallet className='w-4 h-4' />
                            PayPal
                        </button>
                        <button
                            onClick={() => setPaymentMethod('stripe')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                paymentMethod === 'stripe' 
                                    ? 'bg-white dark:bg-gray-100 shadow-sm' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-100'
                            }`}
                        >
                            <CreditCard className='w-4 h-4' />
                            Stripe
                        </button>
                        <button
                            onClick={() => setPaymentMethod('vodafone')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                paymentMethod === 'vodafone' 
                                    ? 'bg-white dark:bg-gray-100 shadow-sm' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-100'
                            }`}
                        >
                            <Phone className='w-4 h-4' />
                            Vodafone Cash
                        </button>
                    </div>
                </div>

                <div className=''>
                    {paymentMethod === 'vodafone' ? (
                        <div className='mt-3 max-w-2xl'>
                            <VodafoneCash />
                        </div>
                    ) : (
                        creditsPlans.map((plan, index) => (
                            <div key={index} className='p-5 mt-3 border rounded-xl max-w-2xl'>
                                {paymentMethod === 'stripe' ? (
                                    // Old design for Stripe - vertical layout
                                    <>
                                        <div className='flex justify-between items-center mb-4'>
                                            <h2 className='text-xl flex gap-2 items-center'>
                                                <CircleDollarSign /> <strong>{plan?.credits}</strong> {getTranslation('creditsText', language)}
                                            </h2>
                                            <h2 className='font-medium text-xl'>{plan.cost} $</h2>
                                        </div>
                                        
                                        {/* Stripe Payment Component */}
                                        <div className='mt-4'>
                                            <StripePayment 
                                                plan={plan} 
                                                onPaymentSuccess={onPaymentSuccess}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // New design for PayPal - horizontal layout
                                    <div className='flex justify-between items-center'>
                                        <div className='flex gap-2 items-center'>
                                            <CircleDollarSign className='w-6 h-6' />
                                            <h2 className='text-xl font-semibold'>
                                                <strong>{plan?.credits}</strong> {getTranslation('creditsText', language)}
                                            </h2>
                                        </div>
                                        
                                        {/* PayPal Payment Component */}
                                        <div className='flex items-center gap-3'>
                                            <h2 className='font-medium text-xl'>{plan.cost} $</h2>
                                            <PayPalButtons
                                                style={{ 
                                                    layout: "horizontal",
                                                    label: "pay",
                                                    tagline: false,
                                                    shape: "rect"
                                                }}
                                                onApprove={() => onPaymentSuccess(plan?.cost, plan?.credits)}
                                                onCancel={() => toast(getTranslation('paymentCanceled', language))}
                                                createOrder={(data, actions) => {
                                                    return actions?.order?.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: plan.cost,
                                                                    currency_code: 'USD'
                                                                }
                                                            }
                                                        ]
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>


>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
            </div>

            {/* */}
        </div>
    )
}

export default Billing