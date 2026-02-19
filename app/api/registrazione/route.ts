import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '124994629';

// StudioLegale-AI.it - Registrazione Partner Studios
export async function POST(request: Request) {
  try {
    console.log('=== INIZIO REGISTRAZIONE STUDIOLEGALE-AI ===');
    const data = await request.json();
    console.log('Dati ricevuti:', JSON.stringify(data, null, 2));
    
    const {
      nome,
      cognome,
      studio,
      citta,
      provincia,
      telefono,
      email,
      specializzazioni,
      numeroIscrizione,
      foro,
      sitoWeb,
      note
    } = data;
    
    console.log('Token Telegram presente:', !!TELEGRAM_BOT_TOKEN);
    console.log('Chat ID configurato:', TELEGRAM_CHAT_ID);

    // Formatta messaggio Telegram
    const message = `
🤖 *NUOVA REGISTRAZIONE STUDIOLEGALE-AI.IT*

👤 *Dati Avvocato:*
Nome: ${nome} ${cognome}
Studio: ${studio || 'N/A'}
Città: ${citta}${provincia ? ` (${provincia})` : ''}

📞 *Contatti:*
Tel: ${telefono}
Email: ${email}
${sitoWeb ? `Sito: ${sitoWeb}` : ''}

⚖️ *Abilitazione:*
${numeroIscrizione ? `N. Iscrizione Albo: ${numeroIscrizione}` : ''}
${foro ? `Foro: ${foro}` : ''}

📋 *Specializzazioni:*
${Array.isArray(specializzazioni) ? specializzazioni.join(', ') : specializzazioni || 'N/A'}

${note ? `📝 Note: ${note}` : ''}

---
✅ *Da fare:*
1. Verificare iscrizione Albo
2. Setup profilo AI matching
3. Inviare credenziali dashboard
4. Email benvenuto + guida partner
`.trim();

    // Invia notifica Telegram
    console.log('Tentativo invio Telegram...');
    if (TELEGRAM_BOT_TOKEN) {
      try {
        console.log('Token presente, invio messaggio...');
        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
          })
        });

        const telegramResult = await telegramResponse.json();
        console.log('Telegram response:', JSON.stringify(telegramResult, null, 2));
        
        if (!telegramResponse.ok) {
          console.error('Telegram API error:', telegramResult);
        } else {
          console.log('✅ Telegram inviato con successo!');
        }
      } catch (telegramError) {
        console.error('Telegram send error:', telegramError);
        // Non bloccare la registrazione se Telegram fallisce
      }
    } else {
      console.warn('⚠️ Token Telegram NON configurato!');
    }

    // Log per debugging (visibile in Vercel logs)
    console.log('Registrazione ricevuta:', { email, citta, timestamp: new Date().toISOString() });
    console.log('=== FINE REGISTRAZIONE (SUCCESSO) ===');

    return NextResponse.json({ 
      success: true,
      message: 'Iscrizione ricevuta! Ti contatteremo entro 24 ore per attivare il tuo profilo partner.'
    });

  } catch (error) {
    console.error('=== ERRORE REGISTRAZIONE ===');
    console.error('Tipo errore:', error instanceof Error ? error.name : typeof error);
    console.error('Messaggio:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Errore durante la registrazione. Riprova tra qualche minuto.',
        debug: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
