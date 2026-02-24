import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import Stripe from 'stripe';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

interface TemplateRequest {
  templateId: string;
  formData: Record<string, string>;
  userEmail: string;
}

// Template prompts per Claude
const templatePrompts: Record<string, string> = {
  'contratto-affitto': `Genera un contratto di locazione ad uso abitativo professionale e completo in italiano, 
basato sui seguenti dati forniti dall'utente. Il contratto deve essere conforme alla legge italiana vigente.

Dati forniti:
{DATA}

Struttura richiesta:
- Intestazione con "CONTRATTO DI LOCAZIONE AD USO ABITATIVO"
- Premesse con identificazione delle parti
- Oggetto del contratto (descrizione immobile)
- Durata e decorrenza
- Canone e modalità di pagamento
- Obblighi del locatore
- Obblighi del conduttore
- Clausole sulla cauzione
- Clausole finali (foro competente, registrazione, ecc.)
- Firme

Importante: usa un linguaggio legale appropriato ma chiaro. Includi tutti gli articoli necessari.`,

  'nda': `Genera un Accordo di Non Divulgazione (NDA) completo e professionale in italiano.

Dati forniti:
{DATA}

Struttura:
- Premesse e definizioni
- Informazioni confidenziali (definizione)
- Obblighi della parte ricevente
- Esclusioni dalle informazioni confidenziali
- Durata dell'accordo
- Proprietà delle informazioni
- Restituzione dei materiali
- Conseguenze della violazione
- Clausole finali (legge applicabile, foro competente)
- Firme`,

  'privacy-policy': `Genera una Privacy Policy completa e conforme al GDPR in italiano.

Dati forniti:
{DATA}

Struttura richiesta:
- Introduzione e scopo
- Titolare del trattamento e contatti
- Tipologie di dati raccolti
- Finalità del trattamento e base giuridica
- Modalità di trattamento
- Conservazione dei dati
- Condivisione con terzi
- Trasferimenti internazionali (se applicabile)
- Cookie e tecnologie di tracciamento
- Diritti dell'interessato (accesso, rettifica, cancellazione, ecc.)
- Modalità di esercizio dei diritti
- Modifiche alla privacy policy`,

  'prestazione-occasionale': `Genera un contratto di prestazione occasionale completo.

Dati forniti:
{DATA}

Includi:
- Identificazione parti
- Oggetto della prestazione (dettagliato)
- Corrispettivo e modalità di pagamento
- Tempi di esecuzione
- Obblighi del prestatore
- Obblighi del committente
- Regime fiscale e previdenziale
- Esclusione di subordinazione
- Clausole finali`,

  'diffida': `Genera una lettera di diffida formale e legalmente efficace.

Dati forniti:
{DATA}

Struttura:
- Intestazione formale
- Dati mittente e destinatario
- Oggetto
- Premesse (fatti e contesto)
- Fondamento giuridico della pretesa
- Diffida vera e propria
- Termine per adempiere
- Conseguenze legali in caso di inadempimento
- Riserva di ogni azione legale
- Luogo, data e firma`,

  'recesso': `Genera una comunicazione di recesso formale da contratto.

Dati forniti:
{DATA}

Includi:
- Intestazione
- Dati delle parti
- Riferimento al contratto
- Dichiarazione di recesso
- Motivazione (se richiesta)
- Riferimento normativo/clausola contrattuale
- Data di efficacia del recesso
- Eventuali conseguenze patrimoniali
- Disponibilità a collaborare per chiusura rapporto`,

  'gdpr-compliance': `Genera un kit completo per la compliance GDPR composto da:
1. Privacy Policy
2. Cookie Policy
3. Modulo di consenso al trattamento dati
4. Informativa breve per form contatti

Dati forniti:
{DATA}

Ogni documento deve essere completo, professionale e conforme al GDPR.`,

  'consulenza': `Genera un contratto di consulenza professionale.

Dati forniti:
{DATA}

Struttura:
- Premesse e oggetto
- Obblighi del consulente
- Obblighi del cliente
- Corrispettivo e modalità di pagamento
- Durata e recesso
- Proprietà intellettuale
- Riservatezza
- Responsabilità e limitazioni
- Legge applicabile e foro competente`,

  'liberatoria': `Genera una liberatoria per l'uso di immagini/video conforme alla privacy.

Dati forniti:
{DATA}

Includi:
- Identificazione interessato (e genitore se minore)
- Identificazione beneficiario
- Descrizione contenuti autorizzati
- Finalità di utilizzo
- Durata autorizzazione
- Ambito territoriale
- Compenso (se previsto)
- Diritti dell'interessato
- Revoca (se possibile)
- Clausole GDPR`,

  'separazione-beni': `Genera una convenzione matrimoniale di separazione dei beni.

Dati forniti:
{DATA}

Struttura:
- Comparizione e identificazione coniugi
- Dichiarazione di scelta del regime di separazione dei beni
- Effetti della separazione
- Beni personali di ciascun coniuge
- Spese familiari
- Clausole finali
- Note sulla necessità di atto pubblico notarile`
};

export async function POST(request: NextRequest) {
  try {
    const body: TemplateRequest = await request.json();
    const { templateId, formData, userEmail } = body;

    if (!templatePrompts[templateId]) {
      return NextResponse.json(
        { error: 'Template non trovato' },
        { status: 404 }
      );
    }

    // Prepara i dati per Claude
    const dataString = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = templatePrompts[templateId].replace('{DATA}', dataString);

    // Genera il documento con Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const documentContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Aggiungi disclaimer e watermark
    const disclaimerHeader = `
═══════════════════════════════════════════════════════════════════
⚠️  DOCUMENTO INFORMATIVO - NON COSTITUISCE CONSULENZA LEGALE  ⚠️
═══════════════════════════════════════════════════════════════════

Questo documento è stato generato automaticamente tramite intelligenza 
artificiale per finalità esclusivamente informative e divulgative.

NON costituisce consulenza legale personalizzata né può sostituire 
l'assistenza di un avvocato abilitato.

Per situazioni specifiche è indispensabile rivolgersi a un professionista.
L'utilizzo di questo documento è a esclusivo rischio dell'utente.

Generato da: StudioLegale-AI.it - Avv. Guido Motti
Data: ${new Date().toLocaleDateString('it-IT')}

═══════════════════════════════════════════════════════════════════
`;

    const disclaimerFooter = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCLAIMER LEGALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Il presente documento ha esclusivo valore informativo. Non costituisce
consulenza legale né parere legale. Si raccomanda la revisione da parte
di un avvocato prima dell'utilizzo per scopi vincolanti.

StudioLegale-AI.it e l'Avv. Guido Motti declinano ogni responsabilità
per danni derivanti dall'utilizzo di questo documento.

© 2026 StudioLegale-AI.it - Tutti i diritti riservati
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const fullDocument = disclaimerHeader + '\n\n' + documentContent + '\n\n' + disclaimerFooter;

    // Crea checkout Stripe per il pagamento
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Template: ${templateId}`,
              description: 'Documento legale generato con AI',
            },
            unit_amount: 990, // €9.90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/templates/${templateId}`,
      customer_email: userEmail,
      metadata: {
        templateId,
        documentContent: Buffer.from(fullDocument).toString('base64'), // Store for webhook
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Errore generazione template:', error);
    return NextResponse.json(
      { error: 'Errore nella generazione del documento' },
      { status: 500 }
    );
  }
}
