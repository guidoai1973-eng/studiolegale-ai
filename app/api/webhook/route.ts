import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Gestisci eventi Stripe
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  
  const metadata = session.metadata || {};
  const customerEmail = session.customer_email || session.customer_details?.email;

  if (!customerEmail) {
    console.error('No customer email found');
    return;
  }

  // Determina il tipo di acquisto e invia email appropriata
  const purchaseType = metadata.type;

  switch (purchaseType) {
    case 'analisi-ai':
      await sendAnalysisEmail(customerEmail, metadata);
      break;

    case 'template-singolo':
    case 'bundle-3':
      await sendTemplateEmail(customerEmail, metadata, purchaseType);
      break;

    case 'subscription':
      await sendSubscriptionWelcomeEmail(customerEmail);
      break;

    default:
      console.log('Unknown purchase type:', purchaseType);
  }

  // TODO: Salva l'acquisto nel database per la dashboard
  await savePurchaseToDatabase(session);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Logica aggiuntiva se necessario
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  // TODO: Attiva l'accesso Pro per l'utente
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  // TODO: Disattiva l'accesso Pro per l'utente
}

async function sendAnalysisEmail(email: string, metadata: any) {
  try {
    const analysis = metadata.analysis ? JSON.parse(metadata.analysis) : {};
    const suggestions = metadata.suggestions || '';

    await resend.emails.send({
      from: 'StudioLegale-AI <noreply@studiolegale-ai.it>',
      to: email,
      subject: '✓ La tua Analisi AI è pronta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Analisi AI Completata</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">
              Grazie per aver utilizzato StudioLegale-AI.it!
            </p>
            
            <p style="font-size: 16px; color: #374151;">
              La tua analisi legale è stata completata con successo. Trovi il report dettagliato 
              allegato in formato PDF.
            </p>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>⚠️ DISCLAIMER:</strong> Questo documento ha valore informativo. 
                Non costituisce consulenza legale. Si raccomanda di consultare un avvocato 
                per la tua situazione specifica.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
                 style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Vai alla Dashboard
              </a>
            </div>
          </div>

          <div style="padding: 20px; background: #1f2937; color: #9ca3af; font-size: 12px; text-align: center;">
            <p>© 2026 StudioLegale-AI.it - Avv. Guido Motti</p>
            <p>Questo documento non costituisce consulenza legale professionale.</p>
          </div>
        </div>
      `
    });

    console.log('Analysis email sent to:', email);
  } catch (error) {
    console.error('Error sending analysis email:', error);
  }
}

async function sendTemplateEmail(email: string, metadata: any, type: string) {
  try {
    const templateId = metadata.templateId;
    const templateCount = type === 'bundle-3' ? '3 template' : '1 template';

    await resend.emails.send({
      from: 'StudioLegale-AI <noreply@studiolegale-ai.it>',
      to: email,
      subject: `✓ Il tuo Template Legale è pronto`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">📄 Template Generato!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">
              Ottimo! Hai acquistato ${templateCount} con successo.
            </p>
            
            <p style="font-size: 16px; color: #374151;">
              Il documento è stato personalizzato con l'intelligenza artificiale ed è disponibile 
              in formato PDF e DOCX modificabile.
            </p>

            <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #92400e; font-weight: bold;">
                ⚠️ AVVISO IMPORTANTE
              </p>
              <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                Questo documento ha <strong>esclusivo valore informativo</strong>. 
                NON costituisce consulenza legale né può sostituire un avvocato abilitato. 
                Il documento include watermark "Documento informativo - non consulenza legale".
                Si raccomanda la revisione da parte di un professionista prima dell'utilizzo.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
                 style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                📥 Scarica i Documenti
              </a>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>💡 Suggerimento:</strong> Puoi modificare il file DOCX con qualsiasi 
                editor di testo per personalizzarlo ulteriormente.
              </p>
            </div>
          </div>

          <div style="padding: 20px; background: #1f2937; color: #9ca3af; font-size: 12px; text-align: center;">
            <p>© 2026 StudioLegale-AI.it - Avv. Guido Motti</p>
            <p>Documento informativo - non costituisce consulenza legale</p>
          </div>
        </div>
      `
    });

    console.log('Template email sent to:', email);
  } catch (error) {
    console.error('Error sending template email:', error);
  }
}

async function sendSubscriptionWelcomeEmail(email: string) {
  try {
    await resend.emails.send({
      from: 'StudioLegale-AI <noreply@studiolegale-ai.it>',
      to: email,
      subject: '🎉 Benvenuto in StudioLegale-AI Pro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">⭐ Benvenuto in Pro!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 18px; color: #374151; font-weight: bold;">
              Congratulazioni! 🎉
            </p>
            
            <p style="font-size: 16px; color: #374151;">
              Il tuo abbonamento Pro è ora attivo. Hai accesso illimitato a:
            </p>

            <ul style="font-size: 16px; color: #374151; line-height: 2;">
              <li>✓ Tutti i template legali</li>
              <li>✓ Analisi AI illimitate</li>
              <li>✓ Supporto prioritario 24/7</li>
              <li>✓ Dashboard avanzata</li>
              <li>✓ Aggiornamenti in tempo reale</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
                 style="background: #7c3aed; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                Vai alla Dashboard Pro
              </a>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Hai domande?</strong> Il nostro team di supporto è disponibile 24/7 
                per assisterti. Scrivi a support@studiolegale-ai.it
              </p>
            </div>
          </div>

          <div style="padding: 20px; background: #1f2937; color: #9ca3af; font-size: 12px; text-align: center;">
            <p>© 2026 StudioLegale-AI.it - Avv. Guido Motti</p>
            <p>Puoi gestire il tuo abbonamento dalla dashboard</p>
          </div>
        </div>
      `
    });

    console.log('Subscription welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending subscription email:', error);
  }
}

async function savePurchaseToDatabase(session: Stripe.Checkout.Session) {
  // TODO: Implementa salvataggio nel database
  // Per ora solo log
  console.log('Purchase to save:', {
    sessionId: session.id,
    email: session.customer_email,
    amount: session.amount_total,
    metadata: session.metadata
  });
}
