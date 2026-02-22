import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '124994629';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_TO = 'guido.motti@gmail.com';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// StudioLegale-AI.it - Registrazione Partner Studios - Updated 2026-02-22 18:50 - Remove file ops
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
    
    console.log('Resend API key presente:', !!RESEND_API_KEY);
    console.log('Token Telegram presente:', !!TELEGRAM_BOT_TOKEN);
    console.log('Chat ID configurato:', TELEGRAM_CHAT_ID);

    // Formatta messaggio Telegram
    const messageTelegram = `
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

    // Invia EMAIL via Resend
    console.log('Tentativo invio email...');
    if (resend && RESEND_API_KEY) {
      try {
        console.log('Resend configurato, invio email...');
        
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
    .info-row { margin: 5px 0; }
    .label { font-weight: bold; color: #4b5563; }
    .value { color: #111827; }
    .ai-badge { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 6px; margin: 10px 0; text-align: center; }
    .checklist { background: #dbeafe; padding: 15px; border-radius: 6px; margin-top: 20px; }
    .checklist h4 { margin-top: 0; color: #1e40af; }
    ul { margin: 10px 0; padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🤖 Nuova Registrazione Partner</h1>
      <p style="margin: 5px 0 0 0;">StudioLegale-AI.it</p>
    </div>
    <div class="content">
      
      <div class="ai-badge">
        <div style="font-size: 18px; font-weight: bold;">🎯 AI-Powered Legal Matching</div>
        <div style="font-size: 14px; margin-top: 5px;">Richiesta di registrazione Partner Studio</div>
      </div>
      
      <div class="section">
        <div class="section-title">👤 Dati Avvocato</div>
        <div class="info-row"><span class="label">Nome:</span> <span class="value">${nome} ${cognome}</span></div>
        ${studio ? `<div class="info-row"><span class="label">Studio:</span> <span class="value">${studio}</span></div>` : ''}
        <div class="info-row"><span class="label">Città:</span> <span class="value">${citta}${provincia ? ` (${provincia})` : ''}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">📞 Contatti</div>
        <div class="info-row"><span class="label">Telefono:</span> <span class="value">${telefono}</span></div>
        <div class="info-row"><span class="label">Email:</span> <span class="value"><a href="mailto:${email}">${email}</a></span></div>
        ${sitoWeb ? `<div class="info-row"><span class="label">Sito Web:</span> <span class="value"><a href="${sitoWeb}" target="_blank">${sitoWeb}</a></span></div>` : ''}
      </div>
      
      ${numeroIscrizione || foro ? `
      <div class="section">
        <div class="section-title">⚖️ Abilitazione Professionale</div>
        ${numeroIscrizione ? `<div class="info-row"><span class="label">N. Iscrizione Albo:</span> <span class="value">${numeroIscrizione}</span></div>` : ''}
        ${foro ? `<div class="info-row"><span class="label">Foro:</span> <span class="value">${foro}</span></div>` : ''}
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">📋 Specializzazioni</div>
        <div class="info-row">
          <span class="value">${Array.isArray(specializzazioni) ? specializzazioni.join(', ') : specializzazioni || 'Non specificate'}</span>
        </div>
      </div>
      
      ${note ? `
      <div class="section">
        <div class="section-title">📝 Note Aggiuntive</div>
        <div class="info-row"><span class="value">${note}</span></div>
      </div>
      ` : ''}
      
      <div class="checklist">
        <h4>✅ Prossimi Step:</h4>
        <ul>
          <li>Verificare iscrizione Albo professionale</li>
          <li>Setup profilo AI matching system</li>
          <li>Generare credenziali dashboard partner</li>
          <li>Inviare email benvenuto + guida partner</li>
        </ul>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Ricevuto il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}</p>
        <p>StudioLegale-AI.it - Assistente Legale AI Powered</p>
      </div>
      
    </div>
  </div>
</body>
</html>
        `.trim();

        const emailResponse = await resend.emails.send({
          from: 'StudioLegale-AI <partner@studiolegale-ai.it>',
          to: [EMAIL_TO],
          subject: `🤖 Nuova Registrazione Partner: ${nome} ${cognome}`,
          html: emailHtml,
          text: messageTelegram
        });

        console.log('Email response:', JSON.stringify(emailResponse, null, 2));
        console.log('✅ Email inviata con successo!');
        
      } catch (emailError) {
        console.error('❌ Email send error:', emailError);
        // Non bloccare la registrazione se email fallisce
      }
    } else {
      console.warn('⚠️ Resend API key NON configurata! Email non inviata.');
    }

    // Invia notifica Telegram (fallback)
    console.log('Tentativo invio Telegram...');
    if (TELEGRAM_BOT_TOKEN) {
      try {
        console.log('Token presente, invio messaggio...');
        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageTelegram,
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
        console.error('❌ Telegram send error:', telegramError);
      }
    }

    // Log per debugging
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
