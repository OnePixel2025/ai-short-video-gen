import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            const credits = parseInt(paymentIntent.metadata.credits);
            const customerEmail = paymentIntent.receipt_email;
            
            console.log('Payment succeeded:', paymentIntent.id);
            console.log('Credits to add:', credits);
            console.log('Customer email:', customerEmail);
            
            try {
                // Find user by email and add credits
                if (customerEmail && credits) {
                    // Find user by email
                    const user = await convex.query(api.users.getUserByEmail, { email: customerEmail });
                    
                    if (user) {
                        // Add credits to user's account
                        const newCredits = user.credits + credits;
                        await convex.mutation(api.users.UpdateUserCredits, {
                            uid: user._id,
                            credits: newCredits
                        });
                        
                        console.log(`Added ${credits} credits to user ${user.email}. New total: ${newCredits}`);
                    } else {
                        console.log('User not found for email:', customerEmail);
                    }
                }
            } catch (error) {
                console.error('Error updating user credits:', error);
            }
            
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}