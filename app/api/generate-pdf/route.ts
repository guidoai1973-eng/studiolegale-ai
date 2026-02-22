import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization
function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY non configurata');
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, analysis, userEmail } = await request.json();

    // Genera parere legale dettagliato con Claude
    const parerePrompt = `Genera un parere legale professionale e dettagliato per questo caso:

CASO: "${message}"

ANALISI PRELIMINARE:
- Tipo di causa: ${analysis?.tipo_causa || 'non specificato'}
- Specializzazione necessaria: ${analysis?.specializzazione_necessaria || 'non specificata'}
- Urgenza: ${analysis?.urgenza || 'media'}
- Città preferita: ${analysis?.citta_preferita || 'non specificata'}

ISTRUZIONI:
Genera un parere legale strutturato così:

1. INQUADRAMENTO GIURIDICO (2-3 paragrafi)
   - Normativa applicabile
   - Principi giurisprudenziali rilevanti
   - Contesto giuridico del caso

2. ANALISI FATTUALE (2-3 paragrafi)
   - Elementi rilevanti del caso
   - Aspetti critici da approfondire
   - Documenti necessari

3. STRATEGIE CONSIGLIATE (3-4 punti)
   - Opzioni disponibili
   - Vantaggi e svantaggi di ciascuna
   - Raccomandazione principale

4. PASSI SUCCESSIVI (5-6 punti)
   - Azioni immediate da intraprendere
   - Timeline indicativa
   - Documentazione da preparare

5. DOMANDE DA FARE ALL'AVVOCATO (8-10 domande)
   - Domande specifiche per la prima consultazione
   - Focus su aspetti pratici e costi

IMPORTANTE:
- Scrivi in italiano professionale ma comprensibile
- Sii specifico e pratico
- Cita normative reali quando possibile
- Includi avvertenze appropriate
- Lunghezza: 1500-2000 parole

DISCLAIMER FINALE:
"Questo parere è stato generato da un'intelligenza artificiale e ha valore puramente informativo. Non costituisce consulenza legale professionale. Per una valutazione definitiva del caso, si consiglia di consultare un avvocato specializzato."`;

    const anthropic = getAnthropic();
    const parereMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'Sei un avvocato esperto che redige pareri legali dettagliati e professionali. I tuoi pareri sono strutturati, citano normativa reale quando possibile, e forniscono consigli pratici concreti.',
      messages: [
        {
          role: 'user',
          content: parerePrompt,
        },
      ],
    });

    const parereText = parereMessage.content[0].type === 'text'
      ? parereMessage.content[0].text
      : '';

    // Aggiungi contatto per pareri approfonditi
    const parereCompleto = parereText + '\n\n---\n\n💼 **Hai bisogno di supporto legale personalizzato?**\n\nPer una consulenza approfondita con un avvocato, contattami:\n\n📧 **guido.motti@gmail.com**\n\nRiceverai risposta entro 24 ore.';

    // Invia email con PDF (simulato per ora - da implementare con servizio email)
    console.log('Email destinatario:', userEmail);
    console.log('Parere generato:', parereCompleto.substring(0, 200) + '...');

    // Notifica Telegram admin
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
            text: `🎯 **Nuovo Parere Acquistato - StudioLegale-AI**\n\n💰 Importo: €10.00\n📧 Cliente: ${userEmail}\n📝 Caso: ${message.substring(0, 100)}...\n\n✅ PDF generato e inviato`,
            parse_mode: 'Markdown',
          }),
        });
      } catch (e) {
        console.error('Errore notifica Telegram:', e);
      }
    }

    return NextResponse.json({
      success: true,
      parere: parereCompleto,
      userEmail,
    });

  } catch (error: any) {
    console.error('Errore generazione parere:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione del parere', details: error.message },
      { status: 500 }
    );
  }
}
