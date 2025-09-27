"use client"
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { useAuthContext } from '@/app/provider';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ plan, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const { user } = useAuthContext();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            // Create payment intent on your server
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: plan.price * 100, // Convert to cents
                    currency: 'usd',
                    credits: plan.credits,
                    customerEmail: user?.email
                }),
            });

            const { clientSecret } = await response.json();

            // Confirm the payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (error) {
                toast.error(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                onPaymentSuccess(plan);
                toast.success(getTranslation('paymentSuccessful', language));
            }
        } catch (error) {
            toast.error(getTranslation('paymentFailed', language));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-lg">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            <Button 
                type="submit" 
                disabled={!stripe || loading}
                className="w-full"
            >
                {loading ? getTranslation('processing', language) : `Pay $${plan.price} with Stripe`}
            </Button>
        </form>
    );
};

const StripePayment = ({ plan, onPaymentSuccess }) => {
    return (
        <Elements stripe={stripePromise}>
            <StripePaymentForm plan={plan} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
    );
};

export default StripePayment;