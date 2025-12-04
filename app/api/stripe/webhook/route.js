import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "No signature provided" },
            { status: 400 }
        );
    }

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            const userId = session.metadata?.userId;
            const creditsToAdd = parseInt(session.metadata?.credits || "0");

            if (!userId) {
                console.error("No userId in session metadata");
                return NextResponse.json(
                    { error: "Missing userId in metadata" },
                    { status: 400 }
                );
            }

            // Get current user to fetch existing credits
            const user = await convexClient.query("users:getUserById", { userId: userId });

            if (!user) {
                console.error("User not found:", userId);
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            // Calculate new credits (add to existing)
            const currentCredits = Number(user.credits) || 0;
            const newCredits = currentCredits + creditsToAdd;

            // Update user credits in Convex
            await convexClient.mutation("users:UpdateUserCredits", {
                uid: userId,
                credits: newCredits,
            });

            console.log(`Successfully added ${creditsToAdd} credits to user ${userId}. New total: ${newCredits}`);

            return NextResponse.json({ received: true });
        } catch (error) {
            console.error("Error processing webhook:", error);
            return NextResponse.json(
                { error: "Error processing webhook" },
                { status: 500 }
            );
        }
    }

    // Return 200 for other event types
    return NextResponse.json({ received: true });
}

