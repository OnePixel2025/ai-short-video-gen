"use client"
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/_context/LanguageContext';
import { getTranslation } from '@/lib/translations';
<<<<<<< HEAD
import { useAuthContext } from '@/app/provider';
=======
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ plan, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
<<<<<<< HEAD
    const { user } = useAuthContext();
=======
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47

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
<<<<<<< HEAD
                    amount: plan.price * 100, // Convert to cents
                    currency: 'usd',
                    credits: plan.credits,
                    customerEmail: user?.email
=======
                    amount: plan.cost * 100, // Convert to cents
                    currency: 'usd',
                    credits: plan.credits
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
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
<<<<<<< HEAD
                onPaymentSuccess(plan);
=======
                onPaymentSuccess(plan.cost, plan.credits);
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
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
<<<<<<< HEAD
                {loading ? getTranslation('processing', language) : `Pay $${plan.price} with Stripe`}
=======
                {loading ? getTranslation('processing', language) : `Pay $${plan.cost} with Stripe`}
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
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

