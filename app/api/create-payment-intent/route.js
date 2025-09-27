import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
<<<<<<< HEAD
        const { amount, currency, credits, customerEmail } = await request.json();
=======
        const { amount, currency, credits } = await request.json();
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
<<<<<<< HEAD
            receipt_email: customerEmail, // This ensures the email is available in webhooks
            metadata: {
                credits: credits,
                customerEmail: customerEmail
=======
            metadata: {
                credits: credits
>>>>>>> 5ccd0ee9b294dde9057bbcb85d0de6355f0cec47
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}


