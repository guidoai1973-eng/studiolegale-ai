import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userEmail, analysis, suggestions } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email richiesta' },
        { status: 400 }
      );
    }

    // Crea sessione checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Parere Legale AI - Analisi Approfondita',
              description: 'Report PDF dettagliato con analisi del caso e suggerimenti pratici',
            },
            unit_amount: 1000, // €10.00 in centesimi
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}`,
      customer_email: userEmail,
      metadata: {
        conversationId: conversationId || '',
        analysis: JSON.stringify(analysis || {}),
        suggestions: suggestions || '',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Errore checkout:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione del checkout', details: error.message },
      { status: 500 }
    );
  }
}
