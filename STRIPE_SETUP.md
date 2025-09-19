# Stripe Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Stripe Dashboard Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**:
   - Go to Developers > API Keys
   - Copy your Publishable key (starts with `pk_test_`)
   - Copy your Secret key (starts with `sk_test_`)
3. **Set up Webhook**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret (starts with `whsec_`)

## Features Added

✅ **Dual Payment Options**: Users can choose between PayPal and Stripe
✅ **Payment Method Toggle**: Clean UI to switch between payment methods
✅ **Stripe Card Elements**: Secure card input with Stripe Elements
✅ **Payment Intent API**: Server-side payment processing
✅ **Webhook Handling**: Automatic credit addition on successful payment
✅ **Error Handling**: Proper error messages and loading states
✅ **Multilingual Support**: Arabic and English translations

## How It Works

1. User selects a credit plan
2. User chooses payment method (PayPal or Stripe)
3. For Stripe: User enters card details securely
4. Payment is processed via Stripe API
5. Webhook confirms payment success
6. Credits are automatically added to user account

## Testing

Use Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Security Notes

- Never expose secret keys in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Store sensitive data securely


