import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization - solo quando serve, non durante il build
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY non configurata');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
}

// Price IDs mapping per i vari tier
const PRICE_CONFIG: Record<string, { amount: number; name: string; description: string }> = {
  'analisi-ai': {
    amount: 1990,
    name: 'Analisi AI del Caso Legale',
    description: 'Report PDF dettagliato con analisi approfondita e suggerimenti pratici'
  },
  'template-singolo': {
    amount: 990,
    name: 'Template Legale Singolo',
    description: 'Documento legale personalizzato in PDF e DOCX'
  },
  'bundle-3': {
    amount: 2490,
    name: 'Bundle 3 Template',
    description: '3 template legali a scelta con personalizzazione AI'
  },
  'abbonamento': {
    amount: 2900,
    name: 'Abbonamento Pro',
    description: 'Accesso illimitato a template e analisi AI'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      priceId, 
      userEmail, 
      conversationId, 
      analysis, 
      suggestions,
      templateId,
      formData,
      billingPeriod = 'monthly',
      quantity = 1
    } = body;

    if (!userEmail && !body.customer_email) {
      return NextResponse.json(
        { error: 'Email richiesta' },
        { status: 400 }
      );
    }

    const email = userEmail || body.customer_email;
    const stripe = getStripe();

    // Determina il tipo di checkout
    let sessionParams: Stripe.Checkout.SessionCreateParams;

    if (priceId === 'abbonamento') {
      // Checkout per abbonamento ricorrente
      sessionParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: PRICE_CONFIG['abbonamento'].name,
                description: PRICE_CONFIG['abbonamento'].description,
              },
              unit_amount: PRICE_CONFIG['abbonamento'].amount,
              recurring: {
                interval: billingPeriod === 'yearly' ? 'year' : 'month'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}/pricing`,
        customer_email: email,
        metadata: {
          type: 'subscription',
          plan: 'pro'
        },
      };
    } else {
      // Checkout one-time per template o analisi
      const config = PRICE_CONFIG[priceId];
      
      if (!config) {
        return NextResponse.json(
          { error: 'Prodotto non valido' },
          { status: 400 }
        );
      }

      sessionParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: config.name,
                description: config.description,
              },
              unit_amount: config.amount,
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get('origin')}${templateId ? `/templates/${templateId}` : '/pricing'}`,
        customer_email: email,
        metadata: {
          type: priceId,
          conversationId: conversationId || '',
          templateId: templateId || '',
          analysis: analysis ? JSON.stringify(analysis).substring(0, 500) : '',
          suggestions: suggestions ? suggestions.substring(0, 500) : '',
          formData: formData ? JSON.stringify(formData).substring(0, 500) : ''
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });

  } catch (error: any) {
    console.error('Errore checkout:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione del checkout', details: error.message },
      { status: 500 }
    );
  }
}
