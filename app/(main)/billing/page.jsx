"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { CircleDollarSign, CreditCard, Wallet, Phone } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useLanguage } from '@/app/_context/LanguageContext'
import { getTranslation } from '@/lib/translations';
import StripePayment from './_components/StripePayment';
import VodafoneCash from './_components/VodafoneCash';
export const creditsPlans = [
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
    }
]
function Billing() {
    const { user, setUser } = useAuthContext();
    const { language } = useLanguage();
    const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal', 'stripe', or 'vodafone'
    const updateUserCredits = useMutation(api.users.UpdateUserCredits)
    const onPaymentSuccess = async (cost, credits) => {
        //Update User Credits
        const result = await updateUserCredits({
            uid: user?._id,
            credits: Number(user?.credits) + Number(credits)
        });
        console.log(result);
        setUser(prev => ({
            ...prev,
            credits: Number(user?.credits) + Number(credits)
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


            </div>

            {/* */}
        </div>
    )
}

export default Billing