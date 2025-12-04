import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { planId, userId, plan } = await req.json();

        if (!planId || !userId || !plan) {
            return NextResponse.json(
                { error: 'Missing required parameters: planId, userId, or plan' },
                { status: 400 }
            );
        }

        // Get the base URL for success/cancel URLs
        // Try to get from request URL first, then fallback to environment variables
        let baseUrl = 'http://localhost:3000';
        
        if (req.url) {
            try {
                const url = new URL(req.url);
                baseUrl = `${url.protocol}//${url.host}`;
            } catch (e) {
                // If URL parsing fails, use headers
                const host = req.headers.get('host') || 'localhost:3000';
                const protocol = host.includes('localhost') ? 'http' : 'https';
                baseUrl = `${protocol}://${host}`;
            }
        } else {
            // Fallback to environment variables or headers
            const host = req.headers.get('host') || 'localhost:3000';
            const protocol = host.includes('localhost') ? 'http' : 'https';
            baseUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || `${protocol}://${host}`;
        }
        
        console.log('Base URL for Stripe redirect:', baseUrl);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan.name,
                            description: `${plan.videos} - ${plan.features.join(', ')}`,
                        },
                        unit_amount: plan.price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/billing/cancel`,
            metadata: {
                userId: userId,
                planId: planId,
                credits: plan.credits.toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

