import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    // Handle Stripe webhook events (e.g. invoice.payment_succeeded)
    console.log('Stripe Webhook Received, length:', rawBody.length, 'Signature:', signature ? 'Present' : 'Missing');

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
